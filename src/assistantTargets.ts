import type * as vscode from 'vscode';
import { commands, env, workspace } from 'vscode';

import { CONFIG_SECTION } from './constants';

const LAST_ASSISTANT_TARGET_KEY = 'lastAssistantTarget';
const DEFAULT_TARGET_SETTING = 'assistant.defaultTarget';
const ASSISTANT_PASTE_DELAY_MS = 350;
const CLIPBOARD_RESTORE_DELAY_MS = 150;

export type AssistantTarget = 'claude' | 'codex';

interface AssistantTargetDefinition {
  label: string;
  openCommand: string;
}

const TARGETS: Record<AssistantTarget, AssistantTargetDefinition> = {
  claude: {
    label: 'Claude',
    openCommand: 'claude-vscode.sidebar.open'
  },
  codex: {
    label: 'Codex',
    openCommand: 'chatgpt.openSidebar'
  }
};

export function getAssistantTargetLabel(target: AssistantTarget): string {
  return TARGETS[target].label;
}

export function getDefaultAssistantTarget(): AssistantTarget {
  const configuredTarget = workspace
    .getConfiguration(CONFIG_SECTION)
    .get<unknown>(DEFAULT_TARGET_SETTING, 'codex');

  return isAssistantTarget(configuredTarget) ? configuredTarget : 'codex';
}

export async function pasteTextToAssistant(
  target: AssistantTarget,
  text: string,
  storage: vscode.Memento
): Promise<void> {
  const targetDefinition = TARGETS[target];

  await commands.executeCommand(targetDefinition.openCommand);
  await delay(ASSISTANT_PASTE_DELAY_MS);
  await pasteTextThroughClipboard(text);
  await storage.update(LAST_ASSISTANT_TARGET_KEY, target);
}

async function pasteTextThroughClipboard(text: string): Promise<void> {
  const previousClipboardText = await env.clipboard.readText();

  try {
    await env.clipboard.writeText(text);
    await commands.executeCommand('editor.action.clipboardPasteAction');
    await delay(CLIPBOARD_RESTORE_DELAY_MS);
  } finally {
    await env.clipboard.writeText(previousClipboardText);
  }
}

function isAssistantTarget(value: unknown): value is AssistantTarget {
  return value === 'claude' || value === 'codex';
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
