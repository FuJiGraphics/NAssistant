import type * as vscode from 'vscode';
import { FileType, Uri, workspace } from 'vscode';
import { minimatch } from 'minimatch';

import {
  type ExcludeSettings,
  type HiddenExplorerFolder,
  escapeGlobPath,
  getEffectiveFilesExclude,
  getHiddenExplorerFolders,
  getRelativeResourcePath,
  normalizeGlobPath
} from './folderVisibility';
import type { ExplorerGitStatus, WorkspaceGitStatus } from './gitStatus';

export interface ExplorerState {
  roots: ExplorerNode[];
  children: Record<string, ExplorerNode[]>;
  workspaceFolderCount: number;
  hiddenFolderCount: number;
  expandMode: 'singleClick' | 'doubleClick';
}

export interface ExplorerNode {
  uri: string;
  name: string;
  relativePath: string;
  workspaceFolderUri: string;
  type: 'file' | 'folder';
  isExpanded: boolean;
  isHiddenByNAssistant: boolean;
  canHide: boolean;
  canCreateChild: boolean;
  canRename: boolean;
  canDelete: boolean;
  canDrag: boolean;
  canDrop: boolean;
  gitStatus?: ExplorerGitStatus;
  gitBadge?: string;
  gitTooltip?: string;
}

export function createExplorerState(
  expandedUris: ReadonlySet<string>,
  childrenByParentUri: ReadonlyMap<string, ExplorerNode[]>,
  gitStatuses: ReadonlyMap<string, WorkspaceGitStatus> = new Map()
): ExplorerState {
  const workspaceFolders = workspace.workspaceFolders ?? [];
  const children: Record<string, ExplorerNode[]> = {};

  for (const [parentUri, nodes] of childrenByParentUri) {
    children[parentUri] = nodes.map((node) => ({
      ...node,
      isExpanded: expandedUris.has(node.uri),
      ...getGitNodeFields(node.relativePath, gitStatuses.get(node.workspaceFolderUri))
    }));
  }

  return {
    roots: workspaceFolders.map((workspaceFolder) => createRootNode(
      workspaceFolder,
      expandedUris,
      gitStatuses.get(workspaceFolder.uri.toString())
    )),
    children,
    workspaceFolderCount: workspaceFolders.length,
    hiddenFolderCount: getHiddenFolderCount(workspaceFolders),
    expandMode: getTreeExpandMode()
  };
}

function getTreeExpandMode(): ExplorerState['expandMode'] {
  const configuredMode = workspace
    .getConfiguration('workbench')
    .get<string>('tree.expandMode', 'singleClick');

  return configuredMode === 'doubleClick' ? 'doubleClick' : 'singleClick';
}

export async function readExplorerChildren(
  parentUri: vscode.Uri,
  expandedUris: ReadonlySet<string>,
  gitStatuses: ReadonlyMap<string, WorkspaceGitStatus> = new Map()
): Promise<ExplorerNode[]> {
  const workspaceFolder = workspace.getWorkspaceFolder(parentUri);

  if (!workspaceFolder) {
    return [];
  }

  let entries: [string, FileType][];

  try {
    entries = await workspace.fs.readDirectory(parentUri);
  } catch {
    return [];
  }

  const excludeSettings = getEffectiveFilesExclude(workspaceFolder);
  const hiddenFolders = getHiddenExplorerFolders(workspaceFolder);
  const workspaceGitStatus = gitStatuses.get(workspaceFolder.uri.toString());
  const nodes: ExplorerNode[] = [];

  for (const [name, fileType] of entries) {
    const nodeType = getExplorerNodeType(fileType);

    if (!nodeType) {
      continue;
    }

    const resource = Uri.joinPath(parentUri, name);
    const relativePath = getRelativeResourcePath(workspaceFolder, resource);

    if (!relativePath) {
      continue;
    }

    const isHiddenByNAssistant = isManagedHiddenFolder(relativePath, hiddenFolders);

    if (
      !isHiddenByNAssistant &&
      isExcludedByFilesExclude(relativePath, nodeType, excludeSettings)
    ) {
      continue;
    }

    nodes.push({
      uri: resource.toString(),
      name,
      relativePath,
      workspaceFolderUri: workspaceFolder.uri.toString(),
      type: nodeType,
      isExpanded: expandedUris.has(resource.toString()),
      isHiddenByNAssistant,
      canHide: nodeType === 'folder',
      canCreateChild: nodeType === 'folder',
      canRename: true,
      canDelete: true,
      canDrag: true,
      canDrop: nodeType === 'folder',
      ...getGitNodeFields(relativePath, workspaceGitStatus)
    });
  }

  return nodes.sort(compareExplorerNodes);
}

