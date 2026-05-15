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
  selectedResources?: vscode.Uri[]
): Promise<ContextBuildResult | undefined> {
  const references = await getFileReferences(resource, selectedResources);

  if (references.length === 0) {
    return undefined;
  }

  return {
    text: formatAiFileReferences(references),
    label: references.length === 1 ? references[0] : `${references.length} files`
  };
}

export async function buildCurrentContext(
  resource?: vscode.Uri,
  selectedResources?: vscode.Uri[]
): Promise<ContextBuildResult | undefined> {
  const explicitResources = getExplicitResources(resource, selectedResources);

  if (explicitResources.length > 0) {
    return buildContextFromReferences(explicitResources.map(formatResourcePath));
  }

  const selectionContext = buildSelectionLocationContext();

  if (selectionContext) {
    return selectionContext;
  }

  return buildFileReferenceContext(resource, selectedResources);
}

async function getFileReferences(resource?: vscode.Uri, selectedResources?: vscode.Uri[]): Promise<string[]> {
  const explicitResources = getExplicitResources(resource, selectedResources);

  if (explicitResources.length > 0) {
    return explicitResources.map(formatResourcePath);
  }

  return copyExplorerRelativePaths();
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
    label: references.length === 1 ? references[0] : `${references.length} files`
  };
}

async function copyExplorerRelativePaths(): Promise<string[]> {
  const previousClipboardText = await env.clipboard.readText();

  try {
    await commands.executeCommand('copyRelativeFilePath');
    const copiedText = await env.clipboard.readText();

    return copiedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  } finally {
    await env.clipboard.writeText(previousClipboardText);
  }
}
