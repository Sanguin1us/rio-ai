import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type ChatRole = 'user' | 'assistant';

// Tree node for internal storage
interface TreeNode {
  id: string;
  role: ChatRole;
  content: string;
  parentId: string | null;
  childrenIds: string[];
}

// Exposed message type with branching metadata
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  siblingIndex: number;
  siblingCount: number;
}

interface MessageTree {
  nodes: Map<string, TreeNode>;
  rootIds: string[]; // Multiple roots for conversation forks at the start
  selectedPath: string[]; // Currently selected node IDs from root to leaf
}

interface UseRioChatOptions {
  model?: string;
  apiUrl?: string;
  initialMessages?: Array<{ role: ChatRole; content: string }>;
  systemPrompt?: string | null;
  historyLimit?: number | null;
  errorMessage?: string;
}

const DEFAULT_API_URL = '/api/chat';
const DEFAULT_MODEL = 'rio-2.5';
const DEFAULT_SYSTEM_PROMPT = 'Você é o Rio, um agente de IA desenvolvido na Prefeitura do Rio a partir de modelos chineses. Esse chat é uma demo com cidadãos onde eles podem interagir contigo e conversar sobre qualquer tópico. Seja amigável e respeitoso, sempre buscando atender da melhor maneira possível o cidadão.';
const DEFAULT_HISTORY_LIMIT = 10;
const DEFAULT_ERROR_MESSAGE =
  'Desculpe, ocorreu um erro ao me comunicar com a API. Por favor, tente novamente mais tarde.';

function generateId(): string {
  return crypto.randomUUID();
}

function createEmptyTree(): MessageTree {
  return {
    nodes: new Map(),
    rootIds: [],
    selectedPath: [],
  };
}

