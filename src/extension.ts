import type * as vscode from 'vscode';
import { window } from 'vscode';

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
    window.registerTreeDataProvider('nassistant.sidebar', new EmptyViewProvider())
  );
}

export function deactivate(): void {
  // Intentionally empty.
}
