import type * as vscode from 'vscode';
import { ConfigurationTarget, FileType, window, workspace } from 'vscode';
import path from 'path';

import { CONFIG_SECTION } from './constants';
import { showStatusMessage } from './notifications';

const FILES_CONFIGURATION_SECTION = 'files';
const FILES_EXCLUDE_SETTING = 'exclude';
const HIDDEN_EXPLORER_FOLDERS_SETTING = 'hiddenExplorerFolders';

export interface HiddenExplorerFolder {
  path: string;
  pattern: string;
}

interface FolderHideTarget {
  workspaceFolder: vscode.WorkspaceFolder;
  path: string;
  pattern: string;
}

interface FolderQuickPickItem extends vscode.QuickPickItem {
  entry: HiddenExplorerFolder;
  workspaceFolder: vscode.WorkspaceFolder;
}

interface FolderTargetGroup {
  workspaceFolder: vscode.WorkspaceFolder;
  targets: FolderHideTarget[];
}

interface FolderItemGroup {
  workspaceFolder: vscode.WorkspaceFolder;
  items: FolderQuickPickItem[];
}

export type ExcludeSettings = Record<string, boolean>;

export async function hideFolderFromExplorer(
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[]
): Promise<void> {
  const targets = await getFolderHideTargets(resource, selectedResources);

  if (targets.length === 0) {
    showStatusMessage('NAssistant: Right-click a workspace folder to hide it.', 3000);
    return;
  }

  const changedCount = await hideFolderTargets(targets);

  if (changedCount === 0) {
    showStatusMessage('NAssistant: Folder is already hidden from Explorer.', 3000);
    return;
  }

  showStatusMessage(
    `NAssistant: Hidden ${formatFolderCount(changedCount)} from Explorer.`,
    3000
  );
}

export async function showHiddenExplorerFolders(): Promise<void> {
  const items = getHiddenFolderItems();

  if (items.length === 0) {
    showStatusMessage('NAssistant: No folders hidden by NAssistant.', 3000);
    return;
  }

  const pickedItems = await window.showQuickPick(items, {
    canPickMany: true,
    placeHolder: 'Select folders to show in the Explorer'
  });

  if (!pickedItems || pickedItems.length === 0) {
    return;
  }

  const changedCount = await restoreHiddenFolderItems(pickedItems);

  showStatusMessage(
    `NAssistant: Restored ${formatFolderCount(changedCount)} in Explorer.`,
    3000
  );
}

export async function setFolderHiddenFromExplorer(
  resource: vscode.Uri,
  hidden: boolean
): Promise<boolean> {
  const targets = await getFolderHideTargets(resource);

  if (targets.length === 0) {
    return false;
  }

  if (hidden) {
    return (await hideFolderTargets(targets)) > 0;
  }

  return (await restoreHiddenFolderTargets(targets)) > 0;
}

export function getEffectiveFilesExclude(
  workspaceFolder: vscode.WorkspaceFolder
): ExcludeSettings {
  return workspace
    .getConfiguration(FILES_CONFIGURATION_SECTION, workspaceFolder.uri)
    .get<ExcludeSettings>(FILES_EXCLUDE_SETTING, {});
}

export function getHiddenExplorerFolders(
  workspaceFolder: vscode.WorkspaceFolder,
  configurationTarget: ConfigurationTarget = getConfigurationTarget()
): HiddenExplorerFolder[] {
  const configuredFolders = getScopedSettingValue<unknown>(
    CONFIG_SECTION,
    HIDDEN_EXPLORER_FOLDERS_SETTING,
    workspaceFolder,
    configurationTarget
  );

  if (!Array.isArray(configuredFolders)) {
    return [];
  }

  return configuredFolders.filter(isHiddenExplorerFolder);
}

export function getConfigurationTarget(): ConfigurationTarget.Workspace | ConfigurationTarget.WorkspaceFolder {
  return (workspace.workspaceFolders?.length ?? 0) > 1
    ? ConfigurationTarget.WorkspaceFolder
    : ConfigurationTarget.Workspace;
}

export function getRelativeResourcePath(
  workspaceFolder: vscode.WorkspaceFolder,
  resource: vscode.Uri
): string | undefined {
  const relativePath = path.relative(workspaceFolder.uri.fsPath, resource.fsPath);
  const normalizedPath = normalizeGlobPath(relativePath);

  return normalizedPath === '.' || normalizedPath.length === 0 ? undefined : normalizedPath;
}

export function normalizeGlobPath(value: string): string {
  return value.split(/[\\/]+/).filter(Boolean).join('/');
}

export function escapeGlobPath(value: string): string {
  return normalizeGlobPath(value)
    .split('/')
    .map(escapeGlobSegment)
    .join('/');
}

