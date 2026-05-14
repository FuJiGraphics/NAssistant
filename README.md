# NAssistant

NAssistant is an AI-neutral context helper for VS Code.

It does not replace Claude, Codex, ChatGPT, Copilot Chat, or any other AI coding tool. Instead, it helps you prepare clean, precise, reusable code context before you paste it into whichever AI you already use.

> NAssistant does not control the AI. It prepares the context you give to the AI.

## Status

NAssistant is in the early design stage.

This repository currently documents the product direction and intended behavior. Implementation details will be added as the VS Code extension is built.

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
- Precise context: preserve file paths, line ranges, language IDs, and selected code.
- Small surface area: ship a few sharp features instead of many shallow ones.
- Safety by default: make copied scope visible and reduce accidental over-copying.

## Planned Features

### Copy Selection as AI Context

Copy the current selection with file metadata and a fenced code block.

Planned output:

````text
File: src/example.ts
Lines: 12-38

```ts
export function example() {
  // selected code
}
```
````

### Copy File Reference

Copy a compact reference to the current file or selected range.

Example:

```text
src/example.ts:12-38
```

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
2. Run an NAssistant copy command.
3. Paste the prepared context into any AI tool.

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

Development setup will be documented once the extension scaffold is added.

Expected future documentation:

- Required Node.js version
- Install command
- Local extension launch instructions
- Test command
- Packaging command

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
