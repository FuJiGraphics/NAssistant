import type * as vscode from 'vscode';
import { commands, env } from 'vscode';

import {
  type AssistantTarget,
  getAssistantTargetLabel,
  getConfiguredAssistantTarget,
  pasteTextToAssistant
} from './assistantTargets';
import { SIDEBAR_VIEW_ID } from './constants';
import {
  type ContextBuildOptions,
  type ContextBuildResult,
  type ContextBuildSource,
  buildCurrentContext,
  buildFileReferenceContext,
  buildSelectionLocationContext
} from './contextBuilder';
import { isFeatureEnabled } from './features';
import { showStatusMessage } from './notifications';

const CLAUDE_EXPLORER_FILE_PASTE_DELAY_MS = 400;

interface PasteContextCommandOptions {
  source?: ContextBuildSource;
}

interface PasteContextArguments extends ContextBuildOptions {
  resource?: vscode.Uri;
  selectedResources?: vscode.Uri[];
}

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
  resourceOrOptions?: vscode.Uri | PasteContextCommandOptions,
  selectedResources?: vscode.Uri[]
): Promise<void> {
  await pasteContextToAssistantTarget(
    getConfiguredAssistantTarget(),
    parsePasteContextArguments(resourceOrOptions, selectedResources)
  );
}

export async function pasteContextToClaude(
  resourceOrOptions?: vscode.Uri | PasteContextCommandOptions,
  selectedResources?: vscode.Uri[]
): Promise<void> {
  await pasteContextToAssistantTarget(
    'claude',
    parsePasteContextArguments(resourceOrOptions, selectedResources)
  );
}

export async function pasteContextToCodex(
  resourceOrOptions?: vscode.Uri | PasteContextCommandOptions,
  selectedResources?: vscode.Uri[]
): Promise<void> {
  await pasteContextToAssistantTarget(
    'codex',
    parsePasteContextArguments(resourceOrOptions, selectedResources)
  );
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
  args: PasteContextArguments
): Promise<void> {
  if (!isFeatureEnabled('pasteContextToAssistant')) {
    showStatusMessage('NAssistant: Paste Context to Assistant is disabled.', 2500);
    return;
  }

  const context = await buildCurrentContext(args.resource, args.selectedResources, {
    source: args.source,
    explorerClipboardMode: target === 'codex' || target === 'claude' ? 'guarded' : 'legacy'
  });

  if (!context) {
    showStatusMessage('NAssistant: Select code or a file before pasting context.', 2500);
    return;
  }

  await pasteBuiltContextToAssistantTarget(target, context);
}

async function pasteBuiltContextToAssistantTarget(
  target: AssistantTarget,
  context: ContextBuildResult
): Promise<void> {
  try {
    await pasteTextToAssistant(
      target,
      context.text,
      target === 'claude' && context.fileReferences
        ? {
            pasteDelayMs: CLAUDE_EXPLORER_FILE_PASTE_DELAY_MS,
            clearClipboardAfterPaste: false
          }
        : undefined
    );
    showStatusMessage(`NAssistant: Pasted ${context.label} to ${getAssistantTargetLabel(target)}.`, 2500);
  } catch {
    showStatusMessage(`NAssistant: Could not paste context to ${getAssistantTargetLabel(target)}.`, 3500);
  }
}

function parsePasteContextArguments(
  resourceOrOptions?: vscode.Uri | PasteContextCommandOptions,
  selectedResources?: vscode.Uri[]
): PasteContextArguments {
  if (isPasteContextCommandOptions(resourceOrOptions)) {
    return {
      source: resourceOrOptions.source
    };
  }

  return {
    resource: resourceOrOptions,
    selectedResources
  };
}

function isPasteContextCommandOptions(value: unknown): value is PasteContextCommandOptions {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'source' in value &&
      isContextBuildSource((value as PasteContextCommandOptions).source)
  );
}

function isContextBuildSource(value: unknown): value is ContextBuildSource {
  return value === 'auto' || value === 'explorer';
}
