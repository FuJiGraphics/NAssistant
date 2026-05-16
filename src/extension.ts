import type * as vscode from 'vscode';
import { commands, window, workspace } from 'vscode';

import {
  copyFileReferenceForAi,
  copySelectionAsAiContext,
  hideFolderFromExplorer,
  openSettingsView,
  pasteContextToAssistant,
  pasteContextToClaude,
  pasteContextToCodex,
  showHiddenExplorerFolders
} from './commands';
import { COMMANDS, CONFIG_SECTION, SIDEBAR_VIEW_ID } from './constants';
import { SettingsViewProvider } from './settingsView';

export function activate(context: vscode.ExtensionContext): void {
  const settingsViewProvider = new SettingsViewProvider();

  context.subscriptions.push(
    settingsViewProvider,
    window.registerWebviewViewProvider(SIDEBAR_VIEW_ID, settingsViewProvider),
    commands.registerCommand(COMMANDS.openSettings, openSettingsView),
    commands.registerCommand(COMMANDS.copyFileReferenceForAi, copyFileReferenceForAi),
    commands.registerCommand(COMMANDS.copySelectionAsAiContext, copySelectionAsAiContext),
    commands.registerCommand(COMMANDS.hideFolderFromExplorer, hideFolderFromExplorer),
    commands.registerCommand(COMMANDS.pasteContextToAssistant, pasteContextToAssistant),
    commands.registerCommand(COMMANDS.pasteContextToClaude, pasteContextToClaude),
    commands.registerCommand(COMMANDS.pasteContextToCodex, pasteContextToCodex),
    commands.registerCommand(COMMANDS.showHiddenExplorerFolders, showHiddenExplorerFolders),
    workspace.onDidChangeConfiguration((event) => {
      if (
        event.affectsConfiguration(CONFIG_SECTION) ||
        event.affectsConfiguration('files.exclude') ||
        event.affectsConfiguration('workbench.tree.expandMode')
      ) {
        settingsViewProvider.refresh();
      }
    })
  );
}

export function deactivate(): void {
  // Intentionally empty.
}
