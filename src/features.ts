import { workspace } from 'vscode';

import { COMMANDS, CONFIG_SECTION } from './constants';

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
  }
] as const;

export type FeatureDefinition = (typeof FEATURE_DEFINITIONS)[number];
export type FeatureId = FeatureDefinition['id'];

export interface FeatureState {
  id: FeatureId;
  title: string;
  context: string;
  command: string;
  shortcut: string;
  macShortcut: string;
  preview: string;
  enabled: boolean;
}

export interface SettingsState {
  features: FeatureState[];
}

export function getSettingsState(): SettingsState {
  return {
    features: FEATURE_DEFINITIONS.map((feature) => ({
      id: feature.id,
      title: feature.title,
      context: feature.context,
      command: feature.command,
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
