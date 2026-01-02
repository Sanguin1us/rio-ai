/**
 * Message Tree Utility
 *
 * This module provides data structures and functions for managing
 * branching conversation trees. It enables features like:
 * - Conversation forking (multiple response branches)
 * - Sibling navigation (switching between alternative responses)
 * - Path selection (navigating through conversation branches)
 *
 * @module utils/messageTree
 */

/**
 * Role of a message in the chat conversation.
 */
export type ChatRole = 'user' | 'assistant';

/**
 * An attachment file (image or PDF).
 */
export interface Attachment {
    id: string;
    type: 'image' | 'file';
    mimeType: string;
    name: string;
    dataUrl: string;
}

/**
 * Internal tree node for storing conversation branches.
 */
export interface TreeNode {
    /** Unique identifier for this node */
    id: string;
    /** Role of the message sender */
    role: ChatRole;
    /** Message content */
    content: string;
    /** Parent node ID (null for root nodes) */
    parentId: string | null;
    /** IDs of child nodes */
    childrenIds: string[];
    /** Optional attachments */
    attachments?: Attachment[];
}

/**
 * A chat message with branching metadata.
 * Exposed to consumers for rendering messages with sibling navigation.
 */
export interface ChatMessage {
    /** Unique identifier for this message */
    id: string;
    /** Role of the message sender */
    role: ChatRole;
    /** Message content (may include markdown) */
    content: string;
    /** Index of this message among its siblings (0-based) */
    siblingIndex: number;
    /** Total number of sibling messages at this position */
    siblingCount: number;
    /** Optional attachments included in the message */
    attachments?: Attachment[];
}

/**
 * Message tree structure for conversation branching.
 */
export interface MessageTree {
    /** Map of node IDs to tree nodes */
    nodes: Map<string, TreeNode>;
    /** IDs of root-level nodes (multiple roots for conversation forks at the start) */
    rootIds: string[];
    /** Currently selected node IDs from root to leaf */
    selectedPath: string[];
}

/**
 * Generates a unique identifier for a new node.
 * @returns A unique string ID
 */
export function generateId(): string {
    return crypto.randomUUID();
}

/**
 * Creates a new empty message tree.
 * @returns An empty MessageTree structure
 */
export function createEmptyTree(): MessageTree {
    return {
        nodes: new Map(),
        rootIds: [],
        selectedPath: [],
    };
}

/**
 * Computes sibling information for a node.
 * @param tree - The message tree
 * @param nodeId - ID of the node to get sibling info for
 * @returns Object with index (0-based position) and count (total siblings)
 */
export function getSiblingInfo(
    tree: MessageTree,
    nodeId: string
): { index: number; count: number } {
    const node = tree.nodes.get(nodeId);
    if (!node) return { index: 0, count: 1 };

    if (node.parentId === null) {
        // Root level: siblings are other roots
        const index = tree.rootIds.indexOf(nodeId);
        return { index: Math.max(0, index), count: tree.rootIds.length };
    }

    const parent = tree.nodes.get(node.parentId);
    if (!parent) return { index: 0, count: 1 };

    const index = parent.childrenIds.indexOf(nodeId);
    return { index: Math.max(0, index), count: parent.childrenIds.length };
}

/**
 * Converts the selected path to a flat array of chat messages.
 * @param tree - The message tree
 * @returns Array of ChatMessage objects for the currently selected path
 */
export function computeFlatMessages(tree: MessageTree): ChatMessage[] {
    return tree.selectedPath.map((nodeId) => {
        const node = tree.nodes.get(nodeId);
        if (!node) {
            return {
                id: nodeId,
                role: 'user' as ChatRole,
                content: '',
                siblingIndex: 0,
                siblingCount: 1,
            };
        }
        const { index, count } = getSiblingInfo(tree, nodeId);
        return {
            id: node.id,
            role: node.role,
            content: node.content,
            siblingIndex: index,
            siblingCount: count,
            attachments: node.attachments,
        };
    });
}

/**
 * Result of adding a node to the tree.
 */
export interface AddNodeResult {
    /** The updated tree with the new node */
    newTree: MessageTree;
    /** ID of the newly created node */
    newNodeId: string;
}

/**
 * Adds a new node to the message tree.
 * @param tree - The current message tree
 * @param role - Role of the message (user or assistant)
 * @param content - Message content
 * @param parentId - ID of the parent node (null for root-level nodes)
 * @returns Object with the new tree and the new node's ID
 */
