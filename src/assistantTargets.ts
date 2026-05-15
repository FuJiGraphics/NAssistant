import { commands, env, workspace } from 'vscode';

import { CONFIG_SECTION } from './constants';

export const ASSISTANT_TARGET_SETTING = 'assistant.defaultTarget';

const ASSISTANT_TARGET_IDS = ['claude', 'codex'] as const;
const DEFAULT_ASSISTANT_TARGET: AssistantTarget = 'claude';

export type AssistantTarget = (typeof ASSISTANT_TARGET_IDS)[number];

interface AssistantTargetDefinition {
  label: string;
  openCommand: string;
  focusCommand?: string;
  pasteDelayMs?: number;
  clearClipboardAfterPaste?: boolean;
}

export interface PasteTextOptions {
  pasteDelayMs?: number;
  clearClipboardAfterPaste?: boolean;
}

export interface AssistantTargetOption {
  target: AssistantTarget;
  label: string;
}

const TARGETS: Record<AssistantTarget, AssistantTargetDefinition> = {
  claude: {
    label: 'Claude (Default)',
    openCommand: 'claude-vscode.sidebar.open',
    focusCommand: 'claude-vscode.focus'
  },
  codex: {
    label: 'Codex',
    openCommand: 'chatgpt.openSidebar',
    pasteDelayMs: 400,
    clearClipboardAfterPaste: false
  }
};

export function getAssistantTargetLabel(target: AssistantTarget): string {
  return TARGETS[target].label;
}

export function getAssistantTargetOptions(): AssistantTargetOption[] {
  return ASSISTANT_TARGET_IDS.map((target) => ({
    target,
    label: TARGETS[target].label
  }));
}

export function getConfiguredAssistantTarget(): AssistantTarget {
  const configuredTarget = workspace
    .getConfiguration(CONFIG_SECTION)
    .get<unknown>(ASSISTANT_TARGET_SETTING, DEFAULT_ASSISTANT_TARGET);

  return isAssistantTarget(configuredTarget) ? configuredTarget : DEFAULT_ASSISTANT_TARGET;
}

export async function pasteTextToAssistant(
  target: AssistantTarget,
  text: string,
  options: PasteTextOptions = {}
): Promise<void> {
  const targetDefinition = TARGETS[target];

  await commands.executeCommand(targetDefinition.openCommand);

  if (targetDefinition.focusCommand) {
    await commands.executeCommand(targetDefinition.focusCommand);
  }

  const pasteDelayMs = options.pasteDelayMs ?? targetDefinition.pasteDelayMs;

  if (pasteDelayMs) {
    await delay(pasteDelayMs);
  }

  await pasteTextThroughClipboard(text, {
    clearClipboard: options.clearClipboardAfterPaste ?? targetDefinition.clearClipboardAfterPaste ?? true
  });
}

interface ClipboardPasteOptions {
  clearClipboard: boolean;
}

async function pasteTextThroughClipboard(
  text: string,
  options: ClipboardPasteOptions
): Promise<void> {
  try {
    await env.clipboard.writeText(text);
    await commands.executeCommand('editor.action.clipboardPasteAction');
  } finally {
    if (options.clearClipboard) {
      await discardClipboardText();
    }
  }
}

async function discardClipboardText(): Promise<void> {
  try {
    await env.clipboard.writeText('');
  } catch {
    // Clipboard cleanup is best-effort.
  }
}

export function isAssistantTarget(value: unknown): value is AssistantTarget {
  return ASSISTANT_TARGET_IDS.includes(value as AssistantTarget);
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
