import type * as vscode from 'vscode';
import { commands, env, window } from 'vscode';

import { SIDEBAR_VIEW_ID } from './constants';
import { isFeatureEnabled } from './features';
import { showStatusMessage } from './notifications';
import {
  formatAiContext,
  formatAiFileReferences,
  formatFileReference,
  formatResourcePath
} from './referenceFormat';

export async function openSettingsView(): Promise<void> {
  await commands.executeCommand(`${SIDEBAR_VIEW_ID}.focus`);
}

export async function copySelectionAsAiContext(): Promise<void> {
  if (!isFeatureEnabled('copySelectionLocation')) {
    showStatusMessage('NAssistant: Selection Location is disabled.', 2500);
    return;
  }

  const editor = window.activeTextEditor;

  if (!editor || editor.selection.isEmpty) {
    showStatusMessage('NAssistant: Select code before copying a location.', 2500);
    return;
  }

  const reference = formatFileReference(editor.document, editor.selection);
  const contextText = formatAiContext(reference);

  await env.clipboard.writeText(contextText);
  showStatusMessage(`NAssistant: Copied ${reference}`, 2500);
}

export async function copyFileReferenceForAi(
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[]
): Promise<void> {
  if (!isFeatureEnabled('copyFileReference')) {
    showStatusMessage('NAssistant: File Reference is disabled.', 2500);
    return;
  }

  const references = await getFileReferences(resource, selectedResources);

  if (references.length === 0) {
    showStatusMessage('NAssistant: Select a file before copying a reference.', 2500);
    return;
  }

  const contextText = formatAiFileReferences(references);

  await env.clipboard.writeText(contextText);
  showStatusMessage(`NAssistant: Copied ${references.length === 1 ? references[0] : `${references.length} files`}`, 2500);
}

export async function openShortcutEditor(command: string): Promise<void> {
  try {
    await commands.executeCommand('workbench.action.openGlobalKeybindings', `@command:${command}`);
  } catch {
    await commands.executeCommand('workbench.action.openGlobalKeybindings');
    await env.clipboard.writeText(command);
    showStatusMessage(`NAssistant: Copied ${command}`, 2500);
  }
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
