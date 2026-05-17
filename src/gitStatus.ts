import type * as vscode from 'vscode';
import { execFile } from 'child_process';
import path from 'path';
import { promisify } from 'util';

import { normalizeGlobPath } from './folderVisibility';

const execFileAsync = promisify(execFile);

export type GitStatusKind =
  | 'modified'
  | 'added'
  | 'untracked'
  | 'deleted'
  | 'renamed'
  | 'conflict'
  | 'staged';

export interface ExplorerGitStatus {
  kind: GitStatusKind;
  badge: string;
  tooltip: string;
  priority: number;
}

export interface WorkspaceGitStatus {
  byPath: Record<string, ExplorerGitStatus>;
}

const STATUS_DEFINITIONS: Record<GitStatusKind, ExplorerGitStatus> = {
  conflict: {
    kind: 'conflict',
    badge: '!',
    tooltip: 'Git: Conflict',
    priority: 70
  },
  renamed: {
    kind: 'renamed',
    badge: 'R',
    tooltip: 'Git: Renamed',
    priority: 60
  },
  deleted: {
    kind: 'deleted',
    badge: 'D',
    tooltip: 'Git: Deleted',
    priority: 50
  },
  added: {
    kind: 'added',
    badge: 'A',
    tooltip: 'Git: Added',
    priority: 40
  },
  untracked: {
    kind: 'untracked',
    badge: '?',
    tooltip: 'Git: Untracked',
    priority: 35
  },
  staged: {
    kind: 'staged',
    badge: 'S',
    tooltip: 'Git: Staged',
    priority: 30
  },
  modified: {
    kind: 'modified',
    badge: 'M',
    tooltip: 'Git: Modified',
    priority: 20
  }
};

export async function getWorkspaceGitStatuses(
  workspaceFolders: readonly vscode.WorkspaceFolder[]
): Promise<Map<string, WorkspaceGitStatus>> {
  const entries = await Promise.all(
    workspaceFolders.map(async (workspaceFolder) => {
      const status = await getWorkspaceGitStatus(workspaceFolder);

      return [workspaceFolder.uri.toString(), status] as const;
    })
  );

  return new Map(entries.filter((entry): entry is readonly [string, WorkspaceGitStatus] => Boolean(entry[1])));
}

function getGitStatusDefinition(kind: GitStatusKind): ExplorerGitStatus {
  return STATUS_DEFINITIONS[kind];
}

async function getWorkspaceGitStatus(
  workspaceFolder: vscode.WorkspaceFolder
): Promise<WorkspaceGitStatus | undefined> {
  try {
    const repoRoot = await getRepoRoot(workspaceFolder);
    const { stdout } = await execFileAsync(
      'git',
      ['-C', workspaceFolder.uri.fsPath, 'status', '--porcelain=v2', '-z', '--renames'],
      {
        maxBuffer: 1024 * 1024 * 20
      }
    );
    const byPath = parsePorcelainStatus(stdout, repoRoot, workspaceFolder.uri.fsPath);

    return {
      byPath
    };
  } catch {
    return undefined;
  }
}

async function getRepoRoot(workspaceFolder: vscode.WorkspaceFolder): Promise<string> {
  const { stdout } = await execFileAsync(
    'git',
    ['-C', workspaceFolder.uri.fsPath, 'rev-parse', '--show-toplevel']
  );

  return stdout.trim();
}

function parsePorcelainStatus(
  output: string,
  repoRoot: string,
  workspaceRoot: string
): Record<string, ExplorerGitStatus> {
  const byPath: Record<string, ExplorerGitStatus> = {};
  const chunks = output.split('\0').filter(Boolean);

  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    const status = parsePorcelainEntry(chunk);

    if (!status) {
      continue;
    }

    if (chunk.startsWith('2 ')) {
      index += 1;
    }

    const workspaceRelativePath = getWorkspaceRelativeStatusPath(
      repoRoot,
      workspaceRoot,
      status.path
    );

    if (!workspaceRelativePath) {
      continue;
    }

    addStatusWithParents(byPath, workspaceRelativePath, getGitStatusDefinition(status.kind));
  }

  return byPath;
}

function parsePorcelainEntry(
  chunk: string
): { path: string; kind: GitStatusKind } | undefined {
  if (chunk.startsWith('? ')) {
    return {
      path: chunk.slice(2),
      kind: 'untracked'
    };
  }

  if (chunk.startsWith('u ')) {
    return {
      path: chunk.split(' ').slice(10).join(' '),
      kind: 'conflict'
    };
  }

  if (chunk.startsWith('2 ')) {
    const parts = chunk.split(' ');

    return {
      path: parts.slice(9).join(' '),
      kind: 'renamed'
    };
  }

  if (chunk.startsWith('1 ')) {
    const parts = chunk.split(' ');
    const xy = parts[1] ?? '';
    const statusPath = parts.slice(8).join(' ');

    return {
      path: statusPath,
      kind: getStatusKindFromXY(xy)
    };
  }

  return undefined;
}

function getStatusKindFromXY(xy: string): GitStatusKind {
  const indexStatus = xy[0] ?? '.';
  const worktreeStatus = xy[1] ?? '.';

  if (xy.includes('U')) {
    return 'conflict';
  }

  if (indexStatus === 'R') {
    return 'renamed';
  }

  if (worktreeStatus === 'D' || indexStatus === 'D') {
    return 'deleted';
  }

  if (indexStatus === 'A') {
    return 'added';
  }

  if (indexStatus !== '.' && indexStatus !== ' ') {
    return 'staged';
  }

  return 'modified';
}

function getWorkspaceRelativeStatusPath(
  repoRoot: string,
  workspaceRoot: string,
  repoRelativePath: string
): string | undefined {
  const absolutePath = path.resolve(repoRoot, repoRelativePath);
  const relativePath = normalizeGlobPath(path.relative(workspaceRoot, absolutePath));

  if (!relativePath || relativePath === '.' || relativePath.startsWith('../')) {
    return undefined;
  }

  return relativePath.endsWith('/') ? relativePath.slice(0, -1) : relativePath;
}

function addStatusWithParents(
  byPath: Record<string, ExplorerGitStatus>,
  relativePath: string,
  status: ExplorerGitStatus
): void {
  let currentPath = normalizeGlobPath(relativePath);

  addStatus(byPath, currentPath, status);

  while (currentPath.includes('/')) {
    currentPath = currentPath.slice(0, currentPath.lastIndexOf('/'));
    addStatus(byPath, currentPath, status);
  }

  addStatus(byPath, '', status);
}

function addStatus(
  byPath: Record<string, ExplorerGitStatus>,
  relativePath: string,
  status: ExplorerGitStatus
): void {
  const existingStatus = byPath[relativePath];

  if (!existingStatus || status.priority > existingStatus.priority) {
    byPath[relativePath] = status;
  }
}
