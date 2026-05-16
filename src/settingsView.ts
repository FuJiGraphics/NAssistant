import type * as vscode from 'vscode';
import { ConfigurationTarget, env, Uri, window, workspace } from 'vscode';

import {
  ASSISTANT_TARGET_SETTING,
  type AssistantTarget,
  getAssistantTargetLabel,
  isAssistantTarget
} from './assistantTargets';
import type { NAssistantState, NAssistantTab } from './appState';
import { copyFileReferenceForAi, openShortcutEditor, pasteContextToAssistant } from './commands';
import { CONFIG_SECTION } from './constants';
import {
  type ExplorerNode,
  createExplorerState,
  readExplorerChildren
} from './explorerTree';
import {
  type ExplorerCreateKind,
  type ExternalDroppedFile,
  copyExternalFilesToExplorer,
  createExplorerItem,
  deleteExplorerItems,
  moveExplorerItems,
  renameExplorerItem
} from './explorerOperations';
import { type FeatureId, getFeatureDefinition, getSettingsState, isFeatureId } from './features';
import { setFolderHiddenFromExplorer } from './folderVisibility';
import { type WorkspaceGitStatus, getWorkspaceGitStatuses } from './gitStatus';
import { showStatusMessage } from './notifications';
import { createSettingsHtml } from './settingsHtml';

type NAssistantMessage =
  | {
      type: 'ready';
    }
  | {
      type: 'refresh';
    }
  | {
      type: 'setActiveTab';
      tab: NAssistantTab;
    }
  | {
      type: 'loadExplorerChildren';
      uri: string;
      expanded: boolean;
    }
  | {
      type: 'toggleExplorerFolderHidden';
      uri: string;
      hidden: boolean;
    }
  | {
      type: 'copyExplorerReference';
      uri: string;
    }
  | {
      type: 'pasteExplorerContext';
      uri: string;
    }
  | {
      type: 'copyExplorerReferences';
      uris: string[];
    }
  | {
      type: 'pasteExplorerContexts';
      uris: string[];
    }
  | {
      type: 'createExplorerItem';
      parentUri: string;
      name: string;
      kind: ExplorerCreateKind;
    }
  | {
      type: 'renameExplorerItem';
      uri: string;
      name: string;
    }
  | {
      type: 'deleteExplorerItems';
      uris: string[];
    }
  | {
      type: 'moveExplorerItems';
      uris: string[];
      targetUri: string;
    }
  | {
      type: 'copyExternalFiles';
      targetUri: string;
      files: ExternalDroppedFile[];
    }
  | {
      type: 'openExplorerFile';
      uri: string;
    }
  | {
      type: 'refreshExplorer';
    }
  | {
      type: 'toggleFeature';
      featureId: FeatureId;
      enabled: boolean;
    }
  | {
      type: 'setAssistantTarget';
      target: AssistantTarget;
    }
  | {
      type: 'openShortcutEditor';
      command: string;
    }
  | {
      type: 'copyCommandId';
      command: string;
    };

export class SettingsViewProvider implements vscode.WebviewViewProvider, vscode.Disposable {
  private view?: vscode.WebviewView;
  private activeTab: NAssistantTab = 'explorer';
  private readonly expandedExplorerUris = new Set<string>();
  private explorerChildrenByParentUri = new Map<string, ExplorerNode[]>();
  private gitStatuses = new Map<string, WorkspaceGitStatus>();
  private readonly expansionRequestVersions = new Map<string, number>();
  private expansionRequestSequence = 0;
  private readonly disposables: vscode.Disposable[] = [];
  private refreshTimer?: NodeJS.Timeout;

  constructor() {
    const watcher = workspace.createFileSystemWatcher('**/*');

    this.disposables.push(
      watcher,
      watcher.onDidCreate(() => this.scheduleRefresh()),
      watcher.onDidChange(() => this.scheduleRefresh()),
      watcher.onDidDelete(() => this.scheduleRefresh()),
      workspace.onDidChangeWorkspaceFolders(() => this.scheduleRefresh())
    );
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.onDidReceiveMessage((message: unknown) => {
      void this.handleMessage(message);
    });
    this.renderHtml();
  }

  refresh(): void {
    void this.refreshExplorerData();
  }

  dispose(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    for (const disposable of this.disposables) {
      disposable.dispose();
    }
  }

