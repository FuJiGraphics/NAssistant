import type * as vscode from 'vscode';
import { commands, env, window } from 'vscode';

import {
  formatAiContext,
  formatAiFileReferences,
  formatFileReference,
  formatResourcePath
} from './referenceFormat';

export interface ContextBuildResult {
  text: string;
  label: string;
  fileReferences?: string[];
}

export type ContextBuildSource = 'auto' | 'explorer';
export type ExplorerClipboardMode = 'legacy' | 'guarded';

export interface ContextBuildOptions {
  source?: ContextBuildSource;
  explorerClipboardMode?: ExplorerClipboardMode;
}

export function buildSelectionLocationContext(): ContextBuildResult | undefined {
  const editor = window.activeTextEditor;

  if (!editor || editor.selection.isEmpty) {
    return undefined;
  }

  const reference = formatFileReference(editor.document, editor.selection);

  return {
    text: formatAiContext(reference),
    label: reference
  };
}

export async function buildFileReferenceContext(
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[],
  options: ContextBuildOptions = {}
): Promise<ContextBuildResult | undefined> {
  const references = await getFileReferences(resource, selectedResources, options);

  return buildContextFromReferences(references);
}

export async function buildCurrentContext(
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[],
  options: ContextBuildOptions = {}
): Promise<ContextBuildResult | undefined> {
  const explicitResources = getExplicitResources(resource, selectedResources);

  if (explicitResources.length > 0) {
    return buildContextFromReferences(explicitResources.map(formatResourcePath));
  }

  if (options.source === 'explorer') {
    return buildFileReferenceContext(resource, selectedResources, options);
  }

  const selectionContext = buildSelectionLocationContext();

  if (selectionContext) {
    return selectionContext;
  }

  return buildFileReferenceContext(resource, selectedResources, options);
}

async function getFileReferences(
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[],
  options: ContextBuildOptions = {}
): Promise<string[]> {
  const explicitResources = getExplicitResources(resource, selectedResources);

  if (explicitResources.length > 0) {
    return explicitResources.map(formatResourcePath);
  }

  return copyExplorerRelativePaths(options.explorerClipboardMode ?? 'legacy');
}

function getExplicitResources(resource?: vscode.Uri, selectedResources?: vscode.Uri[]): vscode.Uri[] {
  return selectedResources && selectedResources.length > 0 ? selectedResources : resource ? [resource] : [];
}

function buildContextFromReferences(references: string[]): ContextBuildResult | undefined {
  if (references.length === 0) {
    return undefined;
  }

  return {
    text: formatAiFileReferences(references),
    label: references.length === 1 ? references[0] : `${references.length} files`,
    fileReferences: references
  };
}

async function copyExplorerRelativePaths(mode: ExplorerClipboardMode): Promise<string[]> {
  const previousClipboardText = await env.clipboard.readText();

  try {
    if (mode === 'guarded') {
      return copyGuardedClipboardCommandLines('copyRelativeFilePath');
    }

    return copyClipboardCommandLines('copyRelativeFilePath');
  } finally {
    await env.clipboard.writeText(previousClipboardText);
  }
}

async function copyGuardedClipboardCommandLines(command: string): Promise<string[]> {
  const sentinelText = `__NASSISTANT_COPY_RELATIVE_PATH_SENTINEL_${Date.now()}__`;

  try {
    await env.clipboard.writeText(sentinelText);
    await commands.executeCommand(command);

    const copiedText = await env.clipboard.readText();

    if (copiedText === sentinelText) {
      return [];
    }

    return parseCopiedPathLines(copiedText).filter(isGuardedCopiedPathLine);
  } catch {
    return [];
  }
}

async function copyClipboardCommandLines(command: string): Promise<string[]> {
  try {
    await commands.executeCommand(command);
    const copiedText = await env.clipboard.readText();

    return copiedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function parseCopiedPathLines(copiedText: string): string[] {
  return copiedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function isGuardedCopiedPathLine(line: string): boolean {
  return !line.startsWith('[') && !line.startsWith('- ') && !/^https?:\/\//i.test(line);
}
