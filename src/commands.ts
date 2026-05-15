import type * as vscode from 'vscode';
import { commands, env } from 'vscode';

import {
  type AssistantTarget,
  getAssistantTargetLabel,
  getDefaultAssistantTarget,
  pasteTextToAssistant
} from './assistantTargets';
import { SIDEBAR_VIEW_ID } from './constants';
import {
  buildCurrentContext,
  buildFileReferenceContext,
  buildSelectionLocationContext
} from './contextBuilder';
import { isFeatureEnabled } from './features';
import { showStatusMessage } from './notifications';

export async function openSettingsView(): Promise<void> {
  await commands.executeCommand(`${SIDEBAR_VIEW_ID}.focus`);
}

export async function copySelectionAsAiContext(): Promise<void> {
  if (!isFeatureEnabled('copySelectionLocation')) {
    showStatusMessage('NAssistant: Selection Location is disabled.', 2500);
    return;
  }

  const context = buildSelectionLocationContext();

  if (!context) {
    showStatusMessage('NAssistant: Select code before copying a location.', 2500);
    return;
  }

  await env.clipboard.writeText(context.text);
  showStatusMessage(`NAssistant: Copied ${context.label}`, 2500);
}

export async function copyFileReferenceForAi(
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[]
): Promise<void> {
  if (!isFeatureEnabled('copyFileReference')) {
    showStatusMessage('NAssistant: File Reference is disabled.', 2500);
    return;
  }

  const context = await buildFileReferenceContext(resource, selectedResources);

  if (!context) {
    showStatusMessage('NAssistant: Select a file before copying a reference.', 2500);
    return;
  }

  await env.clipboard.writeText(context.text);
  showStatusMessage(`NAssistant: Copied ${context.label}`, 2500);
}

export async function pasteContextToAssistant(
  storage: vscode.Memento,
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[]
): Promise<void> {
  const target = getDefaultAssistantTarget();

  await pasteContextToAssistantTarget(target, storage, resource, selectedResources);
}

export async function pasteContextToClaude(
  storage: vscode.Memento,
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[]
): Promise<void> {
  await pasteContextToAssistantTarget('claude', storage, resource, selectedResources);
}

export async function pasteContextToCodex(
  storage: vscode.Memento,
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[]
): Promise<void> {
  await pasteContextToAssistantTarget('codex', storage, resource, selectedResources);
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

async function pasteContextToAssistantTarget(
  target: AssistantTarget,
  storage: vscode.Memento,
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[]
): Promise<void> {
  if (!isFeatureEnabled('pasteContextToAssistant')) {
    showStatusMessage('NAssistant: Paste Context to Assistant is disabled.', 2500);
    return;
  }

  const context = await buildCurrentContext(resource, selectedResources);

  if (!context) {
    showStatusMessage('NAssistant: Select code or a file before pasting context.', 2500);
    return;
  }

  try {
    await pasteTextToAssistant(target, context.text, storage);
    showStatusMessage(`NAssistant: Pasted ${context.label} to ${getAssistantTargetLabel(target)}.`, 2500);
  } catch {
    showStatusMessage(`NAssistant: Could not paste context to ${getAssistantTargetLabel(target)}.`, 3500);
  }
}
