import type * as vscode from 'vscode';
import { Uri, WorkspaceEdit, window, workspace } from 'vscode';
import path from 'path';

export type ExplorerCreateKind = 'file' | 'folder';

export interface ExternalDroppedFile {
  name: string;
  data: string;
}

export async function createExplorerItem(
  parentUri: vscode.Uri,
  name: string,
  kind: ExplorerCreateKind
): Promise<vscode.Uri | undefined> {
  const safeName = normalizeInputName(name);

  if (!safeName) {
    window.showErrorMessage('NAssistant: Enter a valid name.');
    return undefined;
  }

  const targetUri = Uri.joinPath(parentUri, safeName);

  if (await exists(targetUri)) {
    window.showErrorMessage(`NAssistant: ${safeName} already exists.`);
    return undefined;
  }

  if (kind === 'folder') {
    await workspace.fs.createDirectory(targetUri);
    return targetUri;
  }

  const edit = new WorkspaceEdit();

  edit.createFile(targetUri, {
    ignoreIfExists: false,
    overwrite: false
  });

  if (!(await workspace.applyEdit(edit))) {
    window.showErrorMessage(`NAssistant: Could not create ${safeName}.`);
    return undefined;
  }

  await window.showTextDocument(targetUri);

  return targetUri;
}

export async function renameExplorerItem(
  resource: vscode.Uri,
  newName: string
): Promise<vscode.Uri | undefined> {
  const safeName = normalizeInputName(newName);

  if (!safeName) {
    window.showErrorMessage('NAssistant: Enter a valid name.');
    return undefined;
  }

  const targetUri = getSiblingUri(resource, safeName);

  if (resource.toString() === targetUri.toString()) {
    return resource;
  }

  if (await exists(targetUri)) {
    window.showErrorMessage(`NAssistant: ${safeName} already exists.`);
    return undefined;
  }

  const edit = new WorkspaceEdit();

  edit.renameFile(resource, targetUri, {
    ignoreIfExists: false,
    overwrite: false
  });

  if (!(await workspace.applyEdit(edit))) {
    window.showErrorMessage(`NAssistant: Could not rename ${path.basename(resource.fsPath)}.`);
    return undefined;
  }

  return targetUri;
}

export async function deleteExplorerItems(resources: readonly vscode.Uri[]): Promise<boolean> {
  if (resources.length === 0) {
    return false;
  }

  if (!(await confirmDelete(resources))) {
    return false;
  }

  try {
    for (const resource of resources) {
      await workspace.fs.delete(resource, {
        recursive: true,
        useTrash: true
      });
    }

    return true;
  } catch (error) {
    window.showErrorMessage(`NAssistant: Could not delete item. ${getErrorMessage(error)}`);
    return false;
  }
}

export async function moveExplorerItems(
  resources: readonly vscode.Uri[],
  targetFolder: vscode.Uri
): Promise<boolean> {
  const movableResources = resources.filter((resource) => resource.toString() !== targetFolder.toString());

  if (movableResources.length === 0) {
    return false;
  }

  const edit = new WorkspaceEdit();

  for (const resource of movableResources) {
    if (isEqualOrParent(targetFolder, resource)) {
      window.showErrorMessage('NAssistant: Cannot move a folder into itself.');
      return false;
    }

    const targetUri = Uri.joinPath(targetFolder, path.basename(resource.fsPath));

    if (resource.toString() === targetUri.toString()) {
      continue;
    }

    if (await exists(targetUri)) {
      window.showErrorMessage(`NAssistant: ${path.basename(targetUri.fsPath)} already exists.`);
      return false;
    }

    edit.renameFile(resource, targetUri, {
      ignoreIfExists: false,
      overwrite: false
    });
  }

  if (edit.size === 0) {
    return false;
  }

  if (!(await workspace.applyEdit(edit))) {
    window.showErrorMessage('NAssistant: Could not move the selected item.');
    return false;
  }

  return true;
}

export async function copyExternalFilesToExplorer(
  targetFolder: vscode.Uri,
  files: readonly ExternalDroppedFile[]
): Promise<boolean> {
  if (files.length === 0) {
    return false;
  }

  for (const file of files) {
    const safeName = normalizeInputName(file.name);

    if (!safeName) {
      window.showErrorMessage('NAssistant: Could not copy an external file with an invalid name.');
      return false;
    }

    const targetUri = Uri.joinPath(targetFolder, safeName);

    if (await exists(targetUri)) {
      window.showErrorMessage(`NAssistant: ${safeName} already exists.`);
      return false;
    }
  }

  for (const file of files) {
    const targetUri = Uri.joinPath(targetFolder, normalizeInputName(file.name) ?? file.name);

    await workspace.fs.writeFile(targetUri, decodeBase64(file.data));
  }

  return true;
}

function normalizeInputName(name: string): string | undefined {
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName === '.' || trimmedName === '..') {
    return undefined;
  }

  if (/[\\/]/.test(trimmedName)) {
    return undefined;
  }

  return trimmedName;
}

async function confirmDelete(resources: readonly vscode.Uri[]): Promise<boolean> {
  if (!workspace.getConfiguration('explorer').get<boolean>('confirmDelete', true)) {
    return true;
  }

  const isMultiple = resources.length > 1;
  const message = isMultiple
    ? `Delete ${resources.length} selected items?`
    : `Delete ${path.basename(resources[0].fsPath)}?`;
  const detail = isMultiple
    ? 'NAssistant will move the selected files and folders to the trash when possible.'
    : 'NAssistant will move this item to the trash when possible.';
  const confirmation = await window.showWarningMessage(
    message,
    {
      modal: true,
      detail
    },
    'Delete'
  );

  return confirmation === 'Delete';
}

async function exists(resource: vscode.Uri): Promise<boolean> {
  try {
    await workspace.fs.stat(resource);

    return true;
  } catch {
    return false;
  }
}

function getSiblingUri(resource: vscode.Uri, name: string): vscode.Uri {
  return Uri.file(path.join(path.dirname(resource.fsPath), name));
}

function isEqualOrParent(candidate: vscode.Uri, parent: vscode.Uri): boolean {
  const relativePath = path.relative(parent.fsPath, candidate.fsPath);

  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function decodeBase64(value: string): Uint8Array {
  return Uint8Array.from(Buffer.from(value, 'base64'));
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
