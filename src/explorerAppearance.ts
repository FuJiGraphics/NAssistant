import { workspace } from 'vscode';

import { CONFIG_SECTION } from './constants';

export const FOLDER_ICONS_SETTING = 'explorer.folderIcons';
export const FILE_EXTENSION_ICONS_SETTING = 'explorer.fileExtensionIcons';
export const HIDDEN_FILE_EXTENSIONS_SETTING = 'explorer.hiddenFileExtensions';
export const COLOR_PALETTE_SETTING = 'explorer.colorPalette';

export interface ExplorerIconPreset {
  id: string;
  label: string;
  text: string;
}

export interface ExplorerColorPreset {
  id: string;
  label: string;
  value: string;
  className: string;
  isDefault: boolean;
  canRemove: boolean;
}

export interface FolderIconRule {
  path: string;
  icon: string;
  color: string;
}

export interface FileExtensionIconRule {
  extension: string;
  icon: string;
  color: string;
}

export interface ExplorerNodeIcon {
  icon: string;
  color: string;
  text: string;
  label: string;
}

export interface FileExtensionRuleState {
  extension: string;
  icon: string;
  color: string;
  hidden: boolean;
  isDefault: boolean;
}

export interface ExplorerAppearanceState {
  iconPresets: ExplorerIconPreset[];
  colorPresets: ExplorerColorPreset[];
  fileExtensionRules: FileExtensionRuleState[];
}

const DEFAULT_ICON_ID = 'file';
const DEFAULT_FOLDER_ICON_ID = 'folder';
export const DEFAULT_COLOR_ID = 'muted';

export const ICON_PRESETS: ExplorerIconPreset[] = [
  { id: 'folder', label: 'Folder', text: 'DIR' },
  { id: 'source', label: 'Source', text: 'SRC' },
  { id: 'docs', label: 'Docs', text: 'DOC' },
  { id: 'config', label: 'Config', text: 'CFG' },
  { id: 'asset', label: 'Assets', text: 'AST' },
  { id: 'package', label: 'Package', text: 'PKG' },
  { id: 'test', label: 'Tests', text: 'TST' },
  { id: 'ui', label: 'UI', text: 'UI' },
  { id: 'api', label: 'API', text: 'API' },
  { id: 'data', label: 'Data', text: 'DB' },
  { id: 'build', label: 'Build Output', text: 'OUT' },
  { id: 'ts', label: 'TypeScript', text: 'TS' },
  { id: 'tsx', label: 'TypeScript React', text: 'TSX' },
  { id: 'js', label: 'JavaScript', text: 'JS' },
  { id: 'jsx', label: 'JavaScript React', text: 'JSX' },
  { id: 'json', label: 'JSON', text: '{}' },
  { id: 'md', label: 'Markdown', text: 'MD' },
  { id: 'cs', label: 'C#', text: 'C#' },
  { id: 'css', label: 'CSS', text: '#' },
  { id: 'html', label: 'HTML', text: '<>' },
  { id: 'yaml', label: 'YAML', text: 'YML' },
  { id: 'xml', label: 'XML', text: 'XML' },
  { id: 'py', label: 'Python', text: 'PY' },
  { id: 'shell', label: 'Shell', text: 'SH' },
  { id: 'text', label: 'Text', text: 'TXT' },
  { id: 'image', label: 'Image', text: 'IMG' },
  { id: 'archive', label: 'Archive', text: 'ZIP' },
  { id: 'database', label: 'Database', text: 'DB' },
  { id: 'lock', label: 'Lockfile', text: 'L' },
  { id: 'file', label: 'File', text: 'F' }
];

export const COLOR_PRESETS: ExplorerColorPreset[] = [
  { id: 'muted', label: 'Muted', value: '#9AA0A6', className: 'iconColorMuted', isDefault: true, canRemove: false },
  { id: 'blue', label: 'Blue', value: '#4FC1FF', className: 'iconColorBlue', isDefault: true, canRemove: false },
  { id: 'green', label: 'Green', value: '#7EE787', className: 'iconColorGreen', isDefault: true, canRemove: false },
  { id: 'yellow', label: 'Yellow', value: '#F7C663', className: 'iconColorYellow', isDefault: true, canRemove: false },
  { id: 'orange', label: 'Orange', value: '#F78C6C', className: 'iconColorOrange', isDefault: true, canRemove: false },
  { id: 'pink', label: 'Pink', value: '#C586C0', className: 'iconColorPink', isDefault: true, canRemove: false },
  { id: 'cyan', label: 'Cyan', value: '#9CDCFE', className: 'iconColorCyan', isDefault: true, canRemove: false }
];