function createRootNode(
  workspaceFolder: vscode.WorkspaceFolder,
  expandedUris: ReadonlySet<string>,
  gitStatus?: WorkspaceGitStatus
): ExplorerNode {
  return {
    uri: workspaceFolder.uri.toString(),
    name: workspaceFolder.name,
    relativePath: '',
    workspaceFolderUri: workspaceFolder.uri.toString(),
    type: 'folder',
    isExpanded: expandedUris.has(workspaceFolder.uri.toString()),
    isHiddenByNAssistant: false,
    canHide: false,
    canCreateChild: true,
    canRename: false,
    canDelete: false,
    canDrag: false,
    canDrop: true,
    ...getGitNodeFields('', gitStatus)
  };
}

function getGitNodeFields(
  relativePath: string,
  gitStatus?: WorkspaceGitStatus
): Pick<ExplorerNode, 'gitStatus' | 'gitBadge' | 'gitTooltip'> {
  const status = gitStatus?.byPath[relativePath];

  return {
    gitStatus: status,
    gitBadge: status?.badge,
    gitTooltip: status?.tooltip
  };
}

function getHiddenFolderCount(workspaceFolders: readonly vscode.WorkspaceFolder[]): number {
  return workspaceFolders.reduce(
    (count, workspaceFolder) => count + getHiddenExplorerFolders(workspaceFolder).length,
    0
  );
}

function getExplorerNodeType(fileType: FileType): ExplorerNode['type'] | undefined {
  if ((fileType & FileType.Directory) === FileType.Directory) {
    return 'folder';
  }

  if ((fileType & FileType.File) === FileType.File) {
    return 'file';
  }

  return undefined;
}

function isManagedHiddenFolder(
  relativePath: string,
  hiddenFolders: readonly HiddenExplorerFolder[]
): boolean {
  const pattern = escapeGlobPath(relativePath);

  return hiddenFolders.some((entry) => entry.path === relativePath || entry.pattern === pattern);
}

function isExcludedByFilesExclude(
  relativePath: string,
  nodeType: ExplorerNode['type'],
  excludeSettings: ExcludeSettings
): boolean {
  return Object.entries(excludeSettings).some(([pattern, hidden]) => {
    return hidden === true && matchesExcludePattern(relativePath, nodeType, pattern);
  });
}

function matchesExcludePattern(
  relativePath: string,
  nodeType: ExplorerNode['type'],
  pattern: string
): boolean {
  const normalizedPath = normalizeGlobPath(relativePath);
  const normalizedPattern = normalizeGlobPattern(pattern);
  const options = {
    dot: true,
    nocase: process.platform === 'win32'
  };

  if (minimatch(normalizedPath, normalizedPattern, options)) {
    return true;
  }

  return nodeType === 'folder' && minimatch(`${normalizedPath}/`, normalizedPattern, options);
}

function normalizeGlobPattern(pattern: string): string {
  return pattern
    .split(/[\\/]+/)
    .filter((segment) => segment.length > 0)
    .join('/');
}

function compareExplorerNodes(left: ExplorerNode, right: ExplorerNode): number {
  if (left.type !== right.type) {
    return left.type === 'folder' ? -1 : 1;
  }

  return left.name.localeCompare(right.name, undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}
