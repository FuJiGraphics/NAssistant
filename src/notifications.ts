import { window } from 'vscode';

export function showStatusMessage(message: string, timeout: number): void {
  window.setStatusBarMessage(message, timeout);
}