const DEFAULT_EXTENSION_RULES: FileExtensionIconRule[] = [
  { extension: '.ts', icon: 'ts', color: 'blue' },
  { extension: '.tsx', icon: 'tsx', color: 'blue' },
  { extension: '.js', icon: 'js', color: 'yellow' },
  { extension: '.jsx', icon: 'jsx', color: 'yellow' },
  { extension: '.json', icon: 'json', color: 'green' },
  { extension: '.md', icon: 'md', color: 'cyan' },
  { extension: '.cs', icon: 'cs', color: 'pink' },
  { extension: '.css', icon: 'css', color: 'blue' },
  { extension: '.html', icon: 'html', color: 'orange' },
  { extension: '.yml', icon: 'yaml', color: 'orange' },
  { extension: '.yaml', icon: 'yaml', color: 'orange' },
  { extension: '.xml', icon: 'xml', color: 'orange' },
  { extension: '.py', icon: 'py', color: 'blue' },
  { extension: '.sh', icon: 'shell', color: 'green' },
  { extension: '.txt', icon: 'text', color: 'muted' },
  { extension: '.png', icon: 'image', color: 'green' },
  { extension: '.jpg', icon: 'image', color: 'green' },
  { extension: '.jpeg', icon: 'image', color: 'green' },
  { extension: '.gif', icon: 'image', color: 'green' },
  { extension: '.svg', icon: 'image', color: 'green' },
  { extension: '.webp', icon: 'image', color: 'green' },
  { extension: '.zip', icon: 'archive', color: 'yellow' },
  { extension: '.db', icon: 'database', color: 'cyan' },
  { extension: '.sqlite', icon: 'database', color: 'cyan' },
  { extension: '.lock', icon: 'lock', color: 'muted' }
];

export function getExplorerAppearanceState(): ExplorerAppearanceState {
  const customRules = getFileExtensionIconRules();
  const hiddenExtensions = new Set(getHiddenFileExtensions());
  const rulesByExtension = new Map<string, FileExtensionRuleState>();

  for (const rule of DEFAULT_EXTENSION_RULES) {
    rulesByExtension.set(rule.extension, {
      extension: rule.extension,
      icon: rule.icon,
      color: rule.color,
      hidden: hiddenExtensions.has(rule.extension),
      isDefault: true
    });
  }

  for (const rule of customRules) {
    rulesByExtension.set(rule.extension, {
      extension: rule.extension,
      icon: rule.icon,
      color: rule.color,
      hidden: hiddenExtensions.has(rule.extension),
      isDefault: rulesByExtension.get(rule.extension)?.isDefault ?? false
    });
  }

  for (const extension of hiddenExtensions) {
    if (!rulesByExtension.has(extension)) {
      rulesByExtension.set(extension, {
        extension,
        icon: DEFAULT_ICON_ID,
        color: DEFAULT_COLOR_ID,
        hidden: true,
        isDefault: false
      });
    }
  }

  return {
    iconPresets: ICON_PRESETS,
    colorPresets: getExplorerColorPresets(),
    fileExtensionRules: [...rulesByExtension.values()].sort(compareExtensionRules)
  };
}

export interface ExplorerAppearanceResolver {
  getFolderIcon(relativePath: string): ExplorerNodeIcon;
  getFileIcon(name: string): ExplorerNodeIcon;
  isHiddenFile(name: string): boolean;
}