// Compute sibling info for a node
function getSiblingInfo(tree: MessageTree, nodeId: string): { index: number; count: number } {
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

// Convert the selected path to a flat messages array
function computeFlatMessages(tree: MessageTree): ChatMessage[] {
  return tree.selectedPath.map((nodeId) => {
    const node = tree.nodes.get(nodeId);
    if (!node) {
      return { id: nodeId, role: 'user' as ChatRole, content: '', siblingIndex: 0, siblingCount: 1 };
    }
    const { index, count } = getSiblingInfo(tree, nodeId);
    return {
      id: node.id,
      role: node.role,
      content: node.content,
      siblingIndex: index,
      siblingCount: count,
    };
  });
}

// Add a node to the tree
function addNode(
  tree: MessageTree,
  role: ChatRole,
  content: string,
  parentId: string | null
): { newTree: MessageTree; newNodeId: string } {
  const newId = generateId();
  const newNode: TreeNode = {
    id: newId,
    role,
    content,
    parentId,
    childrenIds: [],
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

// Get sibling at relative offset
function getSiblingAtOffset(tree: MessageTree, nodeId: string, offset: number): string | null {
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

  return siblings[newIndex];
}

// Recompute selected path after switching to a sibling
function recomputePathFromNode(tree: MessageTree, nodeId: string): string[] {
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
  let lastId = nodeId;
  let lastNode = tree.nodes.get(lastId);
  while (lastNode && lastNode.childrenIds.length > 0) {
    lastId = lastNode.childrenIds[0];
    pathToNode.push(lastId);
    lastNode = tree.nodes.get(lastId);
  }

  return pathToNode;
}

export function useRioChat(options: UseRioChatOptions = {}) {
  const {
    model = DEFAULT_MODEL,
    apiUrl,
    initialMessages = [],
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    historyLimit = DEFAULT_HISTORY_LIMIT,
    errorMessage = DEFAULT_ERROR_MESSAGE,
  } = options;

  const environmentApiUrl =
    (import.meta.env.VITE_RIO_CHAT_PROXY_URL as string | undefined) ??
    (import.meta.env.VITE_APP_RIO_CHAT_PROXY_URL as string | undefined);

  const targetApiUrl = apiUrl ?? environmentApiUrl ?? DEFAULT_API_URL;

  const [tree, setTree] = useState<MessageTree>(() => {
    // Initialize tree from initial messages
    let t = createEmptyTree();
    let parentId: string | null = null;
    const path: string[] = [];

    for (const msg of initialMessages) {
      const { newTree, newNodeId } = addNode(t, msg.role, msg.content, parentId);
      t = newTree;
      path.push(newNodeId);
      parentId = newNodeId;
    }

    return { ...t, selectedPath: path };
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;

  // AbortController for canceling requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Derive flat messages from tree
  const messages = useMemo(() => computeFlatMessages(tree), [tree]);

  // Serialize initial messages for effect dependency
  const serializedInitialMessages = useMemo(
    () => JSON.stringify(initialMessages),
    [initialMessages]
  );

  useEffect(() => {
    // Reinitialize tree from initial messages when they change
    let t = createEmptyTree();
    let parentId: string | null = null;
    const path: string[] = [];

    for (const msg of initialMessages) {
      const { newTree, newNodeId } = addNode(t, msg.role, msg.content, parentId);
      t = newTree;
      path.push(newNodeId);
      parentId = newNodeId;
    }

    setTree({ ...t, selectedPath: path });
  }, [serializedInitialMessages]);

  // Navigate between sibling messages
  const navigateMessage = useCallback((messageId: string, direction: -1 | 1) => {
    setTree((prevTree) => {
      const siblingId = getSiblingAtOffset(prevTree, messageId, direction);
      if (!siblingId) return prevTree;

      const newPath = recomputePathFromNode(prevTree, siblingId);
      return { ...prevTree, selectedPath: newPath };
    });
  }, []);

  // Get the last node in the current path
  const getLastNodeId = useCallback((): string | null => {
    return tree.selectedPath.length > 0
      ? tree.selectedPath[tree.selectedPath.length - 1]
      : null;
  }, [tree.selectedPath]);

  // Remove message at index (for editing - now deprecated, use editAndResubmit)
  const removeMessageAt = useCallback((index: number) => {
    // This is kept for backward compatibility but doesn't modify the tree
    // The editing flow should use editAndResubmit instead
    console.warn('removeMessageAt is deprecated for branching. Use editAndResubmit instead.');
  }, []);

  // Insert message at index (deprecated)
  const insertMessageAt = useCallback((index: number, message: { role: ChatRole; content: string }) => {
    console.warn('insertMessageAt is deprecated for branching.');
  }, []);

  // Stop ongoing request
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // Submit a new message
  const handleSubmit = useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    if (!input.trim() || isLoadingRef.current) return;

    const userContent = input;
    setInput('');
    setIsLoading(true);

    // Add user message to tree
    let currentTree: MessageTree;
    let userNodeId: string;

    setTree((prevTree) => {
      const parentId = prevTree.selectedPath.length > 0
        ? prevTree.selectedPath[prevTree.selectedPath.length - 1]
        : null;

      const { newTree, newNodeId } = addNode(prevTree, 'user', userContent, parentId);
      userNodeId = newNodeId;
      currentTree = {
        ...newTree,
        selectedPath: [...prevTree.selectedPath, newNodeId],
      };
      return currentTree;
    });

    // Wait for state to settle
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Prepare messages for API
    const pathMessages = tree.selectedPath.map((id) => {
      const node = tree.nodes.get(id);
      return node ? { role: node.role, content: node.content } : null;
    }).filter(Boolean) as Array<{ role: string; content: string }>;

    const historySlice =
      typeof historyLimit === 'number' && historyLimit >= 0
        ? pathMessages.slice(-historyLimit)
        : pathMessages;

    const payloadMessages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...historySlice,
      { role: 'user', content: userContent },
    ];

    try {
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      const response = await fetch(targetApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: payloadMessages,
          stream: false,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content?.trim() ?? '';

      if (assistantContent) {
        setTree((prevTree) => {
          // Find the user node we just added (last in path)
          const userParentId = prevTree.selectedPath[prevTree.selectedPath.length - 1];
          const { newTree, newNodeId } = addNode(prevTree, 'assistant', assistantContent, userParentId);
          return {
            ...newTree,
            selectedPath: [...prevTree.selectedPath, newNodeId],
          };
        });
      }
    } catch (error) {
      // Don't show error message if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Failed to fetch from Rio API', error);
      setTree((prevTree) => {
        const userParentId = prevTree.selectedPath[prevTree.selectedPath.length - 1];
        const { newTree, newNodeId } = addNode(prevTree, 'assistant', errorMessage, userParentId);
        return {
          ...newTree,
          selectedPath: [...prevTree.selectedPath, newNodeId],
        };
      });
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, [input, tree, historyLimit, systemPrompt, targetApiUrl, model, errorMessage]);

  // Regenerate response - creates a new sibling branch
  const regenerate = useCallback(
    async (index: number) => {
      if (isLoadingRef.current) return;

      // Find the user message at or before this index
      const targetMessage = messages[index];
      if (!targetMessage) return;

      // Find the user message to regenerate from
      let userMessageIndex = index;
      if (targetMessage.role === 'assistant' && index > 0) {
        userMessageIndex = index - 1;
      }

      const userMessage = messages[userMessageIndex];
      if (!userMessage || userMessage.role !== 'user') return;

      setIsLoading(true);

      // Get the path up to and including the user message
      const pathToUser = tree.selectedPath.slice(0, userMessageIndex + 1);

      // Immediately truncate path to hide the old assistant response
      // This makes the thinking animation appear in place of the old message
      setTree((prevTree) => ({
        ...prevTree,
        selectedPath: pathToUser,
      }));

      // Prepare messages for API
      const historyMessages = pathToUser.map((id) => {
        const node = tree.nodes.get(id);
        return node ? { role: node.role, content: node.content } : null;
      }).filter(Boolean) as Array<{ role: string; content: string }>;

      const historySlice =
        typeof historyLimit === 'number' && historyLimit >= 0
          ? historyMessages.slice(-historyLimit)
          : historyMessages;

      const payloadMessages = [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...historySlice,
      ];

      try {
        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        const response = await fetch(targetApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: payloadMessages,
            stream: false,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        const assistantContent = data.choices?.[0]?.message?.content?.trim() ?? '';

        if (assistantContent) {
          setTree((prevTree) => {
            const userNodeId = pathToUser[pathToUser.length - 1];
            const { newTree, newNodeId } = addNode(prevTree, 'assistant', assistantContent, userNodeId);
            return {
              ...newTree,
              selectedPath: [...pathToUser, newNodeId],
            };
          });
        }
      } catch (error) {
        // Don't show error message if request was aborted
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch from Rio API', error);
        setTree((prevTree) => {
          const userNodeId = pathToUser[pathToUser.length - 1];
          const { newTree, newNodeId } = addNode(prevTree, 'assistant', errorMessage, userNodeId);
          return {
            ...newTree,
            selectedPath: [...pathToUser, newNodeId],
          };
        });
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    },
    [messages, tree, historyLimit, systemPrompt, targetApiUrl, model, errorMessage]
  );

  // Edit a message and create a new branch
  const editAndResubmit = useCallback(
    async (messageId: string, newContent: string) => {
      if (isLoadingRef.current || !newContent.trim()) return;

      // Find the message index
      const messageIndex = tree.selectedPath.indexOf(messageId);
      if (messageIndex === -1) return;

      const node = tree.nodes.get(messageId);
      if (!node || node.role !== 'user') return;

      setIsLoading(true);

      // Path up to the parent of the edited message
      const pathToParent = tree.selectedPath.slice(0, messageIndex);
      const parentId = pathToParent.length > 0 ? pathToParent[pathToParent.length - 1] : null;

      // Create new user node as sibling
      let newUserNodeId: string;
      let treeAfterUser: MessageTree;

      setTree((prevTree) => {
        const { newTree, newNodeId } = addNode(prevTree, 'user', newContent, parentId);
        newUserNodeId = newNodeId;
        treeAfterUser = {
          ...newTree,
          selectedPath: [...pathToParent, newNodeId],
        };
        return treeAfterUser;
      });

      // Wait for state update
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Prepare messages for API
      const historyMessages = pathToParent.map((id) => {
        const n = tree.nodes.get(id);
        return n ? { role: n.role, content: n.content } : null;
      }).filter(Boolean) as Array<{ role: string; content: string }>;

      const historySlice =
        typeof historyLimit === 'number' && historyLimit >= 0
          ? historyMessages.slice(-historyLimit)
          : historyMessages;

      const payloadMessages = [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...historySlice,
        { role: 'user', content: newContent },
      ];

      try {
        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        const response = await fetch(targetApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: payloadMessages,
            stream: false,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        const assistantContent = data.choices?.[0]?.message?.content?.trim() ?? '';

        if (assistantContent) {
          setTree((prevTree) => {
            const userParentId = prevTree.selectedPath[prevTree.selectedPath.length - 1];
            const { newTree, newNodeId } = addNode(prevTree, 'assistant', assistantContent, userParentId);
            return {
              ...newTree,
              selectedPath: [...prevTree.selectedPath, newNodeId],
            };
          });
        }
      } catch (error) {
        // Don't show error message if request was aborted
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch from Rio API', error);
        setTree((prevTree) => {
          const userParentId = prevTree.selectedPath[prevTree.selectedPath.length - 1];
          const { newTree, newNodeId } = addNode(prevTree, 'assistant', errorMessage, userParentId);
          return {
            ...newTree,
            selectedPath: [...prevTree.selectedPath, newNodeId],
          };
        });
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    },
    [tree, historyLimit, systemPrompt, targetApiUrl, model, errorMessage]
  );

  // Legacy editMessage - now calls editAndResubmit
  const editMessage = useCallback((messageId: string, newContent: string) => {
    editAndResubmit(messageId, newContent);
  }, [editAndResubmit]);

  return {
    messages,
    input,
    isLoading,
    setInput,
    removeMessageAt,
    insertMessageAt,
    handleSubmit,
    regenerate,
    navigateMessage,
    editMessage,
    editAndResubmit,
    stop,
  };
}
