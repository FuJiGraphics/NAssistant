import type * as vscode from 'vscode';
import { commands, window, workspace } from 'vscode';

import {
  copyFileReferenceForAi,
  copySelectionAsAiContext,
  openSettingsView,
  pasteContextToAssistant,
  pasteContextToClaude,
  pasteContextToCodex
} from './commands';
import { COMMANDS, CONFIG_SECTION, SIDEBAR_VIEW_ID } from './constants';
import { SettingsViewProvider } from './settingsView';

export function activate(context: vscode.ExtensionContext): void {
  const settingsViewProvider = new SettingsViewProvider();

  context.subscriptions.push(
    window.registerWebviewViewProvider(SIDEBAR_VIEW_ID, settingsViewProvider),
    commands.registerCommand(COMMANDS.openSettings, openSettingsView),
    commands.registerCommand(COMMANDS.copyFileReferenceForAi, copyFileReferenceForAi),
    commands.registerCommand(COMMANDS.copySelectionAsAiContext, copySelectionAsAiContext),
    commands.registerCommand(COMMANDS.pasteContextToAssistant, pasteContextToAssistant),
    commands.registerCommand(COMMANDS.pasteContextToClaude, pasteContextToClaude),
    commands.registerCommand(COMMANDS.pasteContextToCodex, pasteContextToCodex),
    workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(CONFIG_SECTION)) {
        settingsViewProvider.refresh();
      }
    })
  );
}

export function deactivate(): void {
  // Intentionally empty.
}
