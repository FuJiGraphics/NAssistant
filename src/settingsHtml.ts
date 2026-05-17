import type { NAssistantState } from './appState';

export function createSettingsHtml(state: NAssistantState): string {
  const nonce = createNonce();
  const initialState = JSON.stringify(state).replace(/</g, '\\u003c');
  const customColorStyles = createCustomColorStyles(state);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NAssistant</title>
  <style nonce="${nonce}">
    :root {
      color-scheme: light dark;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
      font: 12px/1.45 var(--vscode-font-family);
    }

    button,
    input,
    select {
      font: inherit;
    }

    button {
      color: inherit;
    }

    .shell {
      min-width: 0;
      padding: 0 0 12px;
    }

    h1,
    h2,
    p {
      margin: 0;
    }

    h1 {
      overflow: hidden;
      font-size: 13px;
      font-weight: 650;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .meta,
    .subtle {
      color: var(--vscode-descriptionForeground);
    }

    .actionButton {
      min-height: 28px;
      border: 1px solid var(--vscode-button-border, transparent);
      border-radius: 6px;
      color: var(--vscode-button-secondaryForeground);
      background: var(--vscode-button-secondaryBackground);
      cursor: pointer;
    }

    .actionButton:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }

    .tabs {
      display: flex;
      align-items: flex-end;
      gap: 0;
      margin: 0 0 6px;
      padding-left: 8px;
      border-bottom: 1px solid var(--vscode-panel-border);
    }

    .tabButton {
      overflow: hidden;
      min-height: 21px;
      padding: 1px 8px 3px;
      border: 0;
      border-bottom: 1px solid transparent;
      border-radius: 0;
      color: var(--vscode-descriptionForeground);
      background: transparent;
      cursor: pointer;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tabButton:hover {
      color: var(--vscode-foreground);
      background: var(--vscode-list-hoverBackground);
    }

    .tabButton.isActive {
      color: var(--vscode-foreground);
      border-bottom-color: var(--vscode-focusBorder);
      background: var(--vscode-tab-activeBackground, transparent);
    }

    .panel[hidden] {
      display: none;
    }

    .section {
      margin-top: 0;
    }

    .section + .section {
      margin-top: 16px;
    }

    .sectionHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      padding: 0 4px;
    }

    .settingsLayout {
      display: grid;
      grid-template-columns: 108px minmax(0, 1fr);
      gap: 14px;
      padding: 12px 10px 0;
    }

    .settingsSubtabs {
      display: grid;
      align-self: start;
      gap: 2px;
      min-width: 0;
      padding: 0;
    }

    .settingsNavButton {
      position: relative;
      overflow: hidden;
      width: 100%;
      min-height: 28px;
      border: 0;
      border-radius: 4px;
      color: var(--vscode-descriptionForeground);
      background: transparent;
      cursor: pointer;
      padding: 4px 8px 4px 10px;
      font-weight: 600;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .settingsNavButton:hover {
      color: var(--vscode-foreground);
      background: var(--vscode-list-hoverBackground);
    }

    .settingsNavButton.isActive {
      color: var(--vscode-foreground);
      background: color-mix(in srgb, var(--vscode-list-activeSelectionBackground) 40%, transparent);
    }

    .settingsNavButton.isActive::before {
      content: "";
      position: absolute;
      left: 0;
      top: 6px;
      bottom: 6px;
      width: 2px;
      border-radius: 999px;
      background: var(--vscode-focusBorder);
    }

    .settingsContent {
      min-width: 0;
    }

    .settingsPane {
      padding: 0;
    }

    .settingsPane[hidden] {
      display: none;
    }

    .settingsIntro {
      margin: -2px 0 10px;
      color: var(--vscode-descriptionForeground);
      font-size: 11px;
    }

    .settingsRows {
      display: grid;
      gap: 0;
      border-top: 1px solid var(--vscode-panel-border);
    }

    .settingRow {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(160px, 0.48fr);
      align-items: start;
      gap: 14px;
      min-width: 0;
      min-height: 54px;
      border: 0;
      border-bottom: 1px solid var(--vscode-panel-border);
      border-radius: 0;
      background: transparent;
      padding: 10px 0;
    }

    .settingCopy {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .settingTitle {
      display: block;
      overflow: hidden;
      font-weight: 650;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .settingDescription {
      display: block;
      overflow: hidden;
      margin-top: 2px;
      color: var(--vscode-descriptionForeground);
      font-size: 11px;
      line-height: 1.35;
      text-overflow: ellipsis;
      white-space: normal;
    }

    .settingControl {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      min-width: 0;
      align-self: center;
    }

    .settingControlWide {
      width: 100%;
    }

    .settingsDropdown {
      position: relative;
      width: 100%;
    }

    .settingsDropdownButton {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      width: 100%;
      min-height: 28px;
      border: 1px solid var(--vscode-dropdown-border, var(--vscode-input-border, var(--vscode-panel-border)));
      border-radius: 3px;
      color: var(--vscode-dropdown-foreground, var(--vscode-foreground));
      background: var(--vscode-dropdown-background, var(--vscode-input-background));
      cursor: pointer;
      padding: 3px 8px;
      text-align: left;
    }

    .settingsDropdownButton:hover,
    .settingsDropdownButton.isOpen {
      border-color: var(--vscode-focusBorder);
    }

    .settingsDropdownChevron {
      flex: 0 0 auto;
      color: var(--vscode-descriptionForeground);
      font-size: 10px;
      line-height: 1;
    }

    .settingsDropdownMenu {
      position: absolute;
      z-index: 40;
      left: 0;
      right: 0;
      top: calc(100% + 4px);
      border: 1px solid var(--vscode-dropdown-border, var(--vscode-panel-border));
      border-radius: 4px;
      color: var(--vscode-dropdown-foreground, var(--vscode-foreground));
      background: var(--vscode-dropdown-background, var(--vscode-editorWidget-background));
      box-shadow: 0 4px 12px rgb(0 0 0 / 28%);
      padding: 3px 0;
    }

    .settingsDropdownMenu[hidden] {
      display: none;
    }

    .settingsDropdownMenu button {
      display: block;
      width: 100%;
      min-height: 26px;
      border: 0;
      color: inherit;
      background: transparent;
      cursor: pointer;
      padding: 4px 8px;
      text-align: left;
    }

    .settingsDropdownMenu button:hover,
    .settingsDropdownMenu button.isSelected {
      background: var(--vscode-list-hoverBackground);
    }

    h2 {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    .count {
      color: var(--vscode-descriptionForeground);
      font-size: 11px;
    }

    .tree {
      min-width: 0;
      user-select: none;
    }

    .explorerTools {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 6px 7px;
      border-bottom: 1px solid var(--vscode-panel-border);
      background: var(--vscode-sideBar-background);
    }

    .searchBox {
      position: relative;
      flex: 1 1 auto;
      min-width: 0;
    }

    .searchIcon {
      position: absolute;
      left: 8px;
      top: 50%;
      width: 10px;
      height: 10px;
      border: 1.5px solid var(--vscode-descriptionForeground);
      border-radius: 999px;
      pointer-events: none;
      transform: translateY(-56%);
    }

    .searchIcon::after {
      content: "";
      position: absolute;
      right: -4px;
      bottom: -3px;
      width: 5px;
      height: 1.5px;
      border-radius: 999px;
      background: var(--vscode-descriptionForeground);
      transform: rotate(45deg);
      transform-origin: left center;
    }

    .filterInput {
      min-width: 0;
      width: 100%;
      min-height: 26px;
      border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
      border-radius: 6px;
      color: var(--vscode-input-foreground);
      background: var(--vscode-input-background);
      padding: 3px 7px 3px 25px;
    }

    .filterInput:focus {
      border-color: var(--vscode-focusBorder);
    }

    .toolButton {
      position: relative;
      flex: 0 0 auto;
      width: 32px;
      height: 26px;
      border: 1px solid var(--vscode-button-border, var(--vscode-panel-border));
      border-radius: 6px;
      color: var(--vscode-button-secondaryForeground);
      background: var(--vscode-button-secondaryBackground);
      cursor: pointer;
      padding: 0;
    }

    .toolButton:hover,
    .toolButton.isActive {
      background: var(--vscode-button-secondaryHoverBackground);
    }

    .optionsButton::before,
    .optionsButton::after,
    .optionsButton .optionLine {
      content: "";
      position: absolute;
      left: 9px;
      width: 13px;
      height: 1px;
      background: currentColor;
    }

    .optionsButton::before {
      top: 8px;
    }

    .optionsButton .optionLine {
      top: 13px;
    }

    .optionsButton::after {
      top: 18px;
    }

    .explorerOptions {
      position: fixed;
      z-index: 20;
      width: 188px;
      max-width: calc(100vw - 12px);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 7px;
      background: var(--vscode-editor-background);
      box-shadow: 0 4px 14px rgb(0 0 0 / 28%);
      padding: 6px;
    }

    .explorerOptions[hidden] {
      display: none;
    }

    .optionRow,
    .optionField {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }

    .optionRow {
      min-height: 24px;
      padding: 2px 0;
    }

    .optionField {
      margin-top: 5px;
    }

    .optionLabel {
      flex: 0 0 auto;
      color: var(--vscode-descriptionForeground);
      font-size: 11px;
    }

    .optionCheck {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: 0;
      opacity: 0;
    }

    .switchTrack {
      position: relative;
      flex: 0 0 auto;
      width: 30px;
      height: 16px;
      border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
      border-radius: 999px;
      background: var(--vscode-input-background);
    }

    .switchTrack::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--vscode-descriptionForeground);
      transition: transform 120ms ease, background 120ms ease;
    }

    .optionCheck:checked + .switchTrack,
    .optionCheck:checked ~ .switchTrack {
      border-color: var(--vscode-focusBorder);
      background: color-mix(in srgb, var(--vscode-button-background) 70%, transparent);
    }

    .optionCheck:checked + .switchTrack::after,
    .optionCheck:checked ~ .switchTrack::after {
      background: var(--vscode-button-foreground);
      transform: translateX(14px);
    }

    .optionSelect {
      min-width: 0;
      flex: 1 1 auto;
      min-height: 24px;
      border: 1px solid var(--vscode-dropdown-border, var(--vscode-input-border, var(--vscode-panel-border)));
      border-radius: 6px;
      color: var(--vscode-dropdown-foreground, var(--vscode-foreground));
      background: var(--vscode-dropdown-background, var(--vscode-input-background));
      padding: 2px 6px;
    }

    .treeRow {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 46px;
      align-items: center;
      min-height: 22px;
      border-radius: 0;
    }

    .treeRow:hover:not(.isSelected) {
      background: var(--vscode-list-hoverBackground);
    }

    .treeRow.isDropTarget {
      outline: 1px solid var(--vscode-list-dropBackground, var(--vscode-focusBorder));
      outline-offset: -1px;
    }

    .treeRow.isSelected {
      background: var(--vscode-list-activeSelectionBackground);
      color: var(--vscode-list-activeSelectionForeground);
    }

    .treeRow.isSelected:hover {
      background: var(--vscode-list-activeSelectionBackground);
      color: var(--vscode-list-activeSelectionForeground);
    }

    .treeRow.isHidden .nodeIcon,
    .treeRow.isHidden .nodeLabel {
      opacity: 0.48;
    }

    .treeRow.isEditing .rowActions {
      visibility: hidden;
    }

    .nodeMain {
      display: flex;
      align-items: center;
      min-width: 0;
      width: 100%;
      min-height: 22px;
      border: 0;
      background: transparent;
      cursor: pointer;
      text-align: left;
    }

    .renameMain {
      cursor: text;
    }

    .depth0 .nodeMain { padding: 0 2px 0 2px; }
    .depth1 .nodeMain { padding: 0 2px 0 14px; }
    .depth2 .nodeMain { padding: 0 2px 0 26px; }
    .depth3 .nodeMain { padding: 0 2px 0 38px; }
    .depth4 .nodeMain { padding: 0 2px 0 50px; }
    .depth5 .nodeMain { padding: 0 2px 0 62px; }
    .depth6 .nodeMain { padding: 0 2px 0 74px; }
    .depth7 .nodeMain { padding: 0 2px 0 86px; }
    .depth8 .nodeMain { padding: 0 2px 0 98px; }
    .depth9 .nodeMain { padding: 0 2px 0 110px; }
    .depth10 .nodeMain { padding: 0 2px 0 122px; }
    .depth11 .nodeMain { padding: 0 2px 0 134px; }
    .depth12 .nodeMain { padding: 0 2px 0 146px; }

    .disclosure {
      flex: 0 0 14px;
      width: 14px;
      height: 18px;
      color: var(--vscode-descriptionForeground);
      text-align: center;
    }

    .disclosureButton {
      border: 0;
      background: transparent;
      cursor: pointer;
      padding: 0;
      font: inherit;
    }

    .disclosurePlaceholder {
      cursor: default;
    }

    .nodeIcon {
      position: relative;
      flex: 0 0 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
      color: var(--vscode-descriptionForeground);
    }

    .nodeIcon.folder::before {
      content: "";
      position: absolute;
      left: 2px;
      top: 5px;
      width: 12px;
      height: 8px;
      border: 1px solid currentColor;
      border-radius: 2px;
    }

    .nodeIcon.folder::after {
      content: "";
      position: absolute;
      left: 3px;
      top: 3px;
      width: 6px;
      height: 4px;
      border: 1px solid currentColor;
      border-bottom: 0;
      border-radius: 2px 2px 0 0;
    }

    .nodeIcon.file::before {
      content: "";
      position: absolute;
      left: 4px;
      top: 2px;
      width: 8px;
      height: 12px;
      border: 1px solid currentColor;
      border-radius: 2px;
    }

    .nodeIconButton {
      display: grid;
      place-items: center;
      flex: 0 0 20px;
      width: 20px;
      height: 20px;
      margin-right: 3px;
      border: 0;
      border-radius: 4px;
      background: transparent;
      cursor: pointer;
      padding: 1px;
    }

    .nodeIconButton:hover {
      background: var(--vscode-toolbar-hoverBackground);
    }

    .nodeIconButton .nodeIcon {
      margin-right: 0;
    }

    .nodeIcon.fileTypeIcon {
      display: grid;
      place-items: center;
      isolation: isolate;
      color: var(--node-icon-color, var(--vscode-descriptionForeground));
      font-family: var(--vscode-editor-font-family);
    }

    .iconColorMuted {
      --node-icon-color: #9aa0a6;
      --choice-color: #9aa0a6;
    }

    .iconColorBlue {
      --node-icon-color: #4fc1ff;
      --choice-color: #4fc1ff;
    }

    .iconColorGreen {
      --node-icon-color: #7ee787;
      --choice-color: #7ee787;
    }

    .iconColorYellow {
      --node-icon-color: #f7c663;
      --choice-color: #f7c663;
    }

    .iconColorOrange {
      --node-icon-color: #f78c6c;
      --choice-color: #f78c6c;
    }

    .iconColorPink {
      --node-icon-color: #c586c0;
      --choice-color: #c586c0;
    }

    .iconColorCyan {
      --node-icon-color: #9cdcfe;
      --choice-color: #9cdcfe;
    }

${customColorStyles}

    .nodeIconText {
      overflow: hidden;
      max-width: 16px;
      color: var(--node-icon-color, var(--vscode-descriptionForeground));
      font-size: 7.5px;
      font-weight: 750;
      line-height: 1;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nodeLabel {
      overflow: hidden;
      min-width: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .gitBadge {
      display: inline-grid;
      place-items: center;
      flex: 0 0 auto;
      min-width: 14px;
      height: 14px;
      margin-left: 5px;
      border-radius: 999px;
      color: var(--vscode-badge-foreground);
      background: var(--vscode-badge-background);
      font-size: 9px;
      font-weight: 700;
      line-height: 1;
    }

    .gitBadge.modified,
    .gitBadge.staged {
      color: var(--vscode-gitDecoration-modifiedResourceForeground, var(--vscode-badge-foreground));
      background: transparent;
    }

    .gitBadge.untracked,
    .gitBadge.added {
      color: var(--vscode-gitDecoration-untrackedResourceForeground, var(--vscode-badge-foreground));
      background: transparent;
    }

    .gitBadge.deleted {
      color: var(--vscode-gitDecoration-deletedResourceForeground, var(--vscode-badge-foreground));
      background: transparent;
    }

    .gitBadge.conflict {
      color: var(--vscode-gitDecoration-conflictingResourceForeground, var(--vscode-badge-foreground));
      background: transparent;
    }

    .rowActions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1px;
      width: 46px;
      min-height: 22px;
      opacity: 0;
      visibility: hidden;
    }

    .treeRow:hover:not(.isEditing) .rowActions,
    .treeRow:focus-within:not(.isEditing) .rowActions {
      opacity: 1;
      visibility: visible;
    }

    .nodeActionButton,
    .actionSpacer {
      width: 22px;
      height: 22px;
    }

    .nodeActionButton {
      position: relative;
      border: 0;
      border-radius: 4px;
      background: transparent;
      cursor: pointer;
      opacity: 0.62;
    }

    .nodeActionButton:hover,
    .nodeActionButton.isHidden {
      opacity: 1;
      background: var(--vscode-toolbar-hoverBackground);
    }

    .menuButton::before {
      content: "...";
      position: absolute;
      left: 5px;
      top: 0;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .eyeButton::before {
      content: "";
      position: absolute;
      left: 5px;
      top: 7px;
      width: 12px;
      height: 8px;
      border: 1px solid currentColor;
      border-radius: 50%;
    }

    .eyeButton::after {
      content: "";
      position: absolute;
      left: 10px;
      top: 10px;
      width: 3px;
      height: 3px;
      border-radius: 999px;
      background: currentColor;
    }

    .eyeButton.isHidden .eyeSlash {
      position: absolute;
      left: 4px;
      top: 11px;
      width: 15px;
      height: 1px;
      background: currentColor;
      transform: rotate(-38deg);
    }

    .inlineNameInput {
      width: min(220px, 80%);
      min-height: 20px;
      border: 1px solid var(--vscode-input-border, var(--vscode-focusBorder));
      color: var(--vscode-input-foreground);
      background: var(--vscode-input-background);
      padding: 1px 4px;
      font: inherit;
      user-select: text;
    }

    .contextMenu {
      position: fixed;
      z-index: 10;
      min-width: 190px;
      border: 1px solid var(--vscode-menu-border, var(--vscode-panel-border));
      color: var(--vscode-menu-foreground, var(--vscode-foreground));
      background: var(--vscode-menu-background, var(--vscode-editorWidget-background));
      box-shadow: 0 4px 14px rgb(0 0 0 / 28%);
      padding: 4px 0;
    }

    .contextMenu[hidden] {
      display: none;
    }

    .contextMenu button {
      display: block;
      width: 100%;
      min-height: 24px;
      border: 0;
      color: inherit;
      background: transparent;
      padding: 3px 12px;
      text-align: left;
      cursor: pointer;
    }

    .contextMenu button:hover {
      color: var(--vscode-menu-selectionForeground, var(--vscode-foreground));
      background: var(--vscode-menu-selectionBackground, var(--vscode-list-hoverBackground));
    }

    .contextSeparator {
      height: 1px;
      margin: 4px 0;
      background: var(--vscode-menu-separatorBackground, var(--vscode-panel-border));
    }

    .iconPicker {
      position: fixed;
      z-index: 30;
      width: 196px;
      max-width: calc(100vw - 12px);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 7px;
      color: var(--vscode-menu-foreground, var(--vscode-foreground));
      background: var(--vscode-menu-background, var(--vscode-editorWidget-background));
      box-shadow: 0 4px 14px rgb(0 0 0 / 28%);
      padding: 7px;
    }

    .iconPicker[hidden] {
      display: none;
    }

    .pickerLabel {
      margin: 2px 0 6px;
      color: var(--vscode-descriptionForeground);
      font-size: 11px;
      font-weight: 650;
    }

    .iconGrid,
    .colorGrid {
      display: grid;
      gap: 5px;
    }

    .iconGrid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .colorGrid {
      grid-template-columns: repeat(7, 1fr);
      margin-top: 8px;
    }

    .iconChoice,
    .colorChoice {
      border: 1px solid var(--vscode-panel-border);
      border-radius: 5px;
      background: var(--vscode-input-background);
      cursor: pointer;
    }

    .iconChoice {
      min-height: 28px;
      color: var(--choice-color, var(--vscode-descriptionForeground));
      font-size: 9px;
      font-weight: 750;
    }

    .colorChoice {
      height: 20px;
      background: var(--choice-color, var(--vscode-descriptionForeground));
    }

    .iconChoice.isSelected,
    .colorChoice.isSelected {
      border-color: var(--vscode-focusBorder);
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: 1px;
    }

    .colorPalette {
      display: grid;
      gap: 7px;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--vscode-panel-border);
    }

    .paletteHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }

    .paletteTitle {
      font-size: 11px;
      font-weight: 650;
    }

    .paletteGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(26px, 1fr));
      gap: 5px;
      min-width: 0;
    }

    .paletteColor {
      position: relative;
      min-width: 0;
      height: 24px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      background: var(--choice-color, var(--vscode-descriptionForeground));
    }

    .paletteColor.isDefault::after {
      content: "";
      position: absolute;
      right: 4px;
      bottom: 4px;
      width: 4px;
      height: 4px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--vscode-sideBar-background) 72%, transparent);
    }

    .paletteColor button {
      position: absolute;
      inset: -1px;
      border: 0;
      border-radius: 4px;
      color: var(--vscode-button-foreground);
      background: transparent;
      cursor: pointer;
      opacity: 0;
    }

    .paletteColor button:hover,
    .paletteColor button:focus-visible {
      opacity: 1;
      background: rgb(0 0 0 / 38%);
    }

    .paletteAdd {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 6px;
    }

    .paletteInput {
      min-width: 0;
      width: 100%;
      min-height: 26px;
      border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
      border-radius: 3px;
      color: var(--vscode-input-foreground);
      background: var(--vscode-input-background);
      padding: 2px 7px;
    }

    .featureList {
      display: grid;
      gap: 0;
      border-top: 1px solid var(--vscode-panel-border);
    }

    .featureCard {
      min-width: 0;
      border: 0;
      border-bottom: 1px solid var(--vscode-panel-border);
      border-radius: 0;
      background: transparent;
      padding: 10px 2px;
    }

    .featureTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 9px;
    }

    .featureInfo {
      min-width: 0;
    }

    .featureTitle {
      overflow-wrap: anywhere;
      font-weight: 650;
    }

    .meta {
      margin-top: 2px;
      font-size: 11px;
    }

    .preview {
      overflow: hidden;
      margin-bottom: 10px;
      padding: 7px 8px;
      border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
      border-radius: 6px;
      color: var(--vscode-textPreformat-foreground, var(--vscode-foreground));
      background: var(--vscode-textCodeBlock-background, var(--vscode-input-background));
      font-family: var(--vscode-editor-font-family);
      font-size: 11px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .targetField {
      display: grid;
      gap: 5px;
      margin-bottom: 10px;
    }

    .targetLabel {
      color: var(--vscode-descriptionForeground);
      font-size: 11px;
    }

    .targetSelect {
      width: 100%;
      min-height: 28px;
      border: 1px solid var(--vscode-dropdown-border, var(--vscode-input-border, var(--vscode-panel-border)));
      border-radius: 6px;
      color: var(--vscode-dropdown-foreground, var(--vscode-foreground));
      background: var(--vscode-dropdown-background, var(--vscode-input-background));
      padding: 3px 8px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .fileRules {
      display: grid;
      gap: 0;
      margin-top: 0;
      border-top: 1px solid var(--vscode-panel-border);
    }

    .fileRuleHeader,
    .fileRuleRow,
    .fileRuleAdd {
      display: grid;
      grid-template-columns: minmax(56px, 0.7fr) minmax(68px, 1fr) minmax(74px, 1fr) 36px 24px;
      align-items: center;
      gap: 6px;
      min-width: 0;
      padding: 7px 2px;
      border: 0;
      border-bottom: 1px solid var(--vscode-panel-border);
      border-radius: 0;
      background: transparent;
    }

    .fileRuleHeader {
      min-height: 24px;
      color: var(--vscode-descriptionForeground);
      font-size: 10px;
      font-weight: 650;
      text-transform: uppercase;
    }

    .fileRuleExtension {
      overflow: hidden;
      font-family: var(--vscode-editor-font-family);
      font-size: 11px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .fileRuleControls {
      display: contents;
    }

    .fileRuleInput {
      min-width: 0;
      width: 100%;
      min-height: 26px;
      border: 1px solid var(--vscode-dropdown-border, var(--vscode-input-border, var(--vscode-panel-border)));
      border-radius: 3px;
      color: var(--vscode-dropdown-foreground, var(--vscode-foreground));
      background: var(--vscode-dropdown-background, var(--vscode-input-background));
      padding: 2px 6px;
    }

    .fileRuleHidden {
      display: grid;
      place-items: center;
    }

    .fileRuleHidden input {
      margin: 0;
    }

    .fileRuleAdd .fileRuleInput {
      grid-column: 1 / 4;
    }

    .fileRuleRemove {
      width: 24px;
      height: 24px;
      border: 0;
      border-radius: 5px;
      background: transparent;
      cursor: pointer;
    }

    .fileRuleRemove:hover {
      background: var(--vscode-toolbar-hoverBackground);
    }

    .fileRuleAddButton {
      grid-column: 4 / 6;
      min-width: 0;
      min-height: 26px;
      border: 1px solid var(--vscode-button-border, var(--vscode-panel-border));
      border-radius: 3px;
      color: var(--vscode-button-secondaryForeground);
      background: var(--vscode-button-secondaryBackground);
      cursor: pointer;
    }

    .fileRuleAddButton:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }

    .paletteAdd .fileRuleAddButton {
      grid-column: auto;
    }

    .fileRuleIconPicker,
    .fileRuleColorPicker {
      position: relative;
      min-width: 0;
      width: 100%;
    }

    .fileRuleIconButton,
    .fileRuleColorButton {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 7px;
      width: 100%;
      min-height: 26px;
      border: 1px solid var(--vscode-dropdown-border, var(--vscode-input-border, var(--vscode-panel-border)));
      border-radius: 3px;
      color: var(--vscode-dropdown-foreground, var(--vscode-foreground));
      background: var(--vscode-dropdown-background, var(--vscode-input-background));
      cursor: pointer;
      padding: 2px 7px;
    }

    .fileRuleIconButton:hover,
    .fileRuleIconButton.isOpen,
    .fileRuleColorButton:hover,
    .fileRuleColorButton.isOpen {
      border-color: var(--vscode-focusBorder);
    }

    .fileRuleIconMark {
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      width: 16px;
      height: 16px;
      color: var(--vscode-descriptionForeground);
      font-family: var(--vscode-editor-font-family);
      font-size: 8px;
      font-weight: 750;
    }

    .colorSwatch {
      flex: 0 0 auto;
      width: 12px;
      height: 12px;
      border: 1px solid color-mix(in srgb, var(--choice-color, currentColor) 72%, var(--vscode-panel-border));
      border-radius: 3px;
      background: var(--choice-color, var(--vscode-descriptionForeground));
    }

    .fileRuleIconLabel,
    .fileRuleColorLabel {
      overflow: hidden;
      min-width: 0;
      flex: 1 1 auto;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .fileRuleIconChevron,
    .fileRuleColorChevron {
      flex: 0 0 auto;
      color: var(--vscode-descriptionForeground);
      font-size: 10px;
    }

    .fileRuleIconMenu,
    .fileRuleColorMenu {
      position: absolute;
      z-index: 40;
      left: 0;
      top: calc(100% + 4px);
      display: grid;
      grid-template-columns: repeat(7, 20px);
      gap: 5px;
      border: 1px solid var(--vscode-dropdown-border, var(--vscode-panel-border));
      border-radius: 5px;
      background: var(--vscode-dropdown-background, var(--vscode-editorWidget-background));
      box-shadow: 0 4px 12px rgb(0 0 0 / 28%);
      padding: 6px;
    }

    .fileRuleIconMenu {
      grid-template-columns: repeat(4, minmax(30px, 1fr));
      min-width: 154px;
    }

    .fileRuleIconMenu[hidden],
    .fileRuleColorMenu[hidden] {
      display: none;
    }

    .fileRuleIconChoice,
    .fileRuleColorChoice {
      width: 20px;
      height: 20px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      background: var(--choice-color, var(--vscode-descriptionForeground));
      cursor: pointer;
    }

    .fileRuleIconChoice {
      display: grid;
      place-items: center;
      width: auto;
      min-width: 30px;
      color: var(--vscode-foreground);
      background: var(--vscode-input-background);
      font-family: var(--vscode-editor-font-family);
      font-size: 9px;
      font-weight: 750;
    }

    .fileRuleIconChoice.isSelected,
    .fileRuleColorChoice.isSelected {
      border-color: var(--vscode-focusBorder);
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: 1px;
    }

    .actionButton {
      flex: 0 0 auto;
      padding: 4px 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .shortcutButton {
      flex: 1 1 132px;
      text-align: left;
    }

    .shortcutValue {
      color: var(--vscode-foreground);
      font-family: var(--vscode-editor-font-family);
      font-size: 11px;
    }

    .toggle {
      position: relative;
      flex: 0 0 auto;
      width: 38px;
      height: 22px;
      border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
      border-radius: 999px;
      background: var(--vscode-input-background);
      cursor: pointer;
    }

    .toggle::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 14px;
      height: 14px;
      border-radius: 999px;
      background: var(--vscode-descriptionForeground);
      transition: transform 120ms ease, background 120ms ease;
    }

    .toggle.isOn {
      border-color: var(--vscode-focusBorder);
      background: color-mix(in srgb, var(--vscode-button-background) 70%, transparent);
    }

    .toggle.isOn::after {
      transform: translateX(16px);
      background: var(--vscode-button-foreground);
    }

    .toggle:focus-visible,
    .actionButton:focus-visible,
    .filterInput:focus-visible,
    .optionSelect:focus-visible,
    .toolButton:focus-visible,
    .iconChoice:focus-visible,
    .colorChoice:focus-visible,
    .fileRuleInput:focus-visible,
    .fileRuleRemove:focus-visible,
    .fileRuleAddButton:focus-visible,
    .paletteInput:focus-visible,
    .paletteColor button:focus-visible,
    .fileRuleIconButton:focus-visible,
    .fileRuleIconChoice:focus-visible,
    .fileRuleColorButton:focus-visible,
    .fileRuleColorChoice:focus-visible,
    .settingsNavButton:focus-visible,
    .settingsDropdownButton:focus-visible,
    .settingsDropdownMenu button:focus-visible,
    .targetSelect:focus-visible,
    .tabButton:focus-visible,
    .treeRow:focus-visible,
    .disclosureButton:focus-visible,
    .nodeIconButton:focus-visible,
    .nodeActionButton:focus-visible {
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: 1px;
    }

    .optionCheck:focus-visible + .switchTrack,
    .optionCheck:focus-visible ~ .switchTrack {
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: 2px;
    }

    .disabled {
      opacity: 0.62;
    }

    @media (max-width: 430px) {
      .settingsLayout {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .settingsSubtabs {
        display: flex;
        overflow-x: auto;
        padding-bottom: 2px;
      }

      .settingsNavButton {
        flex: 0 0 auto;
        width: auto;
      }

      .settingsNavButton.isActive::before {
        left: 8px;
        right: 8px;
        top: auto;
        bottom: 0;
        width: auto;
        height: 2px;
      }

      .settingRow {
        grid-template-columns: 1fr;
        gap: 7px;
      }

      .settingControl {
        justify-self: start;
      }
    }

    @media (max-width: 240px) {
      .actionButton {
        flex: 1 1 100%;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <nav class="tabs" aria-label="NAssistant views">
      <button class="tabButton" type="button" data-action="tab" data-tab="explorer">Explorer</button>
      <button class="tabButton" type="button" data-action="tab" data-tab="settings">Settings</button>
    </nav>

    <section class="panel" id="explorerPanel" aria-label="Explorer">
      <div class="explorerTools">
        <div class="searchBox">
          <span class="searchIcon" aria-hidden="true"></span>
          <input class="filterInput" id="explorerFilterInput" type="search" placeholder="Search" aria-label="Search Explorer">
        </div>
        <button class="toolButton optionsButton" id="explorerOptionsButton" type="button" data-action="toggle-explorer-options" title="Explorer Options" aria-label="Explorer Options" aria-expanded="false">
          <span class="optionLine" aria-hidden="true"></span>
        </button>
      </div>
      <div class="explorerOptions" id="explorerOptionsPanel" role="dialog" aria-label="Explorer Options" hidden>
        <label class="optionRow">
          <input class="optionCheck" id="explorerShowHiddenInput" type="checkbox" data-action="toggle-explorer-show-hidden">
          <span>Show hidden</span>
          <span class="switchTrack" aria-hidden="true"></span>
        </label>
        <label class="optionField">
          <span class="optionLabel">Sort</span>
          <select class="optionSelect" id="explorerSortSelect" data-action="select-explorer-sort" aria-label="Explorer sort order">
            <option value="default">Default</option>
            <option value="nameAsc">Name A-Z</option>
            <option value="nameDesc">Name Z-A</option>
            <option value="type">Type</option>
          </select>
        </label>
      </div>
      <div class="tree" id="explorerTree" role="tree"></div>
    </section>

    <section class="panel" id="settingsPanel" aria-label="Settings" hidden>
      <div class="settingsLayout">
        <div class="settingsSubtabs" role="tablist" aria-label="Settings categories">
          <button class="settingsNavButton" type="button" data-action="settings-section" data-settings-section="features">Commands</button>
          <button class="settingsNavButton" type="button" data-action="settings-section" data-settings-section="explorer">Explorer</button>
          <button class="settingsNavButton" type="button" data-action="settings-section" data-settings-section="fileRules">Files</button>
        </div>
        <div class="settingsContent">
          <div class="settingsPane" data-settings-pane="features">
            <div class="sectionHeader">
              <h2 id="featuresHeading">Commands</h2>
              <span class="count" id="featureCount"></span>
            </div>
            <p class="settingsIntro">Copy and paste helpers exposed by NAssistant.</p>
            <div class="featureList" id="featureList"></div>
          </div>
          <div class="settingsPane" data-settings-pane="explorer" hidden>
            <div class="sectionHeader">
              <h2>Explorer</h2>
            </div>
            <p class="settingsIntro">Display behavior for the NAssistant Explorer.</p>
            <div class="settingsRows" id="explorerSettings"></div>
          </div>
          <div class="settingsPane" data-settings-pane="fileRules" hidden>
            <div class="sectionHeader">
              <h2>File Rules</h2>
              <span class="count" id="fileRuleCount"></span>
            </div>
            <p class="settingsIntro">Extension icons and NAssistant-only hide rules.</p>
            <div class="colorPalette" id="colorPalette"></div>
            <div class="fileRules" id="fileRules"></div>
          </div>
        </div>
      </div>
    </section>

    <div class="contextMenu" id="explorerContextMenu" hidden></div>
    <div class="iconPicker" id="folderIconPicker" hidden></div>
  </main>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    let state = ${initialState};

    const explorerPanel = document.getElementById('explorerPanel');
    const settingsPanel = document.getElementById('settingsPanel');
    const explorerTree = document.getElementById('explorerTree');
    const explorerContextMenu = document.getElementById('explorerContextMenu');
    const folderIconPicker = document.getElementById('folderIconPicker');
    const explorerFilterInput = document.getElementById('explorerFilterInput');
    const explorerOptionsButton = document.getElementById('explorerOptionsButton');
    const explorerOptionsPanel = document.getElementById('explorerOptionsPanel');
    const explorerShowHiddenInput = document.getElementById('explorerShowHiddenInput');
    const explorerSortSelect = document.getElementById('explorerSortSelect');
    const explorerSettings = document.getElementById('explorerSettings');
    const featureList = document.getElementById('featureList');
    const colorPalette = document.getElementById('colorPalette');
    const fileRules = document.getElementById('fileRules');
    const featureCount = document.getElementById('featureCount');
    const fileRuleCount = document.getElementById('fileRuleCount');
    const tabButtons = Array.from(document.querySelectorAll('[data-action="tab"]'));
    const settingsSectionButtons = Array.from(document.querySelectorAll('[data-action="settings-section"]'));
    const settingsPanes = Array.from(document.querySelectorAll('[data-settings-pane]'));
    let selectedExplorerUris = [];
    let focusedExplorerUri = undefined;
    let anchorExplorerUri = undefined;
    let inlineEdit = undefined;
    let dropTargetUri = undefined;
    let ignoredToggleClickUri = undefined;
    let activeFolderIconUri = undefined;
    let explorerFilterText = '';
    let activeSettingsSection = 'features';
    let settingsSortMenuOpen = false;
    let activeFileRuleIconExtension = undefined;
    let activeFileRuleColorExtension = undefined;
    let pendingExplorerStatus = undefined;
    let lastExplorerStatus = '';
    const optimisticExpandedByUri = new Map();
    const treeModelByUri = new Map();
    const treeChildrenByUri = new Map();
    let treeRootUris = [];
    let visibleRows = [];

    document.addEventListener('change', (event) => {
      const selectTarget = event.target instanceof HTMLSelectElement ? event.target : undefined;
      const checkboxTarget = event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
        ? event.target
        : undefined;

      if (selectTarget?.dataset.action === 'select-target') {
        vscode.postMessage({
          type: 'setAssistantTarget',
          target: selectTarget.value
        });
        return;
      }

      if (selectTarget?.dataset.action === 'select-explorer-sort') {
        setLocalExplorerOptions({ sortMode: selectTarget.value });
        vscode.postMessage({
          type: 'setExplorerSortMode',
          sortMode: selectTarget.value
        });
        return;
      }

      if (checkboxTarget?.dataset.action === 'toggle-explorer-show-hidden') {
        setLocalExplorerOptions({ showHiddenFolders: checkboxTarget.checked });
        vscode.postMessage({
          type: 'setExplorerShowHiddenFolders',
          showHiddenFolders: checkboxTarget.checked
        });
        return;
      }

      if (checkboxTarget?.dataset.action === 'toggle-file-rule-hidden') {
        vscode.postMessage({
          type: 'setFileExtensionHidden',
          extension: checkboxTarget.dataset.extension,
          hidden: checkboxTarget.checked
        });
      }
    });

    explorerFilterInput.addEventListener('input', () => {
      explorerFilterText = explorerFilterInput.value;
      renderExplorer();
    });

    document.addEventListener('pointerdown', (event) => {
      if (!isExplorerOptionsEventTarget(event.target)) {
        hideExplorerOptions();
      }

      if (!isExplorerContextMenuEventTarget(event.target)) {
        hideContextMenu();
      }

      if (!isFolderIconPickerEventTarget(event.target)) {
        hideFolderIconPicker();
      }

      if (!isSettingsSortMenuEventTarget(event.target)) {
        hideSettingsSortMenu();
      }

      if (!isFileRuleColorMenuEventTarget(event.target)) {
        hideFileRuleColorMenu();
      }

      if (!isFileRuleIconMenuEventTarget(event.target)) {
        hideFileRuleIconMenu();
      }
    });

    document.addEventListener('focusin', (event) => {
      if (!isExplorerOptionsEventTarget(event.target)) {
        hideExplorerOptions();
      }

      if (!isExplorerContextMenuEventTarget(event.target)) {
        hideContextMenu();
      }

      if (!isFolderIconPickerEventTarget(event.target)) {
        hideFolderIconPicker();
      }

      if (!isSettingsSortMenuEventTarget(event.target)) {
        hideSettingsSortMenu();
      }

      if (!isFileRuleColorMenuEventTarget(event.target)) {
        hideFileRuleColorMenu();
      }

      if (!isFileRuleIconMenuEventTarget(event.target)) {
        hideFileRuleIconMenu();
      }
    });

    window.addEventListener('blur', () => {
      hideExplorerTransientPanels();
    });

    window.addEventListener('resize', () => {
      if (!explorerOptionsPanel.hidden) {
        positionExplorerOptionsPanel();
      }

      if (!folderIconPicker.hidden) {
        positionFolderIconPicker();
      }
    });

    explorerTree.addEventListener('pointerdown', (event) => {
      const source = event.target instanceof Element ? event.target : undefined;

      if (
        !source ||
        event.button !== 0 ||
        inlineEdit
      ) {
        return;
      }

      const toggleControl = source.closest('[data-action="toggle-node"]');

      if (toggleControl) {
        const uri = toggleControl.dataset.uri;

        if (uri) {
          event.preventDefault();
          event.stopPropagation();
          ignoredToggleClickUri = uri;
          toggleExplorerFolder(uri, toggleControl.dataset.expanded !== 'true');
        }

        return;
      }

      if (source.closest('[data-row-control="true"]')) {
        return;
      }

      const row = source.closest('.treeRow[data-uri]');

      if (!(row instanceof HTMLElement)) {
        return;
      }

      const uri = row.dataset.uri;

      if (!uri) {
        return;
      }

      row.focus({ preventScroll: true });
      updateExplorerSelection(uri, event, false);

      if (
        row.dataset.nodeType === 'folder' &&
        getExplorerExpandMode() === 'singleClick' &&
        !event.shiftKey &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        ignoredToggleClickUri = uri;
        toggleExplorerFolderFromRow(row);
      }
    });

    document.addEventListener('click', (event) => {
      const source = event.target instanceof Element ? event.target : event.target?.parentElement;
      const target = source?.closest('[data-action]');

      if (!target) {
        handleExplorerRowClick(source, event);
        return;
      }

      const action = target.dataset.action;

      if (source?.closest('[data-row-control="true"]')) {
        event.stopPropagation();
      }

      if (action === 'tab') {
        vscode.postMessage({
          type: 'setActiveTab',
          tab: target.dataset.tab
        });
        return;
      }

      if (action === 'settings-section') {
        activeSettingsSection = getSettingsSection(target.dataset.settingsSection);
        settingsSortMenuOpen = false;
        activeFileRuleIconExtension = undefined;
        activeFileRuleColorExtension = undefined;
        renderSettings();
        return;
      }

      if (action === 'toggle-settings-sort-menu') {
        settingsSortMenuOpen = !settingsSortMenuOpen;
        renderSettings();
        return;
      }

      if (action === 'select-settings-sort') {
        const sortMode = target.dataset.sortMode;

        if (!getExplorerSortOptions().some(([value]) => value === sortMode)) {
          return;
        }

        settingsSortMenuOpen = false;
        setLocalExplorerOptions({ sortMode });
        vscode.postMessage({
          type: 'setExplorerSortMode',
          sortMode
        });
        return;
      }

      if (action === 'toggle-explorer-options') {
        toggleExplorerOptions();
        return;
      }

      if (action === 'toggle-node') {
        const uri = target.dataset.uri;

        if (!uri) {
          return;
        }

        if (ignoredToggleClickUri === uri) {
          ignoredToggleClickUri = undefined;
          return;
        }

        toggleExplorerFolder(uri, target.dataset.expanded !== 'true');
        return;
      }

      if (action === 'open-context-menu') {
        const uri = target.dataset.uri;

        if (uri) {
          const rect = target.getBoundingClientRect();

          if (!selectedExplorerUris.includes(uri)) {
            setExplorerSelection([uri], false);
          }

          showContextMenuForUri(uri, rect.left, rect.bottom);
        }

        return;
      }

      if (action === 'toggle-folder-hidden') {
        const uri = target.dataset.uri;

        if (uri) {
          vscode.postMessage({
            type: 'toggleExplorerFolderHidden',
            uri,
            hidden: target.dataset.hidden !== 'true'
          });
        }

        return;
      }

      if (action === 'open-folder-icon-picker') {
        const uri = target.dataset.uri;

        if (uri) {
          showFolderIconPicker(uri);
        }

        return;
      }

      if (action === 'set-folder-icon') {
        const uri = activeFolderIconUri;
        const icon = target.dataset.icon;
        const color = target.dataset.color;

        if (uri && icon && color) {
          setLocalFolderIcon(uri, icon, color);
          renderVisibleRowsDiff();
          showFolderIconPicker(uri);
          vscode.postMessage({
            type: 'setFolderIcon',
            uri,
            icon,
            color
          });
        }

        return;
      }

      if (action === 'toggle-file-rule-icon-menu') {
        const extension = target.dataset.extension;

        activeFileRuleIconExtension = activeFileRuleIconExtension === extension ? undefined : extension;
        activeFileRuleColorExtension = undefined;
        renderSettings();
        return;
      }

      if (action === 'select-file-rule-icon') {
        const extension = target.dataset.extension;
        const icon = target.dataset.icon;
        const color = target.dataset.color;

        activeFileRuleIconExtension = undefined;

        if (extension && icon && color) {
          vscode.postMessage({
            type: 'setFileExtensionIcon',
            extension,
            icon,
            color
          });
        }

        renderSettings();
        return;
      }

      if (action === 'toggle-file-rule-color-menu') {
        const extension = target.dataset.extension;

        activeFileRuleColorExtension = activeFileRuleColorExtension === extension ? undefined : extension;
        activeFileRuleIconExtension = undefined;
        renderSettings();
        return;
      }

      if (action === 'select-file-rule-color') {
        const extension = target.dataset.extension;
        const icon = target.dataset.icon;
        const color = target.dataset.color;

        activeFileRuleColorExtension = undefined;

        if (extension && icon && color) {
          vscode.postMessage({
            type: 'setFileExtensionIcon',
            extension,
            icon,
            color
          });
        }

        renderSettings();
        return;
      }

      if (action === 'context-command') {
        runContextCommand(target.dataset.command);
        return;
      }

      if (action === 'copy-explorer-reference') {
        const uri = target.dataset.uri;

        if (uri) {
          vscode.postMessage({
            type: 'copyExplorerReference',
            uri
          });
        }

        return;
      }

      if (action === 'paste-explorer-context') {
        const uri = target.dataset.uri;

        if (uri) {
          vscode.postMessage({
            type: 'pasteExplorerContext',
            uri
          });
        }

        return;
      }

      if (action === 'toggle-feature') {
        const feature = state.settings.features.find((item) => item.id === target.dataset.featureId);

        if (feature) {
          vscode.postMessage({
            type: 'toggleFeature',
            featureId: feature.id,
            enabled: !feature.enabled
          });
        }
      }

      if (action === 'shortcut') {
        vscode.postMessage({
          type: 'openShortcutEditor',
          command: target.dataset.command
        });
      }

      if (action === 'copy-command') {
        vscode.postMessage({
          type: 'copyCommandId',
          command: target.dataset.command
        });
      }

      if (action === 'add-file-extension-rule') {
        const input = document.getElementById('newFileExtensionInput');
        const extension = input instanceof HTMLInputElement ? input.value.trim() : '';

        if (extension) {
          vscode.postMessage({
            type: 'setFileExtensionIcon',
            extension,
            icon: 'file',
            color: 'muted'
          });

          if (input instanceof HTMLInputElement) {
            input.value = '';
          }
        }
      }

      if (action === 'remove-file-extension-rule') {
        vscode.postMessage({
          type: 'removeFileExtensionRule',
          extension: target.dataset.extension
        });
      }

      if (action === 'add-explorer-color') {
        const input = document.getElementById('newExplorerColorInput');
        const color = input instanceof HTMLInputElement ? input.value.trim() : '';
        const normalizedColor = normalizeHexColorInput(color);

        if (!normalizedColor) {
          vscode.postMessage({
            type: 'showStatusMessage',
            message: 'NAssistant: Enter a HEX color like #7E5BEF.',
            timeout: 2500
          });
          return;
        }

        vscode.postMessage({
          type: 'addExplorerColor',
          color: normalizedColor
        });

        if (input instanceof HTMLInputElement) {
          input.value = '';
        }
      }

      if (action === 'remove-explorer-color') {
        vscode.postMessage({
          type: 'removeExplorerColor',
          color: target.dataset.color
        });
      }
    });

    explorerTree.addEventListener('dblclick', (event) => {
      const source = event.target instanceof Element ? event.target : undefined;

      if (!source || source.closest('[data-row-control="true"]') || inlineEdit) {
        return;
      }

      const row = source.closest('.treeRow[data-uri]');
      const uri = row?.dataset.uri;

      if (!uri) {
        return;
      }

      const node = findVisibleNode(uri);

      if (node?.type === 'folder') {
        if (getExplorerExpandMode() === 'doubleClick') {
          event.preventDefault();
          toggleExplorerFolder(node.uri, !getEffectiveExpanded(node));
        }

        return;
      }

      event.preventDefault();
      openOrToggleExplorerNode(node);
    });

    document.addEventListener('contextmenu', (event) => {
      const source = event.target instanceof Element ? event.target : undefined;

      if (source?.closest('[data-inline-name="true"]')) {
        return;
      }

      const row = source?.closest('.treeRow');

      if (!row) {
        return;
      }

      const uri = row.dataset.uri;

      if (!uri) {
        return;
      }

      event.preventDefault();

      if (!selectedExplorerUris.includes(uri)) {
        setExplorerSelection([uri], false);
      }

      if (row instanceof HTMLElement) {
        row.focus({ preventScroll: true });
      }

      showContextMenuForUri(uri, event.clientX, event.clientY);
    });

    explorerTree.addEventListener('dragstart', (event) => {
      const source = event.target instanceof Element ? event.target : undefined;
      const row = source?.closest('.treeRow');

      if (
        !row ||
        inlineEdit ||
        source?.closest('[data-row-control="true"]') ||
        row.dataset.canDrag !== 'true' ||
        !event.dataTransfer
      ) {
        event.preventDefault();
        return;
      }

      const uri = row.dataset.uri;

      if (!uri) {
        event.preventDefault();
        return;
      }

      if (!selectedExplorerUris.includes(uri)) {
        setExplorerSelection([uri], false);
      }

      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('application/x-nassistant-uris', JSON.stringify(getSelectedExplorerUris()));
      event.dataTransfer.setData('text/plain', getSelectedExplorerUris().join('\\n'));
    });

    explorerTree.addEventListener('dragover', (event) => {
      const row = event.target instanceof Element ? event.target.closest('.treeRow') : undefined;
      const targetUri = row?.dataset.canDrop === 'true' ? row.dataset.uri : undefined;

      if (!targetUri || !event.dataTransfer) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = Array.from(event.dataTransfer.types || []).includes('application/x-nassistant-uris') ? 'move' : 'copy';

      if (dropTargetUri !== targetUri) {
        dropTargetUri = targetUri;
        renderVisibleRowsDiff();
      }
    });

    explorerTree.addEventListener('dragleave', (event) => {
      if (event.relatedTarget instanceof Node && explorerTree.contains(event.relatedTarget)) {
        return;
      }

      if (dropTargetUri) {
        dropTargetUri = undefined;
        renderVisibleRowsDiff();
      }
    });

    explorerTree.addEventListener('drop', (event) => {
      const row = event.target instanceof Element ? event.target.closest('.treeRow') : undefined;
      const targetUri = row?.dataset.canDrop === 'true' ? row.dataset.uri : undefined;

      if (!targetUri || !event.dataTransfer) {
        return;
      }

      event.preventDefault();
      dropTargetUri = undefined;
      void handleExplorerDrop(event.dataTransfer, targetUri);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && hideExplorerTransientPanels()) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const inlineTarget = event.target instanceof HTMLInputElement && event.target.dataset.inlineName === 'true'
        ? event.target
        : undefined;

      if (inlineTarget) {
        handleInlineNameKeydown(event, inlineTarget);
        return;
      }

      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (inlineEdit) {
        return;
      }

      if (state.activeTab !== 'explorer' || getSelectedExplorerUris().length === 0) {
        return;
      }

      if (event.key === 'F2') {
        event.preventDefault();
        startInlineRename(getSelectedExplorerUris()[0]);
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        postDeleteSelected();
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        openOrToggleExplorerNode(getFocusedExplorerNode());
        return;
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        moveExplorerSelection(event.key === 'ArrowDown' ? 1 : -1, event.shiftKey);
        return;
      }

      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        expandOrCollapseExplorerNode(
          getFocusedExplorerNode(),
          event.key === 'ArrowRight'
        );
        return;
      }

      if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
        event.preventDefault();
        showContextMenuForFocusedNode();
        return;
      }

      if (!(event.metaKey || event.ctrlKey) || !event.shiftKey || event.altKey) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'c') {
        event.preventDefault();
        event.stopPropagation();
        vscode.postMessage({
          type: 'copyExplorerReferences',
          uris: getSelectedExplorerUris()
        });
        return;
      }

      if (key === 'v') {
        event.preventDefault();
        event.stopPropagation();
        vscode.postMessage({
          type: 'pasteExplorerContexts',
          uris: getSelectedExplorerUris()
        });
      }
    });

    window.addEventListener('message', (event) => {
      if (event.data?.type === 'state') {
        state = event.data.state;
        reconcileOptimisticExpansions();
        render();
      }
    });

    function render() {
      const activeTab = state.activeTab || 'explorer';

      explorerPanel.hidden = activeTab !== 'explorer';
      settingsPanel.hidden = activeTab !== 'settings';

      tabButtons.forEach((button) => {
        const isActive = button.dataset.tab === activeTab;

        button.classList.toggle('isActive', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      renderExplorer();
      renderSettings();
    }

    function syncExplorerControls(explorer) {
      const options = explorer.options || getFallbackExplorerOptions();

      if (explorerFilterInput.value !== explorerFilterText) {
        explorerFilterInput.value = explorerFilterText;
      }

      explorerShowHiddenInput.checked = Boolean(options.showHiddenFolders);
      explorerSortSelect.value = getExplorerSortMode();
    }

    function setLocalExplorerOptions(nextOptions) {
      const explorer = state.explorer || {};

      state = {
        ...state,
        explorer: {
          ...explorer,
          options: {
            ...getFallbackExplorerOptions(),
            ...(explorer.options || {}),
            ...nextOptions
          }
        }
      };

      renderExplorer();
      renderSettings();
    }

    function toggleExplorerOptions() {
      const shouldOpen = explorerOptionsPanel.hidden;

      hideContextMenu();

      if (!shouldOpen) {
        hideExplorerOptions();
        return;
      }

      explorerOptionsPanel.hidden = false;
      explorerOptionsButton.classList.add('isActive');
      explorerOptionsButton.setAttribute('aria-expanded', 'true');
      positionExplorerOptionsPanel();
    }

    function hideExplorerOptions() {
      const wasOpen = !explorerOptionsPanel.hidden;

      explorerOptionsPanel.hidden = true;
      explorerOptionsButton.classList.remove('isActive');
      explorerOptionsButton.setAttribute('aria-expanded', 'false');

      return wasOpen;
    }

    function positionExplorerOptionsPanel() {
      const buttonRect = explorerOptionsButton.getBoundingClientRect();

      explorerOptionsPanel.style.left = '0px';
      explorerOptionsPanel.style.top = '0px';

      const panelWidth = explorerOptionsPanel.offsetWidth;
      const panelHeight = explorerOptionsPanel.offsetHeight;
      const left = Math.max(4, Math.min(
        buttonRect.right - panelWidth,
        window.innerWidth - panelWidth - 4
      ));
      const top = Math.max(4, Math.min(
        buttonRect.bottom + 4,
        window.innerHeight - panelHeight - 4
      ));

      explorerOptionsPanel.style.left = left + 'px';
      explorerOptionsPanel.style.top = top + 'px';
    }

    function isExplorerOptionsEventTarget(target) {
      const source = target instanceof Element ? target : target?.parentElement;

      return Boolean(source?.closest('#explorerOptionsPanel') || source?.closest('#explorerOptionsButton'));
    }

    function isExplorerContextMenuEventTarget(target) {
      const source = target instanceof Element ? target : target?.parentElement;

      return Boolean(source?.closest('#explorerContextMenu'));
    }

    function isFolderIconPickerEventTarget(target) {
      const source = target instanceof Element ? target : target?.parentElement;

      return Boolean(source?.closest('#folderIconPicker') || source?.closest('[data-action="open-folder-icon-picker"]'));
    }

    function isSettingsSortMenuEventTarget(target) {
      const source = target instanceof Element ? target : target?.parentElement;

      return Boolean(source?.closest('[data-settings-sort-menu="true"]'));
    }

    function isFileRuleColorMenuEventTarget(target) {
      const source = target instanceof Element ? target : target?.parentElement;

      return Boolean(source?.closest('[data-file-rule-color-menu="true"]'));
    }

    function isFileRuleIconMenuEventTarget(target) {
      const source = target instanceof Element ? target : target?.parentElement;

      return Boolean(source?.closest('[data-file-rule-icon-menu="true"]'));
    }

    function hideExplorerTransientPanels() {
      const hidOptions = hideExplorerOptions();
      const hidContextMenu = hideContextMenu();
      const hidFolderIconPicker = hideFolderIconPicker();
      const hidSettingsSortMenu = hideSettingsSortMenu();
      const hidFileRuleColorMenu = hideFileRuleColorMenu();
      const hidFileRuleIconMenu = hideFileRuleIconMenu();

      return hidOptions || hidContextMenu || hidFolderIconPicker || hidSettingsSortMenu || hidFileRuleColorMenu || hidFileRuleIconMenu;
    }

    function hideSettingsSortMenu() {
      if (!settingsSortMenuOpen) {
        return false;
      }

      settingsSortMenuOpen = false;
      renderSettings();

      return true;
    }

    function hideFileRuleIconMenu() {
      if (!activeFileRuleIconExtension) {
        return false;
      }

      activeFileRuleIconExtension = undefined;
      renderSettings();

      return true;
    }

    function hideFileRuleColorMenu() {
      if (!activeFileRuleColorExtension) {
        return false;
      }

      activeFileRuleColorExtension = undefined;
      renderSettings();

      return true;
    }

    function renderExplorer() {
      const explorer = state.explorer || {
        roots: [],
        children: {},
        workspaceFolderCount: 0,
        hiddenFolderCount: 0,
        expandMode: 'singleClick',
        options: getFallbackExplorerOptions()
      };

      pendingExplorerStatus = undefined;
      syncExplorerControls(explorer);

      if (!explorer.workspaceFolderCount) {
        selectedExplorerUris = [];
        focusedExplorerUri = undefined;
        anchorExplorerUri = undefined;
        inlineEdit = undefined;
        treeModelByUri.clear();
        treeChildrenByUri.clear();
        treeRootUris = [];
        visibleRows = [];
        explorerTree.innerHTML = '';
        postExplorerStatus('NAssistant: Open a workspace folder to use Explorer.');
        return;
      }

      syncTreeModelFromExplorer(explorer);
      renderVisibleRowsDiff();
      pruneExplorerSelection();
      syncExplorerSelectionDom();
      focusInlineInput();
      flushExplorerStatus();
    }

    function queueExplorerStatus(message) {
      pendingExplorerStatus = pendingExplorerStatus || message;
    }

    function flushExplorerStatus() {
      if (pendingExplorerStatus) {
        postExplorerStatus(pendingExplorerStatus);
      }
    }

    function postExplorerStatus(message) {
      if (!message || lastExplorerStatus === message) {
        return;
      }

      lastExplorerStatus = message;
      vscode.postMessage({
        type: 'showStatusMessage',
        message,
        timeout: 1800
      });
    }

    function syncTreeModelFromExplorer(explorer) {
      treeModelByUri.clear();
      treeChildrenByUri.clear();
      treeRootUris = (explorer.roots || []).map((node) => node.uri);

      for (const root of explorer.roots || []) {
        syncTreeNode(root);
      }

      for (const [parentUri, children] of Object.entries(explorer.children || {})) {
        treeChildrenByUri.set(parentUri, (children || []).map((node) => node.uri));

        for (const child of children || []) {
          syncTreeNode(child);
        }
      }
    }

    function syncTreeNode(node) {
      const isExpanded = optimisticExpandedByUri.has(node.uri)
        ? optimisticExpandedByUri.get(node.uri) === true
        : Boolean(node.isExpanded);

      treeModelByUri.set(node.uri, {
        ...node,
        isExpanded
      });
    }

    function buildVisibleRows() {
      const rows = [];

      for (const uri of getSortedExplorerUris(treeRootUris)) {
        appendVisibleNodeRows(uri, 0, rows);
      }

      if (rows.length === 0) {
        queueExplorerStatus(getExplorerFilterText()
          ? 'NAssistant: No Explorer search results.'
          : 'NAssistant: Explorer has no visible items.');
      }

      return rows;
    }

    function appendVisibleNodeRows(uri, depth, rows) {
      const node = treeModelByUri.get(uri);

      if (!node || !shouldShowExplorerNode(uri)) {
        return;
      }

      rows.push({
        key: 'node:' + uri,
        kind: 'node',
        uri,
        depth,
        node
      });

      if (node.type !== 'folder' || !getEffectiveExpanded(node)) {
        return;
      }

      if (inlineEdit?.mode === 'create' && inlineEdit.parentUri === uri) {
        rows.push({
          key: 'inline-create:' + uri,
          kind: 'inline-create',
          parentUri: uri,
          depth: depth + 1
        });
      }

      if (!treeChildrenByUri.has(uri)) {
        queueExplorerStatus('NAssistant: Loading Explorer items...');
        return;
      }

      const childUris = getVisibleExplorerChildUris(uri);

      if (childUris.length === 0) {
        queueExplorerStatus('NAssistant: Folder has no visible items.');
        return;
      }

      for (const childUri of childUris) {
        appendVisibleNodeRows(childUri, depth + 1, rows);
      }
    }

    function getVisibleExplorerChildUris(parentUri) {
      return getSortedExplorerUris(treeChildrenByUri.get(parentUri) || [])
        .filter((uri) => shouldShowExplorerNode(uri));
    }

    function shouldShowExplorerNode(uri) {
      const node = treeModelByUri.get(uri);

      if (!node) {
        return false;
      }

      if (!getExplorerShowHiddenFolders() && node.isHiddenByNAssistant) {
        return false;
      }

      if (!getExplorerFilterText()) {
        return true;
      }

      if (matchesExplorerFilter(node)) {
        return true;
      }

      return (treeChildrenByUri.get(uri) || []).some((childUri) => shouldShowExplorerNode(childUri));
    }

    function matchesExplorerFilter(node) {
      const filterText = getExplorerFilterText();

      return normalizeFilterText(node.name).includes(filterText) ||
        normalizeFilterText(node.relativePath || '').includes(filterText);
    }

    function getSortedExplorerUris(uris) {
      return [...uris].sort((leftUri, rightUri) => {
        const left = treeModelByUri.get(leftUri);
        const right = treeModelByUri.get(rightUri);

        if (!left || !right) {
          return leftUri.localeCompare(rightUri);
        }

        return compareExplorerNodes(left, right);
      });
    }

    function compareExplorerNodes(left, right) {
      const sortMode = getExplorerSortMode();

      if (sortMode === 'default') {
        return compareExplorerTypes(left, right) || compareExplorerNames(left, right, 'asc');
      }

      if (sortMode === 'nameDesc') {
        return compareExplorerNames(left, right, 'desc');
      }

      if (sortMode === 'type') {
        return compareExplorerTypes(left, right) ||
          compareExplorerExtensions(left, right) ||
          compareExplorerNames(left, right, 'asc');
      }

      return compareExplorerNames(left, right, 'asc');
    }

    function compareExplorerTypes(left, right) {
      if (left.type === right.type) {
        return 0;
      }

      return left.type === 'folder' ? -1 : 1;
    }

    function compareExplorerNames(left, right, direction) {
      const result = left.name.localeCompare(right.name, undefined, {
        numeric: true,
        sensitivity: 'base'
      });

      return direction === 'desc' ? -result : result;
    }

    function compareExplorerExtensions(left, right) {
      return getExplorerExtension(left).localeCompare(getExplorerExtension(right), undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    }

    function getExplorerExtension(node) {
      if (node.type === 'folder') {
        return '';
      }

      const dotIndex = node.name.lastIndexOf('.');

      return dotIndex > 0 ? node.name.slice(dotIndex + 1) : '';
    }

    function getExplorerShowHiddenFolders() {
      return state.explorer?.options?.showHiddenFolders !== false;
    }

    function getExplorerSortMode() {
      const sortMode = state.explorer?.options?.sortMode;

      return ['default', 'nameAsc', 'nameDesc', 'type'].includes(sortMode) ? sortMode : 'default';
    }

    function getExplorerFilterText() {
      return normalizeFilterText(explorerFilterText);
    }

    function normalizeFilterText(value) {
      return String(value || '').trim().toLowerCase();
    }

    function normalizeHexColorInput(value) {
      const color = String(value || '').trim();

      if (/^#[0-9a-f]{3}$/i.test(color)) {
        return '#' + color.slice(1).split('').map((part) => part + part).join('').toUpperCase();
      }

      return /^#[0-9a-f]{6}$/i.test(color) ? color.toUpperCase() : undefined;
    }

    function getIconColorClass(color) {
      const preset = getColorPresets().find((item) => item.id === color);

      return preset?.className || 'iconColorMuted';
    }

    function getColorLabel(color) {
      const preset = getColorPresets().find((item) => item.id === color);

      return preset?.label || 'Muted';
    }

    function getIconPresets() {
      return state.explorer?.appearance?.iconPresets || [];
    }

    function getFileIconPresetIds() {
      return [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'md',
        'cs',
        'css',
        'html',
        'yaml',
        'xml',
        'py',
        'shell',
        'text',
        'image',
        'archive',
        'database',
        'lock',
        'file'
      ];
    }

    function getFolderIconPresets() {
      const fileIconIds = new Set(getFileIconPresetIds());

      return getIconPresets()
        .filter((preset) => !fileIconIds.has(preset.id));
    }

    function getFileIconPresets() {
      const fileIconIds = new Set(getFileIconPresetIds());

      return getIconPresets()
        .filter((preset) => fileIconIds.has(preset.id));
    }

    function getColorPresets() {
      return state.explorer?.appearance?.colorPresets || [];
    }

    function showFolderIconPicker(uri) {
      const node = findVisibleNode(uri);

      if (!node?.canCustomizeIcon) {
        hideFolderIconPicker();
        return;
      }

      activeFolderIconUri = uri;
      hideContextMenu();
      hideExplorerOptions();
      folderIconPicker.innerHTML = renderFolderIconPicker(node);
      folderIconPicker.hidden = false;
      positionFolderIconPicker();
    }

    function renderFolderIconPicker(node) {
      const currentIcon = node.icon?.icon || 'folder';
      const currentColor = node.icon?.color || 'blue';
      const iconButtons = getFolderIconPresets()
        .map((preset) => renderIconChoice(preset, currentIcon, currentColor))
        .join('');
      const colorButtons = getColorPresets()
        .map((preset) => renderColorChoice(preset, currentIcon, currentColor))
        .join('');

      return '<div class="pickerLabel">Icon</div>' +
        '<div class="iconGrid">' + iconButtons + '</div>' +
        '<div class="pickerLabel">Color</div>' +
        '<div class="colorGrid">' + colorButtons + '</div>';
    }

    function renderIconChoice(preset, currentIcon, currentColor) {
      const selectedCss = preset.id === currentIcon ? ' isSelected' : '';

      return '<button class="iconChoice ' + escapeHtml(getIconColorClass(currentColor)) + selectedCss + '" type="button" data-action="set-folder-icon" data-icon="' + escapeHtml(preset.id) + '" data-color="' + escapeHtml(currentColor) + '" title="' + escapeHtml(preset.label) + '">' +
        escapeHtml(preset.text) +
      '</button>';
    }

    function renderColorChoice(preset, currentIcon, currentColor) {
      const selectedCss = preset.id === currentColor ? ' isSelected' : '';

      return '<button class="colorChoice ' + escapeHtml(getIconColorClass(preset.id)) + selectedCss + '" type="button" data-action="set-folder-icon" data-icon="' + escapeHtml(currentIcon) + '" data-color="' + escapeHtml(preset.id) + '" title="' + escapeHtml(preset.label) + '"></button>';
    }

    function positionFolderIconPicker() {
      if (!activeFolderIconUri) {
        return;
      }

      const iconButton = Array.from(explorerTree.querySelectorAll('[data-action="open-folder-icon-picker"]'))
        .find((element) => element.dataset.uri === activeFolderIconUri);

      if (!(iconButton instanceof HTMLElement)) {
        hideFolderIconPicker();
        return;
      }

      const buttonRect = iconButton.getBoundingClientRect();

      folderIconPicker.style.left = '0px';
      folderIconPicker.style.top = '0px';

      const panelWidth = folderIconPicker.offsetWidth;
      const panelHeight = folderIconPicker.offsetHeight;
      const left = Math.max(4, Math.min(
        buttonRect.left,
        window.innerWidth - panelWidth - 4
      ));
      const top = Math.max(4, Math.min(
        buttonRect.bottom + 4,
        window.innerHeight - panelHeight - 4
      ));

      folderIconPicker.style.left = left + 'px';
      folderIconPicker.style.top = top + 'px';
    }

    function hideFolderIconPicker() {
      const wasOpen = !folderIconPicker.hidden;

      folderIconPicker.hidden = true;
      folderIconPicker.innerHTML = '';
      activeFolderIconUri = undefined;

      return wasOpen;
    }

    function setLocalFolderIcon(uri, icon, color) {
      const node = findNodeByUri(uri);
      const iconPreset = getIconPresets().find((preset) => preset.id === icon);

      if (!node || !iconPreset) {
        return;
      }

      node.icon = {
        icon,
        color,
        text: iconPreset.text,
        label: iconPreset.label
      };
    }

    function renderVisibleRowsDiff() {
      const nextRows = buildVisibleRows();
      const nextKeys = new Set(nextRows.map((row) => row.key));

      Array.from(explorerTree.children).forEach((element) => {
        if (element instanceof HTMLElement && !nextKeys.has(element.dataset.rowKey || '')) {
          element.remove();
        }
      });

      for (let index = 0; index < nextRows.length; index++) {
        const row = nextRows[index];
        const current = explorerTree.children[index];
        let element = current instanceof HTMLElement ? current : undefined;

        if (element?.dataset.rowKey !== row.key) {
          const reusable = findRenderedRowByKey(row.key);

          if (reusable) {
            explorerTree.insertBefore(reusable, element ?? null);
            element = reusable;
          } else {
            element = createExplorerRowElement(row);
            explorerTree.insertBefore(element, current ?? null);
          }
        }

        const signature = getVisibleRowSignature(row);

        if (element.dataset.renderSignature !== signature) {
          const replacement = createExplorerRowElement(row);

          explorerTree.replaceChild(replacement, element);
        }
      }

      while (explorerTree.children.length > nextRows.length) {
        explorerTree.lastElementChild?.remove();
      }

      visibleRows = nextRows;
      syncExplorerSelectionDom();
    }

    function findRenderedRowByKey(key) {
      return Array.from(explorerTree.children)
        .find((element) => element instanceof HTMLElement && element.dataset.rowKey === key);
    }

    function createExplorerRowElement(row) {
      const template = document.createElement('template');
      const signature = getVisibleRowSignature(row);

      template.innerHTML = renderVisibleRow(row);

      const element = template.content.firstElementChild;

      if (element instanceof HTMLElement) {
        element.dataset.renderSignature = signature;
        return element;
      }

      const fallback = document.createElement('div');

      fallback.dataset.rowKey = row.key;
      fallback.dataset.renderSignature = signature;

      return fallback;
    }

    function renderVisibleRow(row) {
      if (row.kind === 'inline-create') {
        return renderInlineCreateInput(row.depth);
      }

      if (row.kind === 'node') {
        return renderExplorerNode(row.node, row.depth);
      }

      return '';
    }

    function getVisibleRowSignature(row) {
      if (row.kind !== 'node') {
        return row.kind + ':' + row.depth + ':' + row.key + ':' + (row.message || '') + ':' + (inlineEdit?.kind || '');
      }

      const node = row.node;

      return [
        row.kind,
        row.depth,
        node.uri,
        node.name,
        node.type,
        node.icon?.icon || '',
        node.icon?.color || '',
        node.icon?.text || '',
        String(getEffectiveExpanded(node)),
        String(node.isHiddenByNAssistant),
        String(node.canHide),
        String(node.canCreateChild),
        String(node.canRename),
        String(node.canDelete),
        String(node.canDrag),
        String(node.canDrop),
        node.gitBadge || '',
        node.gitTooltip || '',
        node.gitStatus?.kind || '',
        String(dropTargetUri === node.uri),
        inlineEdit?.mode || '',
        inlineEdit?.uri || '',
        inlineEdit?.parentUri || '',
        inlineEdit?.kind || ''
      ].join('|');
    }

    function renderExplorerNodes(nodes, depth) {
      if (!nodes || nodes.length === 0) {
        postExplorerStatus(depth === 0
          ? 'NAssistant: Explorer has no visible items.'
          : 'NAssistant: Folder has no visible items.');
        return '';
      }

      return nodes.map((node) => renderExplorerNode(node, depth)).join('');
    }

    function renderExplorerNode(node, depth) {
      const safeDepth = Math.min(depth, 12);
      const isRenaming = inlineEdit?.mode === 'rename' && inlineEdit.uri === node.uri;
      const isExpanded = getEffectiveExpanded(node);
      const rowCss = node.isHiddenByNAssistant
        ? 'treeRow isHidden depth' + safeDepth
        : 'treeRow depth' + safeDepth;
      const selectedCss = selectedExplorerUris.includes(node.uri) ? ' isSelected' : '';
      const dropCss = node.uri === dropTargetUri ? ' isDropTarget' : '';
      const editCss = isRenaming ? ' isEditing' : '';
      const disclosure = node.type === 'folder'
        ? isExpanded ? 'v' : '>'
        : '';
      const actions = isRenaming ? '' : renderNodeActions(node);
      const gitBadge = renderGitBadge(node);
      const label = isRenaming
        ? renderInlineNameInput(node.name)
        : '<span class="nodeLabel">' + escapeHtml(node.name) + '</span>' + gitBadge;
      const mainCss = isRenaming ? 'nodeMain renameMain' : 'nodeMain';
      const main = '<div class="' + mainCss + '" title="' + escapeHtml((node.relativePath || node.name) + (node.gitTooltip && !isRenaming ? ' - ' + node.gitTooltip : '')) + '">' +
          renderDisclosureControl(node, disclosure) +
          renderNodeIcon(node, isRenaming) +
          label +
        '</div>';

      return '<div class="' + rowCss + selectedCss + dropCss + editCss + '" role="treeitem" tabindex="-1" draggable="' + String(Boolean(node.canDrag && !isRenaming)) + '" data-row-key="node:' + escapeHtml(node.uri) + '" data-uri="' + escapeHtml(node.uri) + '" data-node-type="' + escapeHtml(node.type) + '" data-depth="' + String(depth) + '" data-can-drag="' + String(Boolean(node.canDrag && !isRenaming)) + '" data-can-drop="' + String(Boolean(node.canDrop)) + '" data-can-create-child="' + String(Boolean(node.canCreateChild)) + '" data-can-rename="' + String(Boolean(node.canRename)) + '" data-can-delete="' + String(Boolean(node.canDelete)) + '" data-can-hide="' + String(Boolean(node.canHide)) + '" data-hidden="' + String(Boolean(node.isHiddenByNAssistant)) + '" data-expanded="' + String(Boolean(isExpanded)) + '" aria-selected="' + String(selectedExplorerUris.includes(node.uri)) + '" aria-expanded="' + (node.type === 'folder' ? String(Boolean(isExpanded)) : 'false') + '">' +
          main +
          actions +
        '</div>';
    }

    function renderDisclosureControl(node, disclosure) {
      if (node.type !== 'folder') {
        return '<span class="disclosure disclosurePlaceholder" aria-hidden="true"></span>';
      }

      const isExpanded = getEffectiveExpanded(node);
      const label = isExpanded ? 'Collapse' : 'Expand';

      return '<button class="disclosure disclosureButton" type="button" data-row-control="true" data-action="toggle-node" data-uri="' + escapeHtml(node.uri) + '" data-expanded="' + String(Boolean(isExpanded)) + '" title="' + label + '" aria-label="' + label + '">' + disclosure + '</button>';
    }

    function renderNodeIcon(node, isRenaming) {
      if (node.type === 'folder') {
        const icon = node.icon;
        const content = !isRenaming && icon && icon.icon !== 'folder'
          ? '<span class="nodeIcon fileTypeIcon ' + escapeHtml(getIconColorClass(icon.color)) + '" title="' + escapeHtml(icon.label || '') + '">' +
              '<span class="nodeIconText">' + escapeHtml(icon.text || '') + '</span>' +
            '</span>'
          : '<span class="nodeIcon folder" aria-hidden="true"></span>';

        if (isRenaming || !node.canCustomizeIcon) {
          return content;
        }

        return '<button class="nodeIconButton" type="button" data-row-control="true" data-action="open-folder-icon-picker" data-uri="' + escapeHtml(node.uri) + '" title="Customize folder icon" aria-label="Customize folder icon">' +
          content +
        '</button>';
      }

      if (isRenaming || !node.icon || node.icon.icon === 'file') {
        return '<span class="nodeIcon ' + escapeHtml(node.type) + '" aria-hidden="true"></span>';
      }

      return '<span class="nodeIcon fileTypeIcon ' + escapeHtml(getIconColorClass(node.icon.color)) + '" title="' + escapeHtml(node.icon.label || '') + '">' +
        '<span class="nodeIconText">' + escapeHtml(node.icon.text || '') + '</span>' +
      '</span>';
    }

    function renderExplorerChildren(node, depth) {
      const childUris = treeChildrenByUri.get(node.uri);

      if (!childUris) {
        postExplorerStatus('NAssistant: Loading Explorer items...');
        return '';
      }

      const inlineCreate = inlineEdit?.mode === 'create' && inlineEdit.parentUri === node.uri
        ? renderInlineCreateInput(depth)
        : '';

      const children = getVisibleExplorerChildUris(node.uri)
        .map((uri) => treeModelByUri.get(uri))
        .filter(Boolean);

      return inlineCreate + renderExplorerNodes(children, depth);
    }

    function renderNodeActions(node) {
      const menuAction = renderMenuButton(node);
      const visibilityAction = node.canHide
        ? renderEyeButton(node)
        : '<span class="actionSpacer" aria-hidden="true"></span>';

      return '<div class="rowActions">' + menuAction + visibilityAction + '</div>';
    }

    function renderMenuButton(node) {
      return renderNodeActionButton(
        'menuButton',
        'open-context-menu',
        node,
        'More Actions'
      );
    }

    function renderEyeButton(node) {
      const css = node.isHiddenByNAssistant ? 'eyeButton isHidden' : 'eyeButton';
      const title = node.isHiddenByNAssistant
        ? 'Show in VS Code Explorer'
        : 'Hide from VS Code Explorer';

      return '<button class="nodeActionButton ' + css + '" type="button" data-row-control="true" data-action="toggle-folder-hidden" data-uri="' + escapeHtml(node.uri) + '" data-hidden="' + String(Boolean(node.isHiddenByNAssistant)) + '" title="' + title + '" aria-label="' + title + '">' +
        '<span class="eyeSlash" aria-hidden="true"></span>' +
      '</button>';
    }

    function renderNodeActionButton(iconClass, action, node, title) {
      return '<button class="nodeActionButton ' + iconClass + '" type="button" data-row-control="true" data-action="' + action + '" data-uri="' + escapeHtml(node.uri) + '" title="' + title + '" aria-label="' + title + '"></button>';
    }

    function renderGitBadge(node) {
      if (!node.gitBadge || !node.gitStatus) {
        return '';
      }

      return '<span class="gitBadge ' + escapeHtml(node.gitStatus.kind) + '" title="' + escapeHtml(node.gitTooltip || '') + '">' + escapeHtml(node.gitBadge) + '</span>';
    }

    function renderInlineNameInput(value) {
      return '<input class="inlineNameInput" value="' + escapeHtml(value) + '" data-row-control="true" data-inline-name="true" />';
    }

    function renderInlineCreateInput(depth) {
      const safeDepth = Math.min(depth, 12);

      return '<div class="treeRow isEditing depth' + safeDepth + '" data-row-key="inline-create:' + escapeHtml(inlineEdit.parentUri || '') + '" data-depth="' + String(depth) + '">' +
        '<div class="nodeMain renameMain">' +
          '<span class="disclosure" aria-hidden="true"></span>' +
          '<span class="nodeIcon ' + escapeHtml(inlineEdit.kind) + '" aria-hidden="true"></span>' +
          renderInlineNameInput('') +
        '</div>' +
        '<div class="rowActions" aria-hidden="true"></div>' +
      '</div>';
    }

    function handleExplorerRowClick(source, event) {
      if (!source || inlineEdit || event.detail > 1 || source.closest('[data-row-control="true"]')) {
        return;
      }

      if (getExplorerExpandMode() !== 'singleClick') {
        return;
      }

      const row = source.closest('.treeRow[data-uri]');

      if (!row || row.dataset.nodeType !== 'folder') {
        return;
      }

      if (ignoredToggleClickUri === row.dataset.uri) {
        ignoredToggleClickUri = undefined;
        return;
      }

      toggleExplorerFolderFromRow(row);
    }

    function toggleExplorerFolderFromRow(row) {
      const uri = row.dataset.uri;

      if (!uri) {
        return;
      }

      toggleExplorerFolder(uri, row.dataset.expanded !== 'true');
    }

    function getExplorerExpandMode() {
      return state.explorer?.expandMode === 'doubleClick' ? 'doubleClick' : 'singleClick';
    }

    function toggleExplorerFolder(uri, expanded) {
      const node = treeModelByUri.get(uri) || findNodeByUri(uri);
      const nextExpanded = typeof expanded === 'boolean'
        ? expanded
        : node
          ? !getEffectiveExpanded(node)
          : true;

      optimisticExpandedByUri.set(uri, nextExpanded);

      if (node) {
        node.isExpanded = nextExpanded;
      }

      renderVisibleRowsDiff();

      if (!nextExpanded && focusedExplorerUri && !findVisibleNode(focusedExplorerUri)) {
        setExplorerSelection([uri], false);
      }

      focusExplorerRow(uri);
      vscode.postMessage({
        type: 'loadExplorerChildren',
        uri,
        expanded: nextExpanded
      });
    }

    function syncExplorerFolderExpansionDom(uri, expanded) {
      const row = findExplorerRowElement(uri);
      const node = findNodeByUri(uri);

      if (!row || !node) {
        renderExplorer();
        return;
      }

      row.dataset.expanded = String(Boolean(expanded));
      row.setAttribute('aria-expanded', String(Boolean(expanded)));
      syncDisclosureDom(row, uri, expanded);

      const removedUris = removeRenderedDescendants(row);

      if (!expanded) {
        if (removedUris.some((removedUri) => selectedExplorerUris.includes(removedUri))) {
          selectedExplorerUris = [uri];
          focusedExplorerUri = uri;
          anchorExplorerUri = uri;
          syncExplorerSelectionDom();
        }

        return;
      }

      insertExplorerRowsAfter(row, renderExplorerChildren(node, Number(row.dataset.depth ?? 0) + 1));
    }

    function syncDisclosureDom(row, uri, expanded) {
      const disclosure = row.querySelector('[data-action="toggle-node"]');

      if (!(disclosure instanceof HTMLElement)) {
        return;
      }

      const label = expanded ? 'Collapse' : 'Expand';

      disclosure.dataset.expanded = String(Boolean(expanded));
      disclosure.textContent = expanded ? 'v' : '>';
      disclosure.setAttribute('title', label);
      disclosure.setAttribute('aria-label', label);
      disclosure.setAttribute('data-uri', uri);
    }

    function removeRenderedDescendants(row) {
      const depth = Number(row.dataset.depth ?? 0);
      const removedUris = [];
      let next = row.nextElementSibling;

      while (next instanceof HTMLElement) {
        const nextDepth = getRenderedRowDepth(next);

        if (nextDepth <= depth) {
          break;
        }

        const uri = next.dataset.uri;
        const following = next.nextElementSibling;

        if (uri) {
          removedUris.push(uri);
        }

        next.remove();
        next = following;
      }

      return removedUris;
    }

    function getRenderedRowDepth(row) {
      if (row.dataset.depth) {
        return Number(row.dataset.depth);
      }

      const depthClass = Array.from(row.classList)
        .find((className) => /^depth\\d+$/.test(className));

      return depthClass ? Number(depthClass.slice('depth'.length)) : 0;
    }

    function insertExplorerRowsAfter(row, html) {
      if (!html) {
        return;
      }

      const template = document.createElement('template');

      template.innerHTML = html;
      row.after(...Array.from(template.content.childNodes));
    }

    function updateExplorerSelection(uri, event, shouldRender = true) {
      const visibleNodes = getVisibleExplorerNodes();
      const visibleUris = visibleNodes.map((node) => node.uri);
      const clickedIndex = visibleUris.indexOf(uri);

      if (event.shiftKey && anchorExplorerUri) {
        const anchorIndex = visibleUris.indexOf(anchorExplorerUri);

        if (anchorIndex >= 0 && clickedIndex >= 0) {
          const start = Math.min(anchorIndex, clickedIndex);
          const end = Math.max(anchorIndex, clickedIndex);

          selectedExplorerUris = visibleUris.slice(start, end + 1);
        } else {
          selectedExplorerUris = [uri];
          anchorExplorerUri = uri;
        }
      } else if (event.metaKey || event.ctrlKey) {
        selectedExplorerUris = selectedExplorerUris.includes(uri)
          ? selectedExplorerUris.filter((item) => item !== uri)
          : selectedExplorerUris.concat(uri);

        if (selectedExplorerUris.length === 0) {
          selectedExplorerUris = [uri];
        }

        anchorExplorerUri = uri;
      } else {
        selectedExplorerUris = [uri];
        anchorExplorerUri = uri;
      }

      focusedExplorerUri = uri;

      if (shouldRender) {
        renderExplorer();
        return;
      }

      syncExplorerSelectionDom();
    }

    function setExplorerSelection(uris, shouldRender = true) {
      selectedExplorerUris = Array.from(new Set((uris || []).filter(Boolean)));
      focusedExplorerUri = selectedExplorerUris[selectedExplorerUris.length - 1];
      anchorExplorerUri = focusedExplorerUri;

      if (shouldRender) {
        renderExplorer();
        return;
      }

      syncExplorerSelectionDom();
    }

    function syncExplorerSelectionDom() {
      const selectedUris = new Set(selectedExplorerUris);

      explorerTree.querySelectorAll('.treeRow[data-uri]').forEach((row) => {
        const isSelected = selectedUris.has(row.dataset.uri);

        row.classList.toggle('isSelected', isSelected);
        row.setAttribute('aria-selected', String(isSelected));
      });
    }

    function focusExplorerRow(uri) {
      const row = findExplorerRowElement(uri);

      if (row instanceof HTMLElement) {
        row.focus({ preventScroll: true });
      }
    }

    function findExplorerRowElement(uri) {
      return Array.from(explorerTree.querySelectorAll('.treeRow[data-uri]'))
        .find((item) => item.dataset.uri === uri);
    }

    function getEffectiveExpanded(node) {
      if (!node || node.type !== 'folder') {
        return false;
      }

      if (optimisticExpandedByUri.has(node.uri)) {
        return optimisticExpandedByUri.get(node.uri) === true;
      }

      return Boolean(node.isExpanded);
    }

    function reconcileOptimisticExpansions() {
      for (const [uri, expanded] of optimisticExpandedByUri) {
        const node = findStateNodeByUri(uri);

        if (!node || Boolean(node.isExpanded) === expanded) {
          optimisticExpandedByUri.delete(uri);
        }
      }
    }

    function findNodeByUri(uri) {
      return treeModelByUri.get(uri) || findStateNodeByUri(uri);
    }

    function findStateNodeByUri(uri) {
      const explorer = state.explorer || { roots: [], children: {} };

      return findNodeInList(explorer.roots || [], explorer.children || {}, uri);
    }

    function findNodeInList(nodes, childrenByUri, uri) {
      for (const node of nodes || []) {
        if (node.uri === uri) {
          return node;
        }

        const child = findNodeInList(childrenByUri[node.uri] || [], childrenByUri, uri);

        if (child) {
          return child;
        }
      }

      return undefined;
    }

    function getSelectedExplorerUris() {
      return selectedExplorerUris.length > 0
        ? selectedExplorerUris
        : focusedExplorerUri
          ? [focusedExplorerUri]
          : [];
    }

    function pruneExplorerSelection() {
      const visibleUris = new Set(getVisibleExplorerNodes().map((node) => node.uri));

      selectedExplorerUris = selectedExplorerUris.filter((uri) => visibleUris.has(uri));

      if (focusedExplorerUri && !visibleUris.has(focusedExplorerUri)) {
        focusedExplorerUri = selectedExplorerUris[0];
      }

      if (anchorExplorerUri && !visibleUris.has(anchorExplorerUri)) {
        anchorExplorerUri = selectedExplorerUris[0];
      }
    }

    function getVisibleExplorerNodes() {
      return visibleRows
        .filter((row) => row.kind === 'node')
        .map((row) => row.node);
    }

    function visitExplorerNodes(sourceNodes, targetNodes, childrenByUri) {
      for (const node of sourceNodes || []) {
        targetNodes.push(node);

        if (node.type === 'folder' && getEffectiveExpanded(node)) {
          visitExplorerNodes(childrenByUri[node.uri] || [], targetNodes, childrenByUri);
        }
      }
    }

    function findVisibleNode(uri) {
      return visibleRows
        .filter((row) => row.kind === 'node')
        .map((row) => row.node)
        .find((node) => node.uri === uri);
    }

    function getFocusedExplorerNode() {
      return findVisibleNode(focusedExplorerUri || getSelectedExplorerUris()[0]);
    }

    function openOrToggleExplorerNode(node) {
      if (!node) {
        return;
      }

      if (node.type === 'folder') {
        toggleExplorerFolder(node.uri, !getEffectiveExpanded(node));
        return;
      }

      vscode.postMessage({
        type: 'openExplorerFile',
        uri: node.uri
      });
    }

    function moveExplorerSelection(offset, extendSelection) {
      const visibleNodes = getVisibleExplorerNodes();

      if (visibleNodes.length === 0) {
        return;
      }

      const currentUri = focusedExplorerUri || selectedExplorerUris[selectedExplorerUris.length - 1];
      const currentIndex = Math.max(0, visibleNodes.findIndex((node) => node.uri === currentUri));
      const nextIndex = Math.max(0, Math.min(visibleNodes.length - 1, currentIndex + offset));
      const nextUri = visibleNodes[nextIndex].uri;

      if (extendSelection && anchorExplorerUri) {
        const anchorIndex = Math.max(0, visibleNodes.findIndex((node) => node.uri === anchorExplorerUri));
        const start = Math.min(anchorIndex, nextIndex);
        const end = Math.max(anchorIndex, nextIndex);

        selectedExplorerUris = visibleNodes.slice(start, end + 1).map((node) => node.uri);
        focusedExplorerUri = nextUri;
        syncExplorerSelectionDom();
        focusExplorerRow(nextUri);
        return;
      }

      setExplorerSelection([nextUri], false);
      focusExplorerRow(nextUri);
    }

    function expandOrCollapseExplorerNode(node, expanded) {
      if (!node || node.type !== 'folder') {
        return;
      }

      if (getEffectiveExpanded(node) === expanded) {
        return;
      }

      toggleExplorerFolder(node.uri, expanded);
    }

    function showContextMenuForFocusedNode() {
      const node = getFocusedExplorerNode();

      if (!node) {
        return;
      }

      setExplorerSelection(selectedExplorerUris.includes(node.uri) ? selectedExplorerUris : [node.uri], false);

      const row = Array.from(explorerTree.querySelectorAll('.treeRow'))
        .find((item) => item.dataset.uri === node.uri);
      const rect = row?.getBoundingClientRect();

      showContextMenuForUri(
        node.uri,
        rect ? rect.left + 16 : 8,
        rect ? rect.top + 18 : 28
      );
    }

    function showContextMenuForUri(uri, x, y) {
      const node = findVisibleNode(uri);

      if (!node) {
        hideContextMenu();
        return;
      }

      focusedExplorerUri = uri;
      const selectedUris = selectedExplorerUris.includes(uri)
        ? getSelectedExplorerUris()
        : [uri];
      const selectedNodes = selectedUris
        .map((selectedUri) => findVisibleNode(selectedUri))
        .filter(Boolean);
      const isMulti = selectedUris.length > 1;
      const canDeleteSelection = selectedNodes.length > 0 && selectedNodes.every((item) => item.canDelete);
      const items = [];

      if (!isMulti && node.type === 'file') {
        items.push(renderContextMenuButton('open', 'Open'));
        items.push(renderContextSeparator());
      }

      if (!isMulti && node.canCreateChild) {
        items.push(renderContextMenuButton('new-file', 'New File'));
        items.push(renderContextMenuButton('new-folder', 'New Folder'));
        items.push(renderContextSeparator());
      }

      items.push(renderContextMenuButton('copy-reference', isMulti ? 'Copy References' : 'Copy Reference'));
      items.push(renderContextMenuButton('paste-context', isMulti ? 'Paste Contexts to Assistant' : 'Paste Context to Assistant'));

      if (!isMulti && node.canRename) {
        items.push(renderContextSeparator());
        items.push(renderContextMenuButton('rename', 'Rename'));
      }

      if (canDeleteSelection) {
        if (!items[items.length - 1]?.includes('contextSeparator')) {
          items.push(renderContextSeparator());
        }

        items.push(renderContextMenuButton('delete', isMulti ? 'Delete Selected' : 'Delete'));
      }

      if (!isMulti && node.canHide) {
        items.push(renderContextSeparator());
        items.push(renderContextMenuButton('toggle-hidden', node.isHiddenByNAssistant ? 'Show in VS Code Explorer' : 'Hide from VS Code Explorer'));
      }

      hideExplorerOptions();
      explorerContextMenu.innerHTML = items.join('');
      explorerContextMenu.hidden = false;
      explorerContextMenu.style.left = '0px';
      explorerContextMenu.style.top = '0px';

      const maxLeft = Math.max(0, window.innerWidth - explorerContextMenu.offsetWidth - 4);
      const maxTop = Math.max(0, window.innerHeight - explorerContextMenu.offsetHeight - 4);

      explorerContextMenu.style.left = Math.min(x, maxLeft) + 'px';
      explorerContextMenu.style.top = Math.min(y, maxTop) + 'px';
    }

    function renderContextMenuButton(command, label) {
      return '<button type="button" data-action="context-command" data-command="' + escapeHtml(command) + '">' + escapeHtml(label) + '</button>';
    }

    function renderContextSeparator() {
      return '<div class="contextSeparator" role="separator"></div>';
    }

    function hideContextMenu() {
      const wasOpen = !explorerContextMenu.hidden;

      explorerContextMenu.hidden = true;
      explorerContextMenu.innerHTML = '';

      return wasOpen;
    }

    function runContextCommand(command) {
      const selectedUris = getSelectedExplorerUris();
      const node = findVisibleNode(focusedExplorerUri || selectedUris[0]);

      hideContextMenu();

      if (!node || !command) {
        return;
      }

      if (command === 'open') {
        if (node.type === 'file') {
          vscode.postMessage({
            type: 'openExplorerFile',
            uri: node.uri
          });
        }

        return;
      }

      if (command === 'new-file' || command === 'new-folder') {
        if (node.canCreateChild) {
          startInlineCreate(node.uri, command === 'new-folder' ? 'folder' : 'file');
        }

        return;
      }

      if (command === 'copy-reference') {
        vscode.postMessage({
          type: 'copyExplorerReferences',
          uris: selectedUris
        });
        return;
      }

      if (command === 'paste-context') {
        vscode.postMessage({
          type: 'pasteExplorerContexts',
          uris: selectedUris
        });
        return;
      }

      if (command === 'rename') {
        startInlineRename(node.uri);
        return;
      }

      if (command === 'delete') {
        postDeleteSelected();
        return;
      }

      if (command === 'toggle-hidden') {
        vscode.postMessage({
          type: 'toggleExplorerFolderHidden',
          uri: node.uri,
          hidden: !node.isHiddenByNAssistant
        });
      }
    }

    function startInlineCreate(parentUri, kind) {
      const node = findVisibleNode(parentUri);

      if (!node?.canCreateChild) {
        return;
      }

      inlineEdit = {
        mode: 'create',
        parentUri,
        kind
      };

      if (node.type === 'folder' && !getEffectiveExpanded(node)) {
        toggleExplorerFolder(parentUri, true);
      }

      renderVisibleRowsDiff();
      focusInlineInput();
    }

    function startInlineRename(uri) {
      const node = findVisibleNode(uri);

      if (!node?.canRename) {
        return;
      }

      inlineEdit = {
        mode: 'rename',
        uri
      };
      setExplorerSelection([uri], false);
      renderVisibleRowsDiff();
      focusInlineInput();
    }

    function focusInlineInput() {
      const input = explorerTree.querySelector('[data-inline-name="true"]');

      if (input instanceof HTMLInputElement) {
        input.focus();
        input.select();
      }
    }

    function handleInlineNameKeydown(event, input) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        inlineEdit = undefined;
        renderExplorer();
        return;
      }

      if (event.key !== 'Enter') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (!inlineEdit) {
        return;
      }

      const name = input.value.trim();

      if (!name) {
        input.focus();
        return;
      }

      const edit = inlineEdit;
      const expandedUris = getExpandedExplorerUrisForMessage();

      inlineEdit = undefined;

      if (edit.mode === 'create') {
        vscode.postMessage({
          type: 'createExplorerItem',
          parentUri: edit.parentUri,
          name,
          kind: edit.kind,
          expandedUris
        });
      }

      if (edit.mode === 'rename') {
        vscode.postMessage({
          type: 'renameExplorerItem',
          uri: edit.uri,
          name
        });
      }

      renderVisibleRowsDiff();
    }

    function getExpandedExplorerUrisForMessage() {
      return getVisibleExplorerNodes()
        .filter((node) => node.type === 'folder' && getEffectiveExpanded(node))
        .map((node) => node.uri);
    }

    function postDeleteSelected() {
      const uris = getSelectedExplorerUris();

      if (uris.length === 0) {
        return;
      }

      vscode.postMessage({
        type: 'deleteExplorerItems',
        uris
      });
    }

    async function handleExplorerDrop(dataTransfer, targetUri) {
      const internalPayload = dataTransfer.getData('application/x-nassistant-uris');

      if (internalPayload) {
        const uris = parseDroppedUris(internalPayload);

        if (uris.length > 0) {
          vscode.postMessage({
            type: 'moveExplorerItems',
            uris,
            targetUri
          });
        }

        return;
      }

      if (hasExternalFolderDrop(dataTransfer)) {
        window.alert('External folder drop is not supported yet. Drop files instead.');
        return;
      }

      const files = Array.from(dataTransfer.files || []);

      if (files.length === 0) {
        return;
      }

      const droppedFiles = await Promise.all(files.map(readDroppedFile));

      vscode.postMessage({
        type: 'copyExternalFiles',
        targetUri,
        files: droppedFiles
      });
    }

    function parseDroppedUris(payload) {
      try {
        const value = JSON.parse(payload);

        return Array.isArray(value)
          ? value.filter((uri) => typeof uri === 'string')
          : [];
      } catch {
        return [];
      }
    }

    function hasExternalFolderDrop(dataTransfer) {
      return Array.from(dataTransfer.items || []).some((item) => {
        if (typeof item.webkitGetAsEntry !== 'function') {
          return false;
        }

        const entry = item.webkitGetAsEntry();

        return Boolean(entry?.isDirectory);
      });
    }

    function readDroppedFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
          const value = String(reader.result || '');
          const commaIndex = value.indexOf(',');

          resolve({
            name: file.name,
            data: commaIndex >= 0 ? value.slice(commaIndex + 1) : value
          });
        });
        reader.addEventListener('error', () => {
          reject(reader.error || new Error('Could not read dropped file.'));
        });
        reader.readAsDataURL(file);
      });
    }

    function renderSettings() {
      const settings = state.settings;
      const assistantTarget = settings.assistantTarget || getFallbackAssistantTarget();
      const enabledCount = settings.features.filter((feature) => feature.enabled).length;
      const settingsSection = getSettingsSection(activeSettingsSection);

      activeSettingsSection = settingsSection;

      settingsSectionButtons.forEach((button) => {
        const isActive = button.dataset.settingsSection === settingsSection;

        button.classList.toggle('isActive', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      settingsPanes.forEach((pane) => {
        pane.hidden = pane.dataset.settingsPane !== settingsSection;
      });

      featureCount.textContent = enabledCount + '/' + settings.features.length;

      featureList.innerHTML = settings.features.map((feature) => {
        const css = feature.enabled ? 'featureCard' : 'featureCard disabled';
        const toggleCss = feature.enabled ? 'toggle isOn' : 'toggle';
        const checked = feature.enabled ? 'true' : 'false';
        const commandIds = feature.commandIds || [{ label: 'ID', command: feature.command }];
        const targetSelector = feature.id === 'pasteContextToAssistant'
          ? renderAssistantTargetSelector(assistantTarget)
          : '';
        const commandButtons = commandIds.map((item) => {
          return '<button class="actionButton" type="button" data-action="copy-command" data-command="' + escapeHtml(item.command) + '">' + escapeHtml(item.label) + '</button>';
        }).join('');

        return '<article class="' + css + '">' +
          '<div class="featureTop">' +
            '<div class="featureInfo">' +
              '<div class="featureTitle">' + escapeHtml(feature.title) + '</div>' +
              '<div class="meta">' + escapeHtml(feature.context) + '</div>' +
            '</div>' +
            '<button class="' + toggleCss + '" type="button" role="switch" aria-checked="' + checked + '" aria-label="Toggle ' + escapeHtml(feature.title) + '" data-action="toggle-feature" data-feature-id="' + escapeHtml(feature.id) + '"></button>' +
          '</div>' +
          targetSelector +
          '<div class="preview">' + escapeHtml(feature.preview) + '</div>' +
          '<div class="actions">' +
            '<button class="actionButton shortcutButton" type="button" data-action="shortcut" data-command="' + escapeHtml(feature.command) + '">' +
              '<span class="subtle">Shortcut</span> <span class="shortcutValue">' + escapeHtml(feature.shortcut) + '</span>' +
            '</button>' +
            commandButtons +
          '</div>' +
        '</article>';
      }).join('');

      explorerSettings.innerHTML = renderExplorerSettings();
      renderColorPalette(settings.explorerAppearance);
      renderFileRules(settings.explorerAppearance);
    }

    function getSettingsSection(value) {
      return ['features', 'explorer', 'fileRules'].includes(value) ? value : 'features';
    }

    function renderExplorerSettings() {
      const options = state.explorer?.options || getFallbackExplorerOptions();
      const checked = options.showHiddenFolders ? ' checked' : '';

      return '<label class="settingRow">' +
          '<span class="settingCopy">' +
            '<span class="settingTitle">Show hidden folders</span>' +
            '<span class="settingDescription">Show folders hidden from the NAssistant Explorer.</span>' +
          '</span>' +
          '<span class="settingControl">' +
            '<input class="optionCheck" type="checkbox" data-action="toggle-explorer-show-hidden"' + checked + ' aria-label="Show hidden folders">' +
            '<span class="switchTrack" aria-hidden="true"></span>' +
          '</span>' +
        '</label>' +
        '<div class="settingRow">' +
          '<span class="settingCopy">' +
            '<span class="settingTitle">Sort order</span>' +
            '<span class="settingDescription">Choose the item order used in this Explorer view.</span>' +
          '</span>' +
          '<span class="settingControl settingControlWide">' +
            renderSettingsSortDropdown() +
          '</span>' +
        '</div>';
    }

    function renderSettingsSortDropdown() {
      const currentValue = getExplorerSortMode();
      const currentLabel = getExplorerSortLabel(currentValue);
      const openCss = settingsSortMenuOpen ? ' isOpen' : '';
      const hidden = settingsSortMenuOpen ? '' : ' hidden';

      return '<span class="settingsDropdown" data-settings-sort-menu="true">' +
        '<button class="settingsDropdownButton' + openCss + '" type="button" data-action="toggle-settings-sort-menu" aria-haspopup="listbox" aria-expanded="' + String(settingsSortMenuOpen) + '">' +
          '<span>' + escapeHtml(currentLabel) + '</span>' +
          '<span class="settingsDropdownChevron" aria-hidden="true">v</span>' +
        '</button>' +
        '<div class="settingsDropdownMenu" role="listbox"' + hidden + '>' +
          getExplorerSortOptions().map(([value, label]) => {
            const selected = value === currentValue ? ' isSelected' : '';

            return '<button class="' + selected.trim() + '" type="button" role="option" aria-selected="' + String(value === currentValue) + '" data-action="select-settings-sort" data-sort-mode="' + escapeHtml(value) + '">' +
              escapeHtml(label) +
            '</button>';
          }).join('') +
        '</div>' +
      '</span>';
    }

    function getExplorerSortOptions() {
      return [
        ['default', 'Default'],
        ['nameAsc', 'Name A-Z'],
        ['nameDesc', 'Name Z-A'],
        ['type', 'Type']
      ];
    }

    function getExplorerSortLabel(value) {
      return getExplorerSortOptions().find(([optionValue]) => optionValue === value)?.[1] || 'Default';
    }

    function renderColorPalette(appearance) {
      const colors = appearance?.colorPresets || [];

      colorPalette.innerHTML = '<div class="paletteHeader">' +
          '<span class="paletteTitle">Color Palette</span>' +
          '<span class="count">' + String(colors.length) + '</span>' +
        '</div>' +
        '<div class="paletteGrid">' +
          colors.map((color) => renderPaletteColor(color)).join('') +
        '</div>' +
        '<div class="paletteAdd">' +
          '<input class="paletteInput" id="newExplorerColorInput" placeholder="#7E5BEF" aria-label="New Explorer color">' +
          '<button class="fileRuleAddButton" type="button" data-action="add-explorer-color">Add</button>' +
        '</div>';
    }

    function renderPaletteColor(color) {
      const css = color.isDefault ? 'paletteColor isDefault ' : 'paletteColor ';
      const removeButton = color.canRemove
        ? '<button type="button" data-action="remove-explorer-color" data-color="' + escapeHtml(color.id) + '" title="Remove ' + escapeHtml(color.label) + '" aria-label="Remove ' + escapeHtml(color.label) + '">x</button>'
        : '';

      return '<span class="' + css + escapeHtml(color.className) + '" title="' + escapeHtml(color.label) + '">' +
        removeButton +
      '</span>';
    }

    function renderFileRules(appearance) {
      const rules = appearance?.fileExtensionRules || [];

      fileRuleCount.textContent = String(rules.length);
      fileRules.innerHTML = '<div class="fileRuleHeader" aria-hidden="true">' +
          '<span>Ext</span>' +
          '<span>Icon</span>' +
          '<span>Color</span>' +
          '<span>Hide</span>' +
          '<span></span>' +
        '</div>' +
        rules.map((rule) => renderFileRuleRow(rule)).join('') +
        renderFileRuleAddRow();
    }

    function renderFileRuleRow(rule) {
      const checked = rule.hidden ? ' checked' : '';
      const removeButton = rule.isDefault
        ? '<span aria-hidden="true"></span>'
        : '<button class="fileRuleRemove" type="button" data-action="remove-file-extension-rule" data-extension="' + escapeHtml(rule.extension) + '" title="Remove" aria-label="Remove ' + escapeHtml(rule.extension) + '">x</button>';

      return '<div class="fileRuleRow" data-extension="' + escapeHtml(rule.extension) + '">' +
        '<span class="fileRuleExtension">' + escapeHtml(rule.extension) + '</span>' +
        '<span class="fileRuleControls">' +
          renderFileRuleIconPicker(rule) +
          renderFileRuleColorPicker(rule) +
        '</span>' +
        '<label class="fileRuleHidden" title="Hide in Explorer">' +
          '<input type="checkbox" data-action="toggle-file-rule-hidden" data-extension="' + escapeHtml(rule.extension) + '"' + checked + ' aria-label="Hide ' + escapeHtml(rule.extension) + '">' +
        '</label>' +
        removeButton +
      '</div>';
    }

    function renderFileRuleIconPicker(rule) {
      const isOpen = activeFileRuleIconExtension === rule.extension;
      const openCss = isOpen ? ' isOpen' : '';
      const hidden = isOpen ? '' : ' hidden';
      const iconPreset = getFileIconPresets().find((preset) => preset.id === rule.icon) || getFileIconPresets()[getFileIconPresets().length - 1];
      const label = iconPreset?.id === 'file' ? 'File' : iconPreset?.text || 'File';

      return '<span class="fileRuleIconPicker" data-file-rule-icon-menu="true">' +
        '<button class="fileRuleIconButton' + openCss + '" type="button" data-action="toggle-file-rule-icon-menu" data-extension="' + escapeHtml(rule.extension) + '" aria-haspopup="listbox" aria-expanded="' + String(isOpen) + '">' +
          '<span class="fileRuleIconMark" aria-hidden="true">' + escapeHtml(label) + '</span>' +
          '<span class="fileRuleIconLabel">' + escapeHtml(label) + '</span>' +
          '<span class="fileRuleIconChevron" aria-hidden="true">v</span>' +
        '</button>' +
        '<div class="fileRuleIconMenu" role="listbox"' + hidden + '>' +
          getFileIconPresets().map((preset) => renderFileRuleIconChoice(rule, preset)).join('') +
        '</div>' +
      '</span>';
    }

    function renderFileRuleIconChoice(rule, preset) {
      const selectedCss = preset.id === rule.icon ? ' isSelected' : '';
      const label = preset.id === 'file' ? 'File' : preset.text;

      return '<button class="fileRuleIconChoice' + selectedCss + '" type="button" role="option" aria-selected="' + String(preset.id === rule.icon) + '" data-action="select-file-rule-icon" data-extension="' + escapeHtml(rule.extension) + '" data-icon="' + escapeHtml(preset.id) + '" data-color="' + escapeHtml(rule.color) + '" title="' + escapeHtml(preset.label) + '" aria-label="' + escapeHtml(preset.label) + '">' +
        escapeHtml(label) +
      '</button>';
    }

    function renderFileRuleColorPicker(rule) {
      const isOpen = activeFileRuleColorExtension === rule.extension;
      const openCss = isOpen ? ' isOpen' : '';
      const hidden = isOpen ? '' : ' hidden';

      return '<span class="fileRuleColorPicker" data-file-rule-color-menu="true">' +
        '<button class="fileRuleColorButton' + openCss + '" type="button" data-action="toggle-file-rule-color-menu" data-extension="' + escapeHtml(rule.extension) + '" aria-haspopup="listbox" aria-expanded="' + String(isOpen) + '">' +
          '<span class="colorSwatch ' + escapeHtml(getIconColorClass(rule.color)) + '" aria-hidden="true"></span>' +
          '<span class="fileRuleColorLabel">' + escapeHtml(getColorLabel(rule.color)) + '</span>' +
          '<span class="fileRuleColorChevron" aria-hidden="true">v</span>' +
        '</button>' +
        '<div class="fileRuleColorMenu" role="listbox"' + hidden + '>' +
          getColorPresets().map((color) => renderFileRuleColorChoice(rule, color)).join('') +
        '</div>' +
      '</span>';
    }

    function renderFileRuleColorChoice(rule, color) {
      const selectedCss = color.id === rule.color ? ' isSelected' : '';

      return '<button class="fileRuleColorChoice ' + escapeHtml(color.className) + selectedCss + '" type="button" role="option" aria-selected="' + String(color.id === rule.color) + '" data-action="select-file-rule-color" data-extension="' + escapeHtml(rule.extension) + '" data-icon="' + escapeHtml(rule.icon) + '" data-color="' + escapeHtml(color.id) + '" title="' + escapeHtml(color.label) + '" aria-label="' + escapeHtml(color.label) + '"></button>';
    }

    function renderFileRuleAddRow() {
      return '<div class="fileRuleAdd">' +
        '<input class="fileRuleInput" id="newFileExtensionInput" placeholder=".ext" aria-label="New file extension">' +
        '<button class="fileRuleAddButton" type="button" data-action="add-file-extension-rule">Add</button>' +
      '</div>';
    }

    function renderAssistantTargetSelector(assistantTarget) {
      const options = assistantTarget.options || getFallbackAssistantTarget().options;

      return '<label class="targetField">' +
        '<span class="targetLabel">Target</span>' +
        '<select class="targetSelect" data-action="select-target" aria-label="Paste context target">' +
          options.map((option) => {
            const selected = option.target === assistantTarget.current ? ' selected' : '';

            return '<option value="' + escapeHtml(option.target) + '"' + selected + '>' + escapeHtml(option.label) + '</option>';
          }).join('') +
        '</select>' +
      '</label>';
    }

    function getFallbackAssistantTarget() {
      return {
        current: 'claude',
        label: 'Claude (Default)',
        options: [
          { target: 'claude', label: 'Claude (Default)' },
          { target: 'codex', label: 'Codex' }
        ]
      };
    }

    function getFallbackExplorerOptions() {
      return {
        showHiddenFolders: true,
        sortMode: 'default'
      };
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    render();
    vscode.postMessage({ type: 'ready' });
  </script>
</body>
</html>`;
}

function createNonce(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';

  for (let index = 0; index < 32; index++) {
    nonce += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return nonce;
}

function createCustomColorStyles(state: NAssistantState): string {
  const presets = state.explorer?.appearance?.colorPresets ?? state.settings.explorerAppearance.colorPresets;

  return presets
    .filter((preset) => preset.className.startsWith('iconColorCustom') && /^#[0-9A-F]{6}$/.test(preset.value))
    .map((preset) => `    .${preset.className} {
      --node-icon-color: ${preset.value};
      --choice-color: ${preset.value};
    }`)
    .join('\n\n');
}
