# NAssistant

NAssistant is an AI-neutral context helper for VS Code.

It does not replace Claude, Codex, ChatGPT, Copilot Chat, or any other AI coding tool. Instead, it helps you prepare clean, precise, reusable code context before you paste it into whichever AI you already use.

> NAssistant does not control the AI. It prepares the context you give to the AI.

## Status

NAssistant has an initial VS Code extension with focused context-copying features.

The extension includes a lightweight Activity Bar entry, selection/file reference copy commands, and an assistant paste command with an inline target selector.

## Installation

NAssistant is not published yet.

Installation instructions will be added after the first usable VS Code extension build is available.

## Why

AI coding tools are powerful, but the small actions around them are still messy.

Common friction points:

- You want to share only the selected code, but end up copying too much.
- You manually add file paths, line numbers, and language names every time.
- You prepare slightly different input formats for different AI tools.
- You collect partial context from multiple files by hand.
- You accidentally include irrelevant code, private data, or too much context.

NAssistant focuses on these small but frequent moments.

## Philosophy

NAssistant is intentionally small.

It is not an AI IDE, not a chat client, and not a model wrapper. The goal is to make everyday context-copying workflows fast, predictable, and hard to mess up.

Core principles:

- AI-neutral: no dependency on a specific model, provider, API, or chat UI.
- Clipboard-first: work with the tools and AI surfaces users already have.
- Low interruption: prefer commands, shortcuts, context menus, and status feedback.
- Precise context: preserve file paths and line ranges without copying unnecessary code.
- Small surface area: ship a few sharp features instead of many shallow ones.
- Safety by default: make copied scope visible and reduce accidental over-copying.

## Features

### Copy Selection Location for AI

Normal copy is untouched. `Command+C` on macOS and `Ctrl+C` on Windows/Linux still copy the selected source code exactly as VS Code normally would.

When code is selected in the editor, `Command+Shift+C` on macOS or `Ctrl+Shift+C` on Windows/Linux copies only the selection location as AI-ready context.

Output:

```text
[location: src/example.ts:12-38]
```

The selected source code is not copied by the AI location command. This avoids changing normal paste behavior in editors, documents, terminals, or other non-chat surfaces.

### Copy File Reference

Normal copy is still untouched in the File Explorer. NAssistant does not put file bytes on the system clipboard or pretend to attach files to external AI tools.

When a file is selected in the VS Code Explorer, `Command+Shift+C` on macOS or `Ctrl+Shift+C` on Windows/Linux copies a compact AI-ready file reference.

Output:

```text
[file: src/example.ts]
```

The command is also available from the Explorer context menu.

### Hide Folder from Explorer

When a folder is selected in the VS Code Explorer, the Explorer context menu includes `NAssistant: Hide Folder from Explorer`.

The command updates the current project settings by adding the selected workspace-relative folder path to `files.exclude`. It does not delete, move, or rewrite the folder itself.

To reverse folders hidden through NAssistant, run `NAssistant: Show Hidden Explorer Folders` from the Command Palette and select the folders to restore.

The NAssistant Activity Bar view also includes an `Explorer` tab. It mirrors the workspace file tree, opens files on click, and shows a folder visibility button beside folders. By default, folders hidden through NAssistant remain visible there in a dimmed state while the normal VS Code Explorer hides them.

Use the Explorer tab search field to narrow visible items by name or path. The options button beside search controls whether NAssistant-hidden folders stay visible in this tree and lets you switch the Explorer sort order.

### Paste Context to Assistant

When code is selected in the editor or a file is selected in the VS Code Explorer, `Command+Shift+V` on macOS or `Ctrl+Shift+V` on Windows/Linux builds the same context format and attempts to paste it into the selected assistant input.

The target selector lives inside the `Paste Context to Assistant` card in the NAssistant settings view. `NAssistant: Paste Context to Claude` and `NAssistant: Paste Context to Codex` can still be used directly from the Command Palette.

This command does not submit the message. It writes the generated context to the clipboard, opens the configured target, immediately asks VS Code to paste, and then clears the clipboard.

> **주의**: 이 명령은 코드 본문을 OS 클립보드에 잠시 기록한 뒤 대상 확장에 페이스트하고 클립보드를 비웁니다. 이 짧은 구간 동안 클립보드 매니저(예: Paste, Maccy 등)가 가로채면 코드/경로가 그곳에 저장될 수 있습니다. 민감한 코드를 다룰 때는 클립보드 매니저 동작을 확인하세요.

## Planned Features

### Copy Open Editors Context

Collect context from open editors without blindly copying every full file.

Initial behavior should prefer selected ranges. Full-file copy should be explicit, not accidental.

### Prompt Wrapper Templates

Wrap copied context with a short, reusable instruction.

Examples:

- Review this code.
- Find the likely bug.
- Suggest a focused refactor.
- Explain the selected code.

### Clipboard Safety Feedback

After copying, show a concise summary such as:

```text
3 files, 84 lines copied
```

The user should always know what just went into the clipboard.

## Intended Workflow

NAssistant should fit into normal VS Code usage.

Planned entry points:

- Command Palette commands
- Editor context menu actions
- Keyboard shortcuts
- Status bar feedback
- Optional configuration for output format and templates

The default flow should be simple:

1. Select code in VS Code.
2. Press `Command+Shift+C` on macOS or `Ctrl+Shift+C` on Windows/Linux.
3. Paste the prepared context into any AI tool.

For file-level context, select a file in the Explorer and use the same shortcut.

## Non-Goals

NAssistant should not become:

- A replacement for Cursor, Copilot Chat, Claude, Codex, or ChatGPT.
- A dedicated AI chat interface.
- A direct API wrapper for a specific model provider.
- A large prompt-engineering framework.
- A tool that copies entire projects by default.

## Design Checklist

Before adding a feature, it should pass these questions:

- Is it useful regardless of which AI the user uses?
- Does it improve a small, repeated workflow?
- Does it preserve or clarify code context?
- Does it reduce accidental over-copying or missing context?
- Can it work through existing VS Code surfaces instead of a heavy custom UI?

If the answer is no, the feature probably does not belong in NAssistant.

## Roadmap

- Define the first command set.
- Scaffold the VS Code extension.
- Implement selection-to-context copying.
- Add file reference copying.
- Add copy summaries and safety feedback.
- Add configurable prompt wrapper templates.
- Package and document installation.

## Development

Install dependencies:

```sh
npm install
```

Compile the extension:

```sh
npm run compile
```

Run the extension locally:

1. Open this repository in VS Code.
2. Run the `Run Extension` debug configuration.
3. VS Code will open an Extension Development Host window.

The current extension has an Activity Bar entry, selection/file reference copy commands, and an assistant paste command with an inline target selector.

## Contributing

Contributions are welcome once the extension scaffold is in place.

Good contributions should keep the project focused:

- Prefer small, composable commands.
- Avoid provider-specific AI behavior.
- Keep output formats predictable and easy to paste.
- Add tests for context formatting and range handling.
- Document user-facing behavior in this README.

## License

License information has not been added yet.