export function createExplorerAppearanceResolver(): ExplorerAppearanceResolver {
  const folderRulesByPath = new Map(getFolderIconRules().map((rule) => [rule.path, rule]));
  const fileRulesByExt = new Map<string, FileExtensionIconRule>();

  for (const rule of DEFAULT_EXTENSION_RULES) {
    fileRulesByExt.set(rule.extension, rule);
  }

  for (const rule of getFileExtensionIconRules()) {
    fileRulesByExt.set(rule.extension, rule);
  }

  const hiddenExtensions = new Set(getHiddenFileExtensions());
  const colorPresetsById = new Map(getExplorerColorPresets().map((preset) => [preset.id, preset]));

  const resolveIcon = (iconId: string, colorId: string): ExplorerNodeIcon => {
    const iconPreset = ICON_PRESETS.find((preset) => preset.id === iconId) ?? ICON_PRESETS[ICON_PRESETS.length - 1];
    const normalizedColor = COLOR_PRESETS.some((preset) => preset.id === colorId)
      ? colorId
      : normalizeHexColor(colorId) ?? DEFAULT_COLOR_ID;
    const colorPreset = colorPresetsById.get(normalizedColor) ?? COLOR_PRESETS[0];

    return {
      icon: iconPreset.id,
      color: colorPreset.id,
      text: iconPreset.text,
      label: iconPreset.label
    };
  };

  return {
    getFolderIcon(relativePath) {
      const rule = folderRulesByPath.get(relativePath);

      return resolveIcon(rule?.icon ?? DEFAULT_FOLDER_ICON_ID, rule?.color ?? 'blue');
    },
    getFileIcon(name) {
      const extension = getFileExtension(name);
      const rule = extension ? fileRulesByExt.get(extension) : undefined;

      return resolveIcon(rule?.icon ?? DEFAULT_ICON_ID, rule?.color ?? DEFAULT_COLOR_ID);
    },
    isHiddenFile(name) {
      const extension = getFileExtension(name);

      return Boolean(extension && hiddenExtensions.has(extension));
    }
  };
}

export function getFolderNodeIcon(relativePath: string): ExplorerNodeIcon {
  const rule = getFolderIconRules().find((entry) => entry.path === relativePath);

  return createNodeIcon(
    rule?.icon ?? DEFAULT_FOLDER_ICON_ID,
    rule?.color ?? 'blue'
  );
}

function getFileExtension(name: string): string | undefined {
  const normalizedName = name.toLowerCase();
  const dotIndex = normalizedName.lastIndexOf('.');

  if (dotIndex <= 0 || dotIndex === normalizedName.length - 1) {
    return undefined;
  }

  return normalizeFileExtension(normalizedName.slice(dotIndex));
}

export function normalizeFileExtension(value: string): string | undefined {
  const trimmedValue = value.trim().toLowerCase();

  if (!trimmedValue) {
    return undefined;
  }

  const extension = trimmedValue.startsWith('.') ? trimmedValue : `.${trimmedValue}`;

  return /^\.[a-z0-9][a-z0-9_-]*$/.test(extension) ? extension : undefined;
}

export function isExplorerIconId(value: unknown): value is string {
  return typeof value === 'string' && ICON_PRESETS.some((preset) => preset.id === value);
}

export function isExplorerColorId(value: unknown): value is string {
  return typeof value === 'string' && (
    COLOR_PRESETS.some((preset) => preset.id === value) ||
    Boolean(normalizeHexColor(value))
  );
}

export function getFolderIconRules(): FolderIconRule[] {
  return getObjectArraySetting(FOLDER_ICONS_SETTING)
    .filter(isFolderIconRule)
    .map((rule) => ({
      ...rule,
      color: normalizeExplorerColor(rule.color)
    }));
}

export function getFileExtensionIconRules(): FileExtensionIconRule[] {
  return getObjectArraySetting(FILE_EXTENSION_ICONS_SETTING)
    .filter(isFileExtensionIconRule)
    .map((rule) => ({
      ...rule,
      extension: normalizeFileExtension(rule.extension) ?? rule.extension,
      color: normalizeExplorerColor(rule.color)
    }))
    .filter((rule) => Boolean(normalizeFileExtension(rule.extension)));
}

export function getExplorerColorPalette(): string[] {
  const configuredColors = workspace
    .getConfiguration(CONFIG_SECTION)
    .get<unknown[]>(COLOR_PALETTE_SETTING, []);
  const defaultValues = new Set(
    COLOR_PRESETS
      .map((preset) => normalizeHexColor(preset.value))
      .filter((value): value is string => Boolean(value))
  );
  const normalizedColors = configuredColors
    .map((value) => typeof value === 'string' ? normalizeHexColor(value) : undefined)
    .filter((value): value is string => Boolean(value))
    .filter((value) => !defaultValues.has(value));

  return [...new Set(normalizedColors)];
}

