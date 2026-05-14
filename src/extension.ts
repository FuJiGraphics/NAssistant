import type * as vscode from 'vscode';
import { commands, env, window, workspace } from 'vscode';

class EmptyViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.ProviderResult<vscode.TreeItem[]> {
    return [];
  }
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    window.registerTreeDataProvider('nassistant.sidebar', new EmptyViewProvider()),
    commands.registerCommand('nassistant.copyFileReferenceForAi', copyFileReferenceForAi),
    commands.registerCommand('nassistant.copySelectionAsAiContext', copySelectionAsAiContext)
  );
}

export function deactivate(): void {
  // Intentionally empty.
}

async function copySelectionAsAiContext(): Promise<void> {
  const editor = window.activeTextEditor;

  if (!editor || editor.selection.isEmpty) {
    window.setStatusBarMessage('NAssistant: Select code before copying a location.', 2500);
    return;
  }

  const document = editor.document;
  const selection = editor.selection;
  const reference = formatFileReference(document, selection);
  const contextText = formatAiContext(reference);

  await env.clipboard.writeText(contextText);
  window.setStatusBarMessage(`NAssistant: Copied ${reference}`, 2500);
}

async function copyFileReferenceForAi(resource?: vscode.Uri, selectedResources?: vscode.Uri[]): Promise<void> {
  const references = await getFileReferences(resource, selectedResources);

  if (references.length === 0) {
    window.setStatusBarMessage('NAssistant: Select a file before copying a reference.', 2500);
    return;
  }

  const contextText = formatAiFileReferences(references);

  await env.clipboard.writeText(contextText);
  window.setStatusBarMessage(`NAssistant: Copied ${references.length === 1 ? references[0] : `${references.length} files`}`, 2500);
}

async function getFileReferences(resource?: vscode.Uri, selectedResources?: vscode.Uri[]): Promise<string[]> {
  const resources = selectedResources && selectedResources.length > 0 ? selectedResources : resource ? [resource] : [];

  if (resources.length > 0) {
    return resources.map(formatResourcePath);
  }

  return copyExplorerRelativePaths();
}

async function copyExplorerRelativePaths(): Promise<string[]> {
  try {
    await commands.executeCommand('copyRelativeFilePath');
    const copiedText = await env.clipboard.readText();

    return copiedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function formatFileReference(document: vscode.TextDocument, selection: vscode.Selection): string {
  return `${formatResourcePath(document.uri)}:${formatLineRange(selection)}`;
}

function formatResourcePath(resource: vscode.Uri): string {
  if (resource.scheme === 'file') {
    const workspaceFolder = workspace.getWorkspaceFolder(resource);

    if (workspaceFolder) {
      return workspace.asRelativePath(resource, false);
    }

    return resource.fsPath;
  }

  return resource.toString(true);
}

function formatLineRange(selection: vscode.Selection): string {
  const startLine = selection.start.line + 1;
  const endLine = getInclusiveEndLine(selection) + 1;

  return startLine === endLine ? `${startLine}` : `${startLine}-${endLine}`;
}

function formatAiContext(reference: string): string {
  return `[location: ${reference}]`;
}

function formatAiFileReferences(references: string[]): string {
  if (references.length === 1) {
    return `[file: ${references[0]}]`;
  }

  return ['[files]', ...references.map((reference) => `- ${reference}`)].join('\n');
}

function getInclusiveEndLine(selection: vscode.Selection): number {
  if (selection.end.character === 0 && selection.end.line > selection.start.line) {
    return selection.end.line - 1;
  }

  return selection.end.line;
}
