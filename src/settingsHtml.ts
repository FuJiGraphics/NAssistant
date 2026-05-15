import type { SettingsState } from './features';

export function createSettingsHtml(state: SettingsState): string {
  const nonce = createNonce();
  const initialState = JSON.stringify(state).replace(/</g, '\\u003c');

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

    button {
      font: inherit;
    }

    .shell {
      min-width: 0;
      padding: 14px 12px 18px;
    }

    .masthead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 14px;
    }

    .brand {
      display: flex;
      align-items: center;
      min-width: 0;
      gap: 10px;
    }

    .mark {
      display: grid;
      place-items: center;
      flex: 0 0 28px;
      width: 28px;
      height: 28px;
      border: 1px solid var(--vscode-focusBorder);
      border-radius: 7px;
      color: var(--vscode-button-foreground);
      background: var(--vscode-button-background);
      font-weight: 700;
    }

    .titleBlock {
      min-width: 0;
    }

    h1,
    h2,
    p {
      margin: 0;
    }

    h1 {
      overflow: hidden;
      font-size: 14px;
      font-weight: 650;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .kicker,
    .meta,
    .subtle {
      color: var(--vscode-descriptionForeground);
    }

    .kicker {
      margin-top: 2px;
      font-size: 11px;
    }

    .refreshButton,
    .actionButton {
      min-height: 28px;
      border: 1px solid var(--vscode-button-border, transparent);
      border-radius: 6px;
      color: var(--vscode-button-secondaryForeground);
      background: var(--vscode-button-secondaryBackground);
      cursor: pointer;
    }

    .refreshButton {
      flex: 0 0 auto;
      min-width: 32px;
      padding: 0 8px;
    }

    .refreshButton:hover,
    .actionButton:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }

    .section {
      margin-top: 0;
    }

    .sectionHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
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

    .featureList {
      display: grid;
      gap: 8px;
    }

    .featureCard {
      min-width: 0;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 8px;
      background: var(--vscode-editor-background);
    }

    .featureCard {
      padding: 10px;
    }

    .featureTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .featureTop {
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

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
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
    .refreshButton:focus-visible {
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: 2px;
    }

    .disabled {
      opacity: 0.62;
    }

    @media (max-width: 240px) {
      .refreshButton {
        display: none;
      }

      .actionButton {
        flex: 1 1 100%;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <header class="masthead">
      <div class="brand">
        <div class="mark" aria-hidden="true">N</div>
        <div class="titleBlock">
          <h1>NAssistant</h1>
          <p class="kicker">Settings</p>
        </div>
      </div>
      <button class="refreshButton" id="refreshButton" title="Refresh" aria-label="Refresh">R</button>
    </header>

    <section class="section" aria-labelledby="featuresHeading">
      <div class="sectionHeader">
        <h2 id="featuresHeading">Features</h2>
        <span class="count" id="featureCount"></span>
      </div>
      <div class="featureList" id="featureList"></div>
    </section>
  </main>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    let state = ${initialState};

    const featureList = document.getElementById('featureList');
    const featureCount = document.getElementById('featureCount');
    const refreshButton = document.getElementById('refreshButton');

    refreshButton.addEventListener('click', () => {
      vscode.postMessage({ type: 'refresh' });
    });

    document.addEventListener('click', (event) => {
      const source = event.target instanceof Element ? event.target : event.target?.parentElement;
      const target = source?.closest('[data-action]');

      if (!target) {
        return;
      }

      const action = target.dataset.action;

      if (action === 'toggle-feature') {
        const feature = state.features.find((item) => item.id === target.dataset.featureId);

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
    });

    window.addEventListener('message', (event) => {
      if (event.data?.type === 'state') {
        state = event.data.state;
        render();
      }
    });

    function render() {
      const enabledCount = state.features.filter((feature) => feature.enabled).length;

      featureCount.textContent = enabledCount + '/' + state.features.length;

      featureList.innerHTML = state.features.map((feature) => {
        const css = feature.enabled ? 'featureCard' : 'featureCard disabled';
        const toggleCss = feature.enabled ? 'toggle isOn' : 'toggle';
        const checked = feature.enabled ? 'true' : 'false';
        const commandIds = feature.commandIds || [{ label: 'ID', command: feature.command }];
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
          '<div class="preview">' + escapeHtml(feature.preview) + '</div>' +
          '<div class="actions">' +
            '<button class="actionButton shortcutButton" type="button" data-action="shortcut" data-command="' + escapeHtml(feature.command) + '">' +
              '<span class="subtle">Shortcut</span> <span class="shortcutValue">' + escapeHtml(feature.shortcut) + '</span>' +
            '</button>' +
            commandButtons +
          '</div>' +
        '</article>';
      }).join('');
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