async function getFolderHideTargets(
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[]
): Promise<FolderHideTarget[]> {
  const resources = getUniqueResources(
    selectedResources && selectedResources.length > 0 ? selectedResources : resource ? [resource] : []
  );
  const targets: FolderHideTarget[] = [];

  for (const candidate of resources) {
    if (!(await isDirectory(candidate))) {
      continue;
    }

    const workspaceFolder = workspace.getWorkspaceFolder(candidate);

    if (!workspaceFolder) {
      continue;
    }

    const relativePath = getRelativeResourcePath(workspaceFolder, candidate);

    if (!relativePath) {
      showStatusMessage('NAssistant: Workspace roots cannot be hidden.', 3000);
      continue;
    }

    targets.push({
      workspaceFolder,
      path: relativePath,
      pattern: escapeGlobPath(relativePath)
    });
  }

  return targets;
}

async function hideFolderTargets(targets: FolderHideTarget[]): Promise<number> {
  let changedCount = 0;
  const groups = groupTargetsByWorkspaceFolder(targets);

  for (const group of groups.values()) {
    const configurationTarget = getConfigurationTarget();
    const excludeSettings = getScopedSettingValue<ExcludeSettings>(
      FILES_CONFIGURATION_SECTION,
      FILES_EXCLUDE_SETTING,
      group.workspaceFolder,
      configurationTarget
    ) ?? {};
    const hiddenFolders = getHiddenExplorerFolders(group.workspaceFolder, configurationTarget);
    const nextExcludeSettings = { ...excludeSettings };
    const nextHiddenFolders = [...hiddenFolders];
    const nextHiddenPatterns = new Set(nextHiddenFolders.map((entry) => entry.pattern));
    let excludeChanged = false;
    let hiddenFoldersChanged = false;

    for (const target of group.targets) {
      if (nextExcludeSettings[target.pattern] === true) {
        continue;
      }

      nextExcludeSettings[target.pattern] = true;

      if (!nextHiddenPatterns.has(target.pattern)) {
        nextHiddenFolders.push({
          path: target.path,
          pattern: target.pattern
        });
        nextHiddenPatterns.add(target.pattern);
        hiddenFoldersChanged = true;
      }

      excludeChanged = true;
      changedCount += 1;
    }

    if (excludeChanged) {
      await updateScopedSetting(
        FILES_CONFIGURATION_SECTION,
        FILES_EXCLUDE_SETTING,
        group.workspaceFolder,
        configurationTarget,
        nextExcludeSettings
      );
    }

    if (hiddenFoldersChanged) {
      await updateHiddenExplorerFolders(
        group.workspaceFolder,
        configurationTarget,
        nextHiddenFolders
      );
    }
  }

  return changedCount;
}

async function restoreHiddenFolderTargets(targets: readonly FolderHideTarget[]): Promise<number> {
  let changedCount = 0;
  const configurationTarget = getConfigurationTarget();
  const groups = groupTargetsByWorkspaceFolder(targets);

  for (const group of groups.values()) {
    changedCount += await restoreHiddenFolderPatterns(
      group.workspaceFolder,
      configurationTarget,
      group.targets.map((target) => target.pattern)
    );
  }

  return changedCount;
}

function getHiddenFolderItems(): FolderQuickPickItem[] {
  const workspaceFolders = workspace.workspaceFolders ?? [];
  const configurationTarget = getConfigurationTarget();

  return workspaceFolders.flatMap((workspaceFolder) =>
    getHiddenExplorerFolders(workspaceFolder, configurationTarget).map((entry) => ({
      label: entry.path,
      description: workspaceFolders.length > 1 ? workspaceFolder.name : undefined,
      detail: `files.exclude: ${entry.pattern}`,
      entry,
      workspaceFolder
    }))
  );
}

async function restoreHiddenFolderItems(items: readonly FolderQuickPickItem[]): Promise<number> {
  let changedCount = 0;
  const configurationTarget = getConfigurationTarget();
  const groups = groupItemsByWorkspaceFolder(items);

  for (const group of groups.values()) {
    changedCount += await restoreHiddenFolderPatterns(
      group.workspaceFolder,
      configurationTarget,
      group.items.map((item) => item.entry.pattern)
    );
  }

  return changedCount;
}