export function getHiddenFileExtensions(): string[] {
  const configuredExtensions = workspace
    .getConfiguration(CONFIG_SECTION)
    .get<unknown[]>(HIDDEN_FILE_EXTENSIONS_SETTING, []);
  const normalizedExtensions = configuredExtensions
    .map((value) => typeof value === 'string' ? normalizeFileExtension(value) : undefined)
    .filter((value): value is string => Boolean(value));

  return [...new Set(normalizedExtensions)].sort();
}

function createNodeIcon(icon: string, color: string): ExplorerNodeIcon {
  const iconPreset = ICON_PRESETS.find((preset) => preset.id === icon) ?? ICON_PRESETS[ICON_PRESETS.length - 1];
  const colorPreset = getExplorerColorPreset(color);

  return {
    icon: iconPreset.id,
    color: colorPreset.id,
    text: iconPreset.text,
    label: iconPreset.label
  };
}

export function getExplorerColorPresets(): ExplorerColorPreset[] {
  const customPalette = getExplorerColorPalette();
  const referencedColors = getReferencedHexColors()
    .filter((color) => !customPalette.includes(color));
  const customColors = [...customPalette, ...referencedColors];

  return [
    ...COLOR_PRESETS,
    ...customColors.map((color, index) => ({
      id: color,
      label: color,
      value: color,
      className: `iconColorCustom${index}`,
      isDefault: false,
      canRemove: customPalette.includes(color)
    }))
  ];
}

export function normalizeHexColor(value: string): string | undefined {
  const trimmedValue = value.trim();

  if (/^#[0-9a-f]{3}$/i.test(trimmedValue)) {
    const [, red, green, blue] = trimmedValue;

    return `#${red}${red}${green}${green}${blue}${blue}`.toUpperCase();
  }

  return /^#[0-9a-f]{6}$/i.test(trimmedValue) ? trimmedValue.toUpperCase() : undefined;
}

export function normalizeExplorerColor(value: string): string {
  if (COLOR_PRESETS.some((preset) => preset.id === value)) {
    return value;
  }

  return normalizeHexColor(value) ?? DEFAULT_COLOR_ID;
}

function getExplorerColorPreset(color: string): ExplorerColorPreset {
  const normalizedColor = normalizeExplorerColor(color);

  return getExplorerColorPresets().find((preset) => preset.id === normalizedColor) ?? COLOR_PRESETS[0];
}

function getReferencedHexColors(): string[] {
  const rawRules = [
    ...getObjectArraySetting(FOLDER_ICONS_SETTING),
    ...getObjectArraySetting(FILE_EXTENSION_ICONS_SETTING)
  ];
  const defaultValues = new Set(
    COLOR_PRESETS
      .map((preset) => normalizeHexColor(preset.value))
      .filter((value): value is string => Boolean(value))
  );
  const referencedColors = rawRules
    .map((rule) => {
      if (!rule || typeof rule !== 'object') {
        return undefined;
      }

      const color = (rule as Partial<FolderIconRule | FileExtensionIconRule>).color;

      return typeof color === 'string' ? normalizeHexColor(color) : undefined;
    })
    .filter((value): value is string => Boolean(value))
    .filter((value) => !defaultValues.has(value));

  return [...new Set(referencedColors)];
}

function getObjectArraySetting(setting: string): unknown[] {
  const configuredValue = workspace.getConfiguration(CONFIG_SECTION).get<unknown>(setting, []);

  return Array.isArray(configuredValue) ? configuredValue : [];
}

function isFolderIconRule(value: unknown): value is FolderIconRule {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<FolderIconRule>;

  return (
    typeof candidate.path === 'string' &&
    isExplorerIconId(candidate.icon) &&
    isExplorerColorId(candidate.color)
  );
}

function isFileExtensionIconRule(value: unknown): value is FileExtensionIconRule {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<FileExtensionIconRule>;

  return (
    typeof candidate.extension === 'string' &&
    Boolean(normalizeFileExtension(candidate.extension)) &&
    isExplorerIconId(candidate.icon) &&
    isExplorerColorId(candidate.color)
  );
}

function compareExtensionRules(left: FileExtensionRuleState, right: FileExtensionRuleState): number {
  if (left.isDefault !== right.isDefault) {
    return left.isDefault ? -1 : 1;
  }

  return left.extension.localeCompare(right.extension, undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}
