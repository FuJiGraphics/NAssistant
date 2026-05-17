import { workspace } from 'vscode';

import {
  type AssistantTarget,
  type AssistantTargetOption,
  getAssistantTargetLabel,
  getAssistantTargetOptions,
  getConfiguredAssistantTarget
} from './assistantTargets';
import { COMMANDS, CONFIG_SECTION } from './constants';
import {
  type ExplorerAppearanceState,
  getExplorerAppearanceState
} from './explorerAppearance';

export const FEATURE_DEFINITIONS = [
  {
    id: 'copySelectionLocation',
    setting: 'features.copySelectionLocation.enabled',
    command: COMMANDS.copySelectionAsAiContext,
    title: 'Selection Location',
    context: 'Editor selection',
    shortcut: 'Ctrl+Shift+C',
    macShortcut: 'Cmd+Shift+C',
    preview: '[location: src/example.ts:12-38]'
  },
  {
    id: 'copyFileReference',
    setting: 'features.copyFileReference.enabled',
    command: COMMANDS.copyFileReferenceForAi,
    title: 'File Reference',
    context: 'Explorer file',
    shortcut: 'Ctrl+Shift+C',
    macShortcut: 'Cmd+Shift+C',
    preview: '[file: src/example.ts]'
  },
  {
    id: 'pasteContextToAssistant',
    setting: 'features.pasteContextToAssistant.enabled',
    command: COMMANDS.pasteContextToAssistant,
    title: 'Paste Context to Assistant',
    context: 'Editor selection or Explorer file',
    shortcut: 'Ctrl+Shift+V',
    macShortcut: 'Cmd+Shift+V',
    preview: 'Assistant input <- [location: src/example.ts:12-38]'
  }
] as const;

export type FeatureDefinition = (typeof FEATURE_DEFINITIONS)[number];
export type FeatureId = FeatureDefinition['id'];

export interface FeatureState {
  id: FeatureId;
  title: string;
  context: string;
  command: string;
  commandIds: FeatureCommandState[];
  shortcut: string;
  macShortcut: string;
  preview: string;
  enabled: boolean;
}

export interface FeatureCommandState {
  label: string;
  command: string;
}

export interface SettingsState {
  assistantTarget: AssistantTargetState;
  explorerAppearance: ExplorerAppearanceState;
  features: FeatureState[];
}

export interface AssistantTargetState {
  current: AssistantTarget;
  label: string;
  options: AssistantTargetOption[];
}

export function getSettingsState(appearance: ExplorerAppearanceState = getExplorerAppearanceState()): SettingsState {
  const assistantTarget = getConfiguredAssistantTarget();

  return {
    assistantTarget: {
      current: assistantTarget,
      label: getAssistantTargetLabel(assistantTarget),
      options: getAssistantTargetOptions()
    },
    explorerAppearance: appearance,
    features: FEATURE_DEFINITIONS.map((feature) => ({
      id: feature.id,
      title: feature.title,
      context: feature.context,
      command: feature.command,
      commandIds: getFeatureCommandIds(feature),
      shortcut: feature.shortcut,
      macShortcut: feature.macShortcut,
      preview: feature.preview,
      enabled: getBooleanSetting(feature.setting, true)
    }))
  };
}

export function getFeatureDefinition(featureId: FeatureId): FeatureDefinition | undefined {
  return FEATURE_DEFINITIONS.find((feature) => feature.id === featureId);
}

export function isFeatureEnabled(featureId: FeatureId): boolean {
  const feature = getFeatureDefinition(featureId);

  return feature ? getBooleanSetting(feature.setting, true) : false;
}

export function isFeatureId(value: unknown): value is FeatureId {
  return typeof value === 'string' && FEATURE_DEFINITIONS.some((feature) => feature.id === value);
}

function getBooleanSetting(setting: string, fallback: boolean): boolean {
  return workspace.getConfiguration(CONFIG_SECTION).get<boolean>(setting, fallback);
}

function getFeatureCommandIds(feature: FeatureDefinition): FeatureCommandState[] {
  return [
    {
      label: 'ID',
      command: feature.command
    }
  ];
}