export function addNode(
    tree: MessageTree,
    role: ChatRole,
    content: string,
    parentId: string | null,
    attachments?: Attachment[]
): AddNodeResult {
    const newId = generateId();
    const newNode: TreeNode = {
        id: newId,
        role,
        content,
        parentId,
        childrenIds: [],
        attachments,
    };

    const newNodes = new Map(tree.nodes);
    newNodes.set(newId, newNode);

    let newRootIds = tree.rootIds;
    if (parentId === null) {
        newRootIds = [...tree.rootIds, newId];
    } else {
        const parent = newNodes.get(parentId);
        if (parent) {
            newNodes.set(parentId, {
                ...parent,
                childrenIds: [...parent.childrenIds, newId],
            });
        }
    }

    return {
        newTree: { ...tree, nodes: newNodes, rootIds: newRootIds },
        newNodeId: newId,
    };
}

/**
 * Gets the sibling node at a relative offset from the given node.
 * @param tree - The message tree
 * @param nodeId - ID of the current node
 * @param offset - Relative offset (-1 for previous, +1 for next)
 * @returns ID of the sibling node, or null if not found
 */
export function getSiblingAtOffset(
    tree: MessageTree,
    nodeId: string,
    offset: number
): string | null {
    const node = tree.nodes.get(nodeId);
    if (!node) return null;

    let siblings: string[];
    if (node.parentId === null) {
        siblings = tree.rootIds;
    } else {
        const parent = tree.nodes.get(node.parentId);
        if (!parent) return null;
        siblings = parent.childrenIds;
    }

    const currentIndex = siblings.indexOf(nodeId);
    if (currentIndex === -1) return null;

    const newIndex = currentIndex + offset;
    if (newIndex < 0 || newIndex >= siblings.length) return null;

    return siblings[newIndex] ?? null;
}

/**
 * Recomputes the selected path after switching to a sibling node.
 * Builds the path from root to the target node, then extends to the leaf
 * by always selecting the first child.
 *
 * @param tree - The message tree
 * @param nodeId - ID of the node to navigate to
 * @returns New selected path as an array of node IDs
 */
export function recomputePathFromNode(tree: MessageTree, nodeId: string): string[] {
    const node = tree.nodes.get(nodeId);
    if (!node) return [];

    // Build path from root to this node
    const pathToNode: string[] = [];
    let current: TreeNode | undefined = node;
    while (current) {
        pathToNode.unshift(current.id);
        current = current.parentId ? tree.nodes.get(current.parentId) : undefined;
    }

    // Extend path to leaf (always select first child)
    let lastId: string = nodeId;
    let lastNode = tree.nodes.get(lastId);
    while (lastNode && lastNode.childrenIds.length > 0) {
        const firstChild = lastNode.childrenIds[0];
        if (!firstChild) break;
        lastId = firstChild;
        pathToNode.push(lastId);
        lastNode = tree.nodes.get(lastId);
    }

    return pathToNode;
}

/**
 * Updates a node's content in the tree.
 * @param tree - The message tree
 * @param nodeId - ID of the node to update
 * @param content - New content for the node
 * @param attachments - Optional new attachments (replaces existing if provided)
 * @returns Updated message tree
 */
export function updateNodeContent(
    tree: MessageTree,
    nodeId: string,
    content: string,
    attachments?: Attachment[]
): MessageTree {
    const node = tree.nodes.get(nodeId);
    if (!node) return tree;

    const newNodes = new Map(tree.nodes);
    newNodes.set(nodeId, {
        ...node,
        content,
        attachments: attachments ?? node.attachments,
    });

    return { ...tree, nodes: newNodes };
}

/**
 * Navigates to a sibling node by updating the selected path.
 * @param tree - The message tree
 * @param nodeId - ID of the current node
 * @param direction - Direction to navigate (-1 for previous, +1 for next)
 * @returns Updated message tree with new selected path, or original if no sibling
 */
export function navigateToSibling(
    tree: MessageTree,
    nodeId: string,
    direction: -1 | 1
): MessageTree {
    const siblingId = getSiblingAtOffset(tree, nodeId, direction);
    if (!siblingId) return tree;

    const newPath = recomputePathFromNode(tree, siblingId);
    return { ...tree, selectedPath: newPath };
}
