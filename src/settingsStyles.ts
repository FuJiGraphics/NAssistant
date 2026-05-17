import type { NAssistantState } from './appState';

export function createSettingsStyles(state: NAssistantState): string {
  const customColorStyles = createCustomColorStyles(state);

  return `
    :root {
      color-scheme: light dark;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
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
      padding-top: 6px;
      user-select: none;
    }

    .explorerTools {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px 7px;
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
      grid-template-columns: minmax(0, 1fr);
      align-items: center;
      min-height: 22px;
      border-radius: 0;
    }

    .treeRow[data-folder-tint] {
      background: var(--folder-tint, transparent);
    }

    .treeRow[data-folder-tint]:hover:not(.isSelected) {
      background:
        linear-gradient(var(--vscode-list-hoverBackground), var(--vscode-list-hoverBackground)),
        var(--folder-tint, transparent);
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

    .depth0 .nodeMain { padding: 0; }
    .depth1 .nodeMain { padding: 0 0 0 14px; }
    .depth2 .nodeMain { padding: 0 0 0 26px; }
    .depth3 .nodeMain { padding: 0 0 0 38px; }
    .depth4 .nodeMain { padding: 0 0 0 50px; }
    .depth5 .nodeMain { padding: 0 0 0 62px; }
    .depth6 .nodeMain { padding: 0 0 0 74px; }
    .depth7 .nodeMain { padding: 0 0 0 86px; }
    .depth8 .nodeMain { padding: 0 0 0 98px; }
    .depth9 .nodeMain { padding: 0 0 0 110px; }
    .depth10 .nodeMain { padding: 0 0 0 122px; }
    .depth11 .nodeMain { padding: 0 0 0 134px; }
    .depth12 .nodeMain { padding: 0 0 0 146px; }

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

    .nodeIcon.fileTypeIcon {
      display: grid;
      place-items: center;
      isolation: isolate;
      color: var(--node-icon-color, var(--vscode-descriptionForeground));
      font-family: var(--vscode-editor-font-family);
    }

    .nodeIcon.nodeIconSvg {
      display: inline-grid;
      place-items: center;
      isolation: isolate;
      color: var(--node-icon-color, var(--vscode-descriptionForeground));
    }

    .nodeIcon.nodeIconSvg svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      stroke-width: 1.75;
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
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1px;
      height: 100%;
      padding-right: 2px;
      background-color: inherit;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .treeRow:hover:not(.isEditing) .rowActions,
    .treeRow:focus-within:not(.isEditing) .rowActions {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
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
      width: 212px;
      max-width: calc(100vw - 8px);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      color: var(--vscode-menu-foreground, var(--vscode-foreground));
      background: var(--vscode-menu-background, var(--vscode-editorWidget-background));
      box-shadow: 0 6px 18px rgb(0 0 0 / 30%);
      padding: 8px;
    }

    .iconPicker::before {
      content: "";
      position: absolute;
      left: calc(var(--picker-pointer-left, 18px) - 4px);
      top: -5px;
      width: 8px;
      height: 8px;
      border-top: 1px solid var(--vscode-panel-border);
      border-left: 1px solid var(--vscode-panel-border);
      background: inherit;
      pointer-events: none;
      transform: rotate(45deg);
    }

    .iconPicker[data-placement="above"]::before {
      top: auto;
      bottom: -5px;
      border: 0;
      border-right: 1px solid var(--vscode-panel-border);
      border-bottom: 1px solid var(--vscode-panel-border);
    }

    .iconPicker[hidden] {
      display: none;
    }

    .pickerHeader {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
      min-height: 25px;
      margin-bottom: 7px;
      padding: 0 1px 7px;
      border-bottom: 1px solid color-mix(in srgb, var(--vscode-panel-border) 72%, transparent);
    }

    .pickerPreview {
      display: inline-grid;
      place-items: center;
      flex: 0 0 auto;
      width: 22px;
      height: 22px;
      border: 1px solid color-mix(in srgb, var(--choice-color, currentColor) 52%, var(--vscode-panel-border));
      border-radius: 5px;
      color: var(--choice-color, var(--vscode-descriptionForeground));
      background: color-mix(in srgb, var(--choice-color, currentColor) 12%, var(--vscode-input-background));
    }

    .pickerPreview svg {
      width: 15px;
      height: 15px;
      stroke: currentColor;
      stroke-width: 1.8;
    }

    .pickerTitle {
      overflow: hidden;
      min-width: 0;
      color: var(--vscode-foreground);
      font-weight: 650;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pickerSeparator {
      height: 1px;
      margin: 7px -2px;
      background: color-mix(in srgb, var(--vscode-panel-border) 72%, transparent);
    }

    .folderIconTabs {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      overflow: hidden;
      min-width: 0;
      margin-bottom: 7px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 5px;
      background: color-mix(in srgb, var(--vscode-input-background) 86%, transparent);
    }

    .folderIconTab {
      position: relative;
      overflow: hidden;
      min-width: 0;
      height: 24px;
      border: 0;
      border-right: 1px solid var(--vscode-panel-border);
      color: var(--vscode-descriptionForeground);
      background: transparent;
      cursor: pointer;
      padding: 2px 4px;
      font-size: 10.5px;
      font-weight: 650;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .folderIconTab:last-child {
      border-right: 0;
    }

    .folderIconTab:hover {
      color: var(--vscode-foreground);
      background: var(--vscode-list-hoverBackground);
    }

    .folderIconTab.isSelected {
      color: var(--vscode-foreground);
      background: color-mix(in srgb, var(--vscode-list-activeSelectionBackground) 24%, transparent);
    }

    .folderIconTab.isSelected::after {
      content: "";
      position: absolute;
      left: 8px;
      right: 8px;
      bottom: 0;
      height: 1px;
      background: var(--vscode-focusBorder);
    }

    .iconGrid,
    .colorGrid {
      display: grid;
      gap: 5px;
    }

    .iconGrid {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    .colorGrid {
      grid-template-columns: repeat(7, 1fr);
    }

    .iconChoice,
    .colorChoice {
      border: 1px solid var(--vscode-panel-border);
      border-radius: 5px;
      background: var(--vscode-input-background);
      cursor: pointer;
    }

    .iconChoice {
      display: inline-grid;
      place-items: center;
      width: 100%;
      height: 34px;
      padding: 4px;
      color: var(--choice-color, var(--vscode-descriptionForeground));
      font-size: 9px;
      font-weight: 750;
    }

    .iconChoice svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      stroke-width: 1.75;
    }

    .colorChoice {
      position: relative;
      width: 100%;
      height: 22px;
      background: var(--choice-color, var(--vscode-descriptionForeground));
    }

    .colorChoice.colorClearChoice {
      display: inline-grid;
      place-items: center;
      background: transparent;
      color: var(--vscode-descriptionForeground);
    }

    .colorClearMark {
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
    }

    .iconChoice.isSelected,
    .colorChoice.isSelected {
      border-color: var(--vscode-focusBorder);
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: 1px;
    }

    .iconChoice:hover,
    .colorChoice:hover {
      border-color: var(--vscode-focusBorder);
    }

    .iconChoice:hover,
    .iconChoice.isSelected {
      background: color-mix(in srgb, var(--choice-color, currentColor) 12%, var(--vscode-input-background));
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
    .folderIconTab:focus-visible,
    .settingsNavButton:focus-visible,
    .settingsDropdownButton:focus-visible,
    .settingsDropdownMenu button:focus-visible,
    .targetSelect:focus-visible,
    .tabButton:focus-visible,
    .treeRow:focus-visible,
    .disclosureButton:focus-visible,
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
`;
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