async function restoreHiddenFolderPatterns(
  workspaceFolder: vscode.WorkspaceFolder,
  configurationTarget: ConfigurationTarget,
  patterns: readonly string[]
): Promise<number> {
  const selectedPatterns = new Set(patterns);
  const excludeSettings = getScopedSettingValue<ExcludeSettings>(
    FILES_CONFIGURATION_SECTION,
    FILES_EXCLUDE_SETTING,
    workspaceFolder,
    configurationTarget
  ) ?? {};
  const hiddenFolders = getHiddenExplorerFolders(workspaceFolder, configurationTarget);
  const managedSelectedPatterns = new Set(
    hiddenFolders
      .map((entry) => entry.pattern)
      .filter((pattern) => selectedPatterns.has(pattern))
  );

  if (managedSelectedPatterns.size === 0) {
    return 0;
  }

  const nextExcludeSettings = { ...excludeSettings };
  const nextHiddenFolders = hiddenFolders.filter((entry) => !managedSelectedPatterns.has(entry.pattern));

  for (const pattern of managedSelectedPatterns) {
    if (Object.prototype.hasOwnProperty.call(nextExcludeSettings, pattern)) {
      delete nextExcludeSettings[pattern];
    }
  }

  await updateScopedSetting(
    FILES_CONFIGURATION_SECTION,
    FILES_EXCLUDE_SETTING,
    workspaceFolder,
    configurationTarget,
    Object.keys(nextExcludeSettings).length > 0 ? nextExcludeSettings : undefined
  );
  await updateHiddenExplorerFolders(
    workspaceFolder,
    configurationTarget,
    nextHiddenFolders
  );

  return hiddenFolders.length - nextHiddenFolders.length;
}

async function updateHiddenExplorerFolders(
  workspaceFolder: vscode.WorkspaceFolder,
  configurationTarget: ConfigurationTarget,
  hiddenFolders: HiddenExplorerFolder[]
): Promise<void> {
  await updateScopedSetting(
    CONFIG_SECTION,
    HIDDEN_EXPLORER_FOLDERS_SETTING,
    workspaceFolder,
    configurationTarget,
    hiddenFolders.length > 0 ? hiddenFolders : undefined
  );
}

function getScopedSettingValue<T>(
  section: string,
  setting: string,
  workspaceFolder: vscode.WorkspaceFolder,
  configurationTarget: ConfigurationTarget
): T | undefined {
  const inspectedSetting = workspace.getConfiguration(section, workspaceFolder.uri).inspect<T>(setting);

  if (!inspectedSetting) {
    return undefined;
  }

  return configurationTarget === ConfigurationTarget.WorkspaceFolder
    ? inspectedSetting.workspaceFolderValue
    : inspectedSetting.workspaceValue;
}

async function updateScopedSetting<T>(
  section: string,
  setting: string,
  workspaceFolder: vscode.WorkspaceFolder,
  configurationTarget: ConfigurationTarget,
  value: T | undefined
): Promise<void> {
  await workspace
    .getConfiguration(section, workspaceFolder.uri)
    .update(setting, value, configurationTarget);
}

function groupTargetsByWorkspaceFolder(targets: readonly FolderHideTarget[]): Map<string, FolderTargetGroup> {
  const groups = new Map<string, FolderTargetGroup>();

  for (const target of targets) {
    const key = target.workspaceFolder.uri.toString();
    const group = groups.get(key);

    if (group) {
      group.targets.push(target);
      continue;
    }

    groups.set(key, {
      workspaceFolder: target.workspaceFolder,
      targets: [target]
    });
  }

  return groups;
}

function groupItemsByWorkspaceFolder(items: readonly FolderQuickPickItem[]): Map<string, FolderItemGroup> {
  const groups = new Map<string, FolderItemGroup>();

  for (const item of items) {
    const key = item.workspaceFolder.uri.toString();
    const group = groups.get(key);

    if (group) {
      group.items.push(item);
      continue;
    }

    groups.set(key, {
      workspaceFolder: item.workspaceFolder,
      items: [item]
    });
  }

  return groups;
}

async function isDirectory(resource: vscode.Uri): Promise<boolean> {
  try {
    const stat = await workspace.fs.stat(resource);

    return (stat.type & FileType.Directory) === FileType.Directory;
  } catch {
    return false;
  }
}

function getUniqueResources(resources: vscode.Uri[]): vscode.Uri[] {
  const seenResources = new Set<string>();
  const uniqueResources: vscode.Uri[] = [];

  for (const resource of resources) {
    const key = resource.toString();

    if (seenResources.has(key)) {
      continue;
    }

    seenResources.add(key);
    uniqueResources.push(resource);
  }

  return uniqueResources;
}

function escapeGlobSegment(value: string): string {
  let escapedSegment = '';

  for (const character of value) {
    switch (character) {
      case '[':
        escapedSegment += '[[]';
        break;

      case ']':
        escapedSegment += '[]]';
        break;

      case '*':
        escapedSegment += '[*]';
        break;

      case '?':
        escapedSegment += '[?]';
        break;

      case '{':
        escapedSegment += '[{]';
        break;

      case '}':
        escapedSegment += '[}]';
        break;

      default:
        escapedSegment += character;
        break;
    }
  }

  return escapedSegment;
}

function isHiddenExplorerFolder(value: unknown): value is HiddenExplorerFolder {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<HiddenExplorerFolder>;

  return typeof candidate.path === 'string' && typeof candidate.pattern === 'string';
}

function formatFolderCount(count: number): string {
  return count === 1 ? '1 folder' : `${count} folders`;
}