  private async handleMessage(message: unknown): Promise<void> {
    if (!isNAssistantMessage(message)) {
      return;
    }

    switch (message.type) {
      case 'ready':
        await this.refreshExplorerData();
        return;

      case 'refresh':
        this.postState();
        return;

      case 'setActiveTab':
        this.activeTab = message.tab;
        this.postState();
        return;

      case 'loadExplorerChildren':
        await this.updateExplorerExpansion(message.uri, message.expanded);
        return;

      case 'toggleExplorerFolderHidden':
        await this.toggleExplorerFolderHidden(message.uri, message.hidden);
        return;

      case 'copyExplorerReference':
        await copyFileReferenceForAi(Uri.parse(message.uri));
        return;

      case 'pasteExplorerContext':
        await pasteContextToAssistant(Uri.parse(message.uri));
        return;

      case 'copyExplorerReferences':
        await this.copyExplorerReferences(message.uris);
        return;

      case 'pasteExplorerContexts':
        await this.pasteExplorerContexts(message.uris);
        return;

      case 'createExplorerItem':
        await this.createExplorerItem(message.parentUri, message.name, message.kind);
        return;

      case 'renameExplorerItem':
        await this.renameExplorerItem(message.uri, message.name);
        return;

      case 'deleteExplorerItems':
        await this.deleteExplorerItems(message.uris);
        return;

      case 'moveExplorerItems':
        await this.moveExplorerItems(message.uris, message.targetUri);
        return;

      case 'copyExternalFiles':
        await this.copyExternalFiles(message.targetUri, message.files);
        return;

      case 'openExplorerFile':
        await window.showTextDocument(Uri.parse(message.uri));
        return;

      case 'refreshExplorer':
        this.expandedExplorerUris.clear();
        this.explorerChildrenByParentUri.clear();
        this.expansionRequestVersions.clear();
        await this.refreshExplorerData();
        return;

      case 'toggleFeature':
        await this.updateFeature(message.featureId, message.enabled);
        return;

      case 'setAssistantTarget':
        await this.updateAssistantTarget(message.target);
        return;

      case 'openShortcutEditor':
        await openShortcutEditor(message.command);
        return;

      case 'copyCommandId':
        await env.clipboard.writeText(message.command);
        showStatusMessage(`NAssistant: Copied ${message.command}`, 2000);
        return;
    }
  }

  private async updateFeature(featureId: FeatureId, enabled: boolean): Promise<void> {
    const feature = getFeatureDefinition(featureId);

    if (!feature) {
      return;
    }

    await workspace
      .getConfiguration(CONFIG_SECTION)
      .update(feature.setting, enabled, ConfigurationTarget.Global);
    this.postState();
  }

  private async updateAssistantTarget(target: AssistantTarget): Promise<void> {
    await workspace
      .getConfiguration(CONFIG_SECTION)
      .update(ASSISTANT_TARGET_SETTING, target, ConfigurationTarget.Global);
    this.postState();
    showStatusMessage(`NAssistant: Paste target set to ${getAssistantTargetLabel(target)}.`, 2000);
  }

  private async updateExplorerExpansion(uri: string, expanded: boolean): Promise<void> {
    const requestVersion = this.nextExplorerExpansionVersion(uri);

    if (!expanded) {
      this.expandedExplorerUris.delete(uri);
      this.postState();
      return;
    }

    const resource = Uri.parse(uri);

    this.expandedExplorerUris.add(uri);
    this.postState();

    const children = await readExplorerChildren(resource, this.expandedExplorerUris, this.gitStatuses);

    if (
      !this.isLatestExplorerExpansionRequest(uri, requestVersion) ||
      !this.expandedExplorerUris.has(uri)
    ) {
      return;
    }

    this.explorerChildrenByParentUri.set(uri, children);
    this.postState();
  }

  private async toggleExplorerFolderHidden(uri: string, hidden: boolean): Promise<void> {
    const changed = await setFolderHiddenFromExplorer(Uri.parse(uri), hidden);

    await this.refreshLoadedExplorerChildren();
    this.postState();

    if (changed) {
      showStatusMessage(
        hidden
          ? 'NAssistant: Hidden folder from Explorer.'
          : 'NAssistant: Restored folder in Explorer.',
        2500
      );
      return;
    }

    showStatusMessage('NAssistant: Folder visibility is already up to date.', 2500);
  }

  private async copyExplorerReferences(uris: readonly string[]): Promise<void> {
    const resources = uris.map((uri) => Uri.parse(uri));

    await copyFileReferenceForAi(resources[0], resources);
  }

  private async pasteExplorerContexts(uris: readonly string[]): Promise<void> {
    const resources = uris.map((uri) => Uri.parse(uri));

    await pasteContextToAssistant(resources[0], resources);
  }

  private async createExplorerItem(
    parentUri: string,
    name: string,
    kind: ExplorerCreateKind
  ): Promise<void> {
    const createdUri = await createExplorerItem(Uri.parse(parentUri), name, kind);

    if (createdUri) {
      this.expandedExplorerUris.add(parentUri);
      await this.refreshExplorerData();
    }
  }

  private async renameExplorerItem(uri: string, name: string): Promise<void> {
    const renamedUri = await renameExplorerItem(Uri.parse(uri), name);

    if (renamedUri) {
      this.replaceExpandedUri(uri, renamedUri.toString());
      await this.refreshExplorerData();
    }
  }

  private async deleteExplorerItems(uris: readonly string[]): Promise<void> {
    const deleted = await deleteExplorerItems(uris.map((uri) => Uri.parse(uri)));

    if (deleted) {
      for (const uri of uris) {
        this.expandedExplorerUris.delete(uri);
        this.explorerChildrenByParentUri.delete(uri);
      }

      await this.refreshExplorerData();
    }
  }

  private async moveExplorerItems(uris: readonly string[], targetUri: string): Promise<void> {
    const moved = await moveExplorerItems(
      uris.map((uri) => Uri.parse(uri)),
      Uri.parse(targetUri)
    );

    if (moved) {
      await this.refreshExplorerData();
    }
  }

