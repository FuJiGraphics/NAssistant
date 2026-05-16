import type { ExplorerState } from './explorerTree';
import type { SettingsState } from './features';

export type NAssistantTab = 'explorer' | 'settings';

export interface NAssistantState {
  activeTab: NAssistantTab;
  explorer: ExplorerState;
  settings: SettingsState;
}
