/**
 * Core type definitions for the Rio-AI application.
 * Consolidated from types.ts and various component files.
 */

import type { LucideIcon } from 'lucide-react';

// ============================================================================
// Navigation Types
// ============================================================================

/**
 * Application view/route type.
 * Previously duplicated in App.tsx, Header.tsx, and Hero.tsx.
 */
export type View = 'home' | 'chat' | 'opensource' | 'research';

// ============================================================================
// Model Types
// ============================================================================

export interface UseCase {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export interface CodeSnippet {
  lang: string;
  code: string;
  Icon: LucideIcon;
}

export interface DatasetLink {
  label: string;
  url: string;
}

export interface Model {
  name: string;
  description: string;
  category: string;
  Icon: LucideIcon;
  tags: string[];
  isOpenSource?: boolean;
  supportsChat?: boolean;

  // Detailed view fields
  baseModel?: string;
  baseModelUrl?: string;
  parameters?: string;
  license?: string;
  licenseUrl?: string;
  datasets?: string[];
  datasetLinks?: DatasetLink[];
  useCases?: UseCase[];
  codeSnippets?: CodeSnippet[];
  huggingFaceUrl?: string;
}

// ============================================================================
// Chat Types
// ============================================================================

export type ChatRole = 'user' | 'assistant' | 'system';

/**
 * Exposed message type with branching metadata.
 * Used by components consuming chat data.
 */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  siblingIndex: number;
  siblingCount: number;
}

/**
 * Internal tree node for message storage.
 * Used by useRioChat hook for conversation branching.
 */
export interface TreeNode {
  id: string;
  role: ChatRole;
  content: string;
  parentId: string | null;
  childrenIds: string[];
}

/**
 * Message tree structure for conversation branching.
 */
export interface MessageTree {
  nodes: Map<string, TreeNode>;
  rootIds: string[];
  selectedPath: string[];
}

// ============================================================================
// Research Types
// ============================================================================

export interface ResearchPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  tags: string[];
}