  private async copyExternalFiles(
    targetUri: string,
    files: readonly ExternalDroppedFile[]
  ): Promise<void> {
    const copied = await copyExternalFilesToExplorer(Uri.parse(targetUri), files);

    if (copied) {
      await this.refreshExplorerData();
    }
  }

  private async refreshExplorerData(): Promise<void> {
    await this.refreshGitStatuses();
    await this.refreshLoadedExplorerChildren();
    this.postState();
  }

  private async refreshLoadedExplorerChildren(): Promise<void> {
    const nextChildren = new Map<string, ExplorerNode[]>();

    for (const parentUri of this.explorerChildrenByParentUri.keys()) {
      nextChildren.set(
        parentUri,
        await readExplorerChildren(Uri.parse(parentUri), this.expandedExplorerUris, this.gitStatuses)
      );
    }

    this.explorerChildrenByParentUri = nextChildren;
  }

  private async refreshGitStatuses(): Promise<void> {
    this.gitStatuses = await getWorkspaceGitStatuses(workspace.workspaceFolders ?? []);
  }

  private scheduleRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    this.refreshTimer = setTimeout(() => {
      void this.refreshExplorerData();
    }, 250);
  }

  private replaceExpandedUri(previousUri: string, nextUri: string): void {
    if (this.expandedExplorerUris.delete(previousUri)) {
      this.expandedExplorerUris.add(nextUri);
    }
  }

  private nextExplorerExpansionVersion(uri: string): number {
    const nextVersion = this.expansionRequestSequence + 1;

    this.expansionRequestSequence = nextVersion;
    this.expansionRequestVersions.set(uri, nextVersion);

    return nextVersion;
  }

  private isLatestExplorerExpansionRequest(uri: string, requestVersion: number): boolean {
    return this.expansionRequestVersions.get(uri) === requestVersion;
  }

  private postState(): void {
    this.view?.webview.postMessage({
      type: 'state',
      state: this.getState()
    });
  }

  private getState(): NAssistantState {
    return {
      activeTab: this.activeTab,
      explorer: createExplorerState(
        this.expandedExplorerUris,
        this.explorerChildrenByParentUri,
        this.gitStatuses
      ),
      settings: getSettingsState()
    };
  }

  private renderHtml(): void {
    if (!this.view) {
      return;
    }

    this.view.webview.html = createSettingsHtml(this.getState());
  }
}

function isNAssistantMessage(message: unknown): message is NAssistantMessage {
  if (!message || typeof message !== 'object') {
    return false;
  }

  const candidate = message as Partial<NAssistantMessage>;

  switch (candidate.type) {
    case 'ready':
    case 'refresh':
    case 'refreshExplorer':
      return true;

    case 'setActiveTab':
      return isNAssistantTab(candidate.tab);

    case 'loadExplorerChildren':
      return typeof candidate.uri === 'string' && typeof candidate.expanded === 'boolean';

    case 'toggleExplorerFolderHidden':
      return typeof candidate.uri === 'string' && typeof candidate.hidden === 'boolean';

    case 'copyExplorerReference':
    case 'pasteExplorerContext':
    case 'openExplorerFile':
      return typeof candidate.uri === 'string';

    case 'copyExplorerReferences':
    case 'pasteExplorerContexts':
      return Array.isArray(candidate.uris) && candidate.uris.every((uri) => typeof uri === 'string');

    case 'createExplorerItem':
      return (
        typeof candidate.parentUri === 'string' &&
        typeof candidate.name === 'string' &&
        isExplorerCreateKind(candidate.kind)
      );

    case 'renameExplorerItem':
      return typeof candidate.uri === 'string' && typeof candidate.name === 'string';

    case 'deleteExplorerItems':
      return Array.isArray(candidate.uris) && candidate.uris.every((uri) => typeof uri === 'string');

    case 'moveExplorerItems':
      return (
        Array.isArray(candidate.uris) &&
        candidate.uris.every((uri) => typeof uri === 'string') &&
        typeof candidate.targetUri === 'string'
      );

    case 'copyExternalFiles':
      return (
        typeof candidate.targetUri === 'string' &&
        Array.isArray(candidate.files) &&
        candidate.files.every(isExternalDroppedFile)
      );

    case 'toggleFeature':
      return isFeatureId(candidate.featureId) && typeof candidate.enabled === 'boolean';

    case 'setAssistantTarget':
      return isAssistantTarget(candidate.target);

    case 'openShortcutEditor':
    case 'copyCommandId':
      return typeof candidate.command === 'string';

    default:
      return false;
  }
}

function isNAssistantTab(value: unknown): value is NAssistantTab {
  return value === 'explorer' || value === 'settings';
}

function isExplorerCreateKind(value: unknown): value is ExplorerCreateKind {
  return value === 'file' || value === 'folder';
}

function isExternalDroppedFile(value: unknown): value is ExternalDroppedFile {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ExternalDroppedFile>;

  return typeof candidate.name === 'string' && typeof candidate.data === 'string';
}
