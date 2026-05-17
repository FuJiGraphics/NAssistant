import type * as vscode from 'vscode';
import { ConfigurationTarget, env, Uri, window, workspace } from 'vscode';
import path from 'path';

import {
  ASSISTANT_TARGET_SETTING,
  type AssistantTarget,
  getAssistantTargetLabel,
  isAssistantTarget
} from './assistantTargets';
import type { NAssistantState, NAssistantTab } from './appState';
import { copyFileReferenceForAi, openShortcutEditor, pasteContextToAssistant } from './commands';
import { CONFIG_SECTION } from './constants';
import { getRelativeResourcePath } from './folderVisibility';
import {
  COLOR_PALETTE_SETTING,
  DEFAULT_COLOR_ID,
  type FileExtensionIconRule,
  type FolderIconRule,
  FILE_EXTENSION_ICONS_SETTING,
  FOLDER_ICONS_SETTING,
  HIDDEN_FILE_EXTENSIONS_SETTING,
  getExplorerAppearanceState,
  getExplorerColorPalette,
  getHiddenFileExtensions,
  isExplorerColorId,
  isExplorerIconId,
  normalizeExplorerColor,
  normalizeHexColor,
  normalizeFileExtension
} from './explorerAppearance';
import {
  type ExplorerSortMode,
  type ExplorerNode,
  createExplorerState,
  getExplorerShowHiddenFoldersSetting,
  getExplorerSortModeSetting,
  isExplorerSortMode,
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

const EXPANDED_EXPLORER_URIS_STATE_KEY = 'nassistant.expandedExplorerUris';

type NAssistantMessage =
  | {
      type: 'ready';
    }
  | {
      type: 'refresh';
    }
  | {
      type: 'showStatusMessage';
      message: string;
      timeout: number;
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
      expandedUris?: string[];
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
      type: 'setExplorerShowHiddenFolders';
      showHiddenFolders: boolean;
    }
  | {
      type: 'setExplorerSortMode';
      sortMode: ExplorerSortMode;
    }
  | {
      type: 'setFolderIcon';
      uri: string;
      icon: string;
      color: string;
    }
  | {
      type: 'setFileExtensionIcon';
      extension: string;
      icon: string;
      color: string;
    }
  | {
      type: 'setFileExtensionHidden';
      extension: string;
      hidden: boolean;
    }
  | {
      type: 'removeFileExtensionRule';
      extension: string;
    }
  | {
      type: 'addExplorerColor';
      color: string;
    }
  | {
      type: 'removeExplorerColor';
      color: string;
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
  private hasSavedExpandedExplorerState = false;
  private refreshTimer?: NodeJS.Timeout;

  constructor(private readonly context: vscode.ExtensionContext) {
    const watcher = workspace.createFileSystemWatcher('**/*');

    this.restoreExpandedExplorerUris();

    this.disposables.push(
      watcher,
      watcher.onDidCreate(() => this.scheduleRefresh()),
      watcher.onDidChange(() => this.scheduleRefresh()),
      watcher.onDidDelete(() => this.scheduleRefresh()),
      workspace.onDidChangeWorkspaceFolders(() => {
        this.ensureDefaultExpandedRoots();
        this.scheduleRefresh();
      })
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

      case 'showStatusMessage':
        showStatusMessage(message.message, message.timeout);
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
        await this.rememberExplorerExpansions(message.expandedUris);
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
        this.explorerChildrenByParentUri.clear();
        this.expansionRequestVersions.clear();
        await this.refreshExplorerData();
        return;

      case 'setExplorerShowHiddenFolders':
        await this.updateExplorerShowHiddenFolders(message.showHiddenFolders);
        return;

      case 'setExplorerSortMode':
        await this.updateExplorerSortMode(message.sortMode);
        return;

      case 'setFolderIcon':
        await this.updateFolderIcon(message.uri, message.icon, message.color);
        return;

      case 'setFileExtensionIcon':
        await this.updateFileExtensionIcon(message.extension, message.icon, message.color);
        return;

      case 'setFileExtensionHidden':
        await this.updateFileExtensionHidden(message.extension, message.hidden);
        return;

      case 'removeFileExtensionRule':
        await this.removeFileExtensionRule(message.extension);
        return;

      case 'addExplorerColor':
        await this.addExplorerColor(message.color);
        return;

      case 'removeExplorerColor':
        await this.removeExplorerColor(message.color);
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

  private async updateExplorerShowHiddenFolders(showHiddenFolders: boolean): Promise<void> {
    await workspace
      .getConfiguration(CONFIG_SECTION)
      .update(getExplorerShowHiddenFoldersSetting(), showHiddenFolders, ConfigurationTarget.Global);
    await this.refreshExplorerData();
  }

  private async updateExplorerSortMode(sortMode: ExplorerSortMode): Promise<void> {
    await workspace
      .getConfiguration(CONFIG_SECTION)
      .update(getExplorerSortModeSetting(), sortMode, ConfigurationTarget.Global);
    this.postState();
  }

  private async updateFolderIcon(uri: string, icon: string, color: string): Promise<void> {
    const resource = Uri.parse(uri);
    const workspaceFolder = workspace.getWorkspaceFolder(resource);

    if (!workspaceFolder) {
      return;
    }

    const relativePath = getRelativeResourcePath(workspaceFolder, resource) ?? '';
    const rules = workspace
      .getConfiguration(CONFIG_SECTION)
      .get<FolderIconRule[]>(FOLDER_ICONS_SETTING, []);
    const nextRules = upsertByKey(rules, 'path', {
      path: relativePath,
      icon,
      color: normalizeExplorerColor(color)
    });

    await workspace
      .getConfiguration(CONFIG_SECTION)
      .update(FOLDER_ICONS_SETTING, nextRules, ConfigurationTarget.Workspace);
    await this.refreshExplorerData();
  }

  private async updateFileExtensionIcon(extension: string, icon: string, color: string): Promise<void> {
    const normalizedExtension = normalizeFileExtension(extension);

    if (!normalizedExtension) {
      return;
    }

    const rules = workspace
      .getConfiguration(CONFIG_SECTION)
      .get<FileExtensionIconRule[]>(FILE_EXTENSION_ICONS_SETTING, []);
    const nextRules = upsertByKey(rules, 'extension', {
      extension: normalizedExtension,
      icon,
      color: normalizeExplorerColor(color)
    });

    await workspace
      .getConfiguration(CONFIG_SECTION)
      .update(FILE_EXTENSION_ICONS_SETTING, nextRules, ConfigurationTarget.Workspace);
    await this.refreshExplorerData();
  }

  private async updateFileExtensionHidden(extension: string, hidden: boolean): Promise<void> {
    const normalizedExtension = normalizeFileExtension(extension);

    if (!normalizedExtension) {
      return;
    }

    const hiddenExtensions = getHiddenFileExtensions();
    const nextHiddenExtensions = hidden
      ? [...new Set([...hiddenExtensions, normalizedExtension])]
      : hiddenExtensions.filter((value) => value !== normalizedExtension);

    await workspace
      .getConfiguration(CONFIG_SECTION)
      .update(HIDDEN_FILE_EXTENSIONS_SETTING, nextHiddenExtensions, ConfigurationTarget.Workspace);
    await this.refreshExplorerData();
  }

  private async removeFileExtensionRule(extension: string): Promise<void> {
    const normalizedExtension = normalizeFileExtension(extension);

    if (!normalizedExtension) {
      return;
    }

    const rules = workspace
      .getConfiguration(CONFIG_SECTION)
      .get<FileExtensionIconRule[]>(FILE_EXTENSION_ICONS_SETTING, []);
    const hiddenExtensions = getHiddenFileExtensions();
    const configuration = workspace.getConfiguration(CONFIG_SECTION);

    await Promise.all([
      configuration.update(
        FILE_EXTENSION_ICONS_SETTING,
        rules.filter((rule) => normalizeFileExtension(rule.extension) !== normalizedExtension),
        ConfigurationTarget.Workspace
      ),
      configuration.update(
        HIDDEN_FILE_EXTENSIONS_SETTING,
        hiddenExtensions.filter((value) => value !== normalizedExtension),
        ConfigurationTarget.Workspace
      )
    ]);
    await this.refreshExplorerData();
  }

  private async addExplorerColor(color: string): Promise<void> {
    const normalizedColor = normalizeHexColor(color);

    if (!normalizedColor) {
      showStatusMessage('NAssistant: Enter a HEX color like #7E5BEF.', 2500);
      return;
    }

    const nextPalette = [...new Set([...getExplorerColorPalette(), normalizedColor])];

    await workspace
      .getConfiguration(CONFIG_SECTION)
      .update(COLOR_PALETTE_SETTING, nextPalette, ConfigurationTarget.Workspace);
    await this.refreshExplorerData();
    showStatusMessage(`NAssistant: Added ${normalizedColor} to Explorer colors.`, 2000);
  }

  private async removeExplorerColor(color: string): Promise<void> {
    const normalizedColor = normalizeHexColor(color);

    if (!normalizedColor) {
      return;
    }

    const configuration = workspace.getConfiguration(CONFIG_SECTION);
    const nextPalette = getExplorerColorPalette().filter((value) => value !== normalizedColor);
    const folderRules = configuration.get<FolderIconRule[]>(FOLDER_ICONS_SETTING, []);
    const fileRules = configuration.get<FileExtensionIconRule[]>(FILE_EXTENSION_ICONS_SETTING, []);

    await Promise.all([
      configuration.update(COLOR_PALETTE_SETTING, nextPalette, ConfigurationTarget.Workspace),
      configuration.update(FOLDER_ICONS_SETTING, resetRuleColor(folderRules, normalizedColor), ConfigurationTarget.Workspace),
      configuration.update(FILE_EXTENSION_ICONS_SETTING, resetRuleColor(fileRules, normalizedColor), ConfigurationTarget.Workspace)
    ]);
    await this.refreshExplorerData();
    showStatusMessage(`NAssistant: Removed ${normalizedColor} from Explorer colors.`, 2000);
  }

  private async updateExplorerExpansion(uri: string, expanded: boolean): Promise<void> {
    const requestVersion = this.nextExplorerExpansionVersion(uri);

    if (!expanded) {
      this.expandedExplorerUris.delete(uri);
      await this.saveExpandedExplorerUris();
      this.postState();
      return;
    }

    const resource = Uri.parse(uri);

    this.expandedExplorerUris.add(uri);
    await this.saveExpandedExplorerUris();
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
      await this.saveExpandedExplorerUris();
      await this.refreshExplorerData();
    }
  }

  private async rememberExplorerExpansions(expandedUris?: readonly string[]): Promise<void> {
    for (const uri of expandedUris ?? []) {
      this.expandedExplorerUris.add(uri);
    }

    await this.saveExpandedExplorerUris();
  }

  private async renameExplorerItem(uri: string, name: string): Promise<void> {
    const renamedUri = await renameExplorerItem(Uri.parse(uri), name);

    if (renamedUri) {
      this.replaceExpandedUriTree(uri, renamedUri.toString());
      await this.saveExpandedExplorerUris();
      await this.refreshExplorerData();
    }
  }

  private async deleteExplorerItems(uris: readonly string[]): Promise<void> {
    const deleted = await deleteExplorerItems(uris.map((uri) => Uri.parse(uri)));

    if (deleted) {
      for (const uri of uris) {
        this.deleteExpandedUriTree(uri);
      }

      await this.saveExpandedExplorerUris();
      await this.refreshExplorerData();
    }
  }

  private async moveExplorerItems(uris: readonly string[], targetUri: string): Promise<void> {
    const targetFolder = Uri.parse(targetUri);
    const moved = await moveExplorerItems(
      uris.map((uri) => Uri.parse(uri)),
      targetFolder
    );

    if (moved) {
      for (const uri of uris) {
        const resource = Uri.parse(uri);
        const nextUri = Uri.joinPath(targetFolder, path.basename(resource.fsPath));

        this.replaceExpandedUriTree(uri, nextUri.toString());
      }

      await this.saveExpandedExplorerUris();
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
    this.ensureDefaultExpandedRoots();
    await this.refreshGitStatuses();
    await this.refreshLoadedExplorerChildren();
    this.postState();
  }

  private async refreshLoadedExplorerChildren(): Promise<void> {
    const parentUris = [...new Set([
      ...this.explorerChildrenByParentUri.keys(),
      ...this.expandedExplorerUris
    ])];

    const childrenLists = await Promise.all(
      parentUris.map((parentUri) =>
        readExplorerChildren(Uri.parse(parentUri), this.expandedExplorerUris, this.gitStatuses)
      )
    );

    this.explorerChildrenByParentUri = new Map(
      parentUris.map((parentUri, index) => [parentUri, childrenLists[index]])
    );
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

  private restoreExpandedExplorerUris(): void {
    const storedUris = this.context.workspaceState.get<string[]>(EXPANDED_EXPLORER_URIS_STATE_KEY);

    if (storedUris) {
      this.hasSavedExpandedExplorerState = true;

      for (const uri of storedUris) {
        this.expandedExplorerUris.add(uri);
      }

      return;
    }

    this.ensureDefaultExpandedRoots();
  }

  private ensureDefaultExpandedRoots(): void {
    if (this.hasSavedExpandedExplorerState) {
      return;
    }

    const workspaceRootUris = (workspace.workspaceFolders ?? [])
      .map((workspaceFolder) => workspaceFolder.uri.toString());

    if (
      workspaceRootUris.length === 0 ||
      workspaceRootUris.some((uri) => this.expandedExplorerUris.has(uri))
    ) {
      return;
    }

    for (const uri of workspaceRootUris) {
      this.expandedExplorerUris.add(uri);
    }
  }

  private async saveExpandedExplorerUris(): Promise<void> {
    this.hasSavedExpandedExplorerState = true;

    await this.context.workspaceState.update(
      EXPANDED_EXPLORER_URIS_STATE_KEY,
      [...this.expandedExplorerUris]
    );
  }

  private replaceExpandedUriTree(previousUri: string, nextUri: string): void {
    const expandedUris = [...this.expandedExplorerUris];

    for (const expandedUri of expandedUris) {
      if (expandedUri === previousUri || expandedUri.startsWith(`${previousUri}/`)) {
        this.expandedExplorerUris.delete(expandedUri);
        this.expandedExplorerUris.add(`${nextUri}${expandedUri.slice(previousUri.length)}`);
      }
    }

    const childrenEntries = [...this.explorerChildrenByParentUri.entries()];

    for (const [parentUri, children] of childrenEntries) {
      if (parentUri === previousUri || parentUri.startsWith(`${previousUri}/`)) {
        this.explorerChildrenByParentUri.delete(parentUri);
        this.explorerChildrenByParentUri.set(`${nextUri}${parentUri.slice(previousUri.length)}`, children);
      }
    }
  }

  private deleteExpandedUriTree(uri: string): void {
    for (const expandedUri of [...this.expandedExplorerUris]) {
      if (expandedUri === uri || expandedUri.startsWith(`${uri}/`)) {
        this.expandedExplorerUris.delete(expandedUri);
      }
    }

    for (const parentUri of [...this.explorerChildrenByParentUri.keys()]) {
      if (parentUri === uri || parentUri.startsWith(`${uri}/`)) {
        this.explorerChildrenByParentUri.delete(parentUri);
      }
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
    const appearance = getExplorerAppearanceState();

    return {
      activeTab: this.activeTab,
      explorer: createExplorerState(
        this.expandedExplorerUris,
        this.explorerChildrenByParentUri,
        this.gitStatuses,
        appearance
      ),
      settings: getSettingsState(appearance)
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

    case 'showStatusMessage':
      return (
        typeof candidate.message === 'string' &&
        candidate.message.length <= 160 &&
        typeof candidate.timeout === 'number' &&
        candidate.timeout >= 500 &&
        candidate.timeout <= 5000
      );

    case 'setExplorerShowHiddenFolders':
      return typeof candidate.showHiddenFolders === 'boolean';

    case 'setExplorerSortMode':
      return isExplorerSortMode(candidate.sortMode);

    case 'setFolderIcon':
      return (
        typeof candidate.uri === 'string' &&
        isExplorerIconId(candidate.icon) &&
        isExplorerColorId(candidate.color)
      );

    case 'setFileExtensionIcon':
      return (
        typeof candidate.extension === 'string' &&
        Boolean(normalizeFileExtension(candidate.extension)) &&
        isExplorerIconId(candidate.icon) &&
        isExplorerColorId(candidate.color)
      );

    case 'setFileExtensionHidden':
      return (
        typeof candidate.extension === 'string' &&
        Boolean(normalizeFileExtension(candidate.extension)) &&
        typeof candidate.hidden === 'boolean'
      );

    case 'removeFileExtensionRule':
      return typeof candidate.extension === 'string' && Boolean(normalizeFileExtension(candidate.extension));

    case 'addExplorerColor':
      return typeof candidate.color === 'string' && candidate.color.length <= 16;

    case 'removeExplorerColor':
      return typeof candidate.color === 'string' && Boolean(normalizeHexColor(candidate.color));

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
        isExplorerCreateKind(candidate.kind) &&
        isOptionalStringArray(candidate.expandedUris)
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

function isOptionalStringArray(value: unknown): value is string[] | undefined {
  return value === undefined || (Array.isArray(value) && value.every((item) => typeof item === 'string'));
}

function upsertByKey<T extends Record<K, string>, K extends keyof T>(
  items: readonly T[],
  key: K,
  nextItem: T
): T[] {
  const nextItems = items.filter((item) => item[key] !== nextItem[key]);

  return [...nextItems, nextItem];
}

function resetRuleColor<T extends { color: string }>(rules: readonly T[], removedColor: string): T[] {
  return rules.map((rule) => {
    if (normalizeHexColor(rule.color) !== removedColor) {
      return rule;
    }

    return {
      ...rule,
      color: DEFAULT_COLOR_ID
    };
  });
}
