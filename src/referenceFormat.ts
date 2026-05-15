import type * as vscode from 'vscode';
import { workspace } from 'vscode';

export function formatFileReference(document: vscode.TextDocument, selection: vscode.Selection): string {
  return `${formatResourcePath(document.uri)}:${formatLineRange(selection)}`;
}

export function formatResourcePath(resource: vscode.Uri): string {
  if (resource.scheme === 'file') {
    const workspaceFolder = workspace.getWorkspaceFolder(resource);

    if (workspaceFolder) {
      return workspace.asRelativePath(resource, false);
    }

    return resource.fsPath;
  }

  return resource.toString(true);
}

export function formatLineRange(selection: vscode.Selection): string {
  const startLine = selection.start.line + 1;
  const endLine = getInclusiveEndLine(selection) + 1;

  return startLine === endLine ? `${startLine}` : `${startLine}-${endLine}`;
}

export function formatAiContext(reference: string): string {
  return `[location: ${reference}]`;
}

export function formatAiFileReferences(references: string[]): string {
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
