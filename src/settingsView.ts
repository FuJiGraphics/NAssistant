import type * as vscode from 'vscode';
import { ConfigurationTarget, env, workspace } from 'vscode';

import {
  ASSISTANT_TARGET_SETTING,
  type AssistantTarget,
  getAssistantTargetLabel,
  isAssistantTarget
} from './assistantTargets';
import { openShortcutEditor } from './commands';
import { CONFIG_SECTION } from './constants';
import { type FeatureId, getFeatureDefinition, getSettingsState, isFeatureId } from './features';
import { showStatusMessage } from './notifications';
import { createSettingsHtml } from './settingsHtml';

type SettingsMessage =
  | {
      type: 'ready';
    }
  | {
      type: 'refresh';
    }
  | {
      type: 'toggleFeature';
      featureId: FeatureId;
      enabled: boolean;
    }
  | {
      type: 'setAssistantTarget';
      target: AssistantTarget;
    }
  | {
      type: 'openShortcutEditor';
      command: string;
    }
  | {
      type: 'copyCommandId';
      command: string;
    };

export class SettingsViewProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.onDidReceiveMessage((message: unknown) => {
      void this.handleMessage(message);
    });
    this.renderHtml();
  }

  refresh(): void {
    this.renderHtml();
  }

  private async handleMessage(message: unknown): Promise<void> {
    if (!isSettingsMessage(message)) {
      return;
    }

    switch (message.type) {
      case 'ready':
        this.postState();
        return;

      case 'refresh':
        this.renderHtml();
        return;

      case 'toggleFeature':
        await this.updateFeature(message.featureId, message.enabled);
        return;

      case 'setAssistantTarget':
        await this.updateAssistantTarget(message.target);
        return;

      case 'openShortcutEditor':
        await openShortcutEditor(message.command);
        return;

      case 'copyCommandId':
        await env.clipboard.writeText(message.command);
        showStatusMessage(`NAssistant: Copied ${message.command}`, 2000);
        return;
    }
  }

  private async updateFeature(featureId: FeatureId, enabled: boolean): Promise<void> {
    const feature = getFeatureDefinition(featureId);

    if (!feature) {
      return;
    }

    await workspace
      .getConfiguration(CONFIG_SECTION)
      .update(feature.setting, enabled, ConfigurationTarget.Global);
    this.postState();
  }

  private async updateAssistantTarget(target: AssistantTarget): Promise<void> {
    await workspace
      .getConfiguration(CONFIG_SECTION)
      .update(ASSISTANT_TARGET_SETTING, target, ConfigurationTarget.Global);
    this.postState();
    showStatusMessage(`NAssistant: Paste target set to ${getAssistantTargetLabel(target)}.`, 2000);
  }

  private postState(): void {
    this.view?.webview.postMessage({
      type: 'state',
      state: getSettingsState()
    });
  }

  private renderHtml(): void {
    if (!this.view) {
      return;
    }

    this.view.webview.html = createSettingsHtml(getSettingsState());
  }
}

function isSettingsMessage(message: unknown): message is SettingsMessage {
  if (!message || typeof message !== 'object') {
    return false;
  }

  const candidate = message as Partial<SettingsMessage>;

  switch (candidate.type) {
    case 'ready':
    case 'refresh':
      return true;

    case 'toggleFeature':
      return isFeatureId(candidate.featureId) && typeof candidate.enabled === 'boolean';

    case 'setAssistantTarget':
      return isAssistantTarget(candidate.target);

    case 'openShortcutEditor':
    case 'copyCommandId':
      return typeof candidate.command === 'string';

    default:
      return false;
  }
}
