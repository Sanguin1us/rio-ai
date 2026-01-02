import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type ChatRole,
  type MessageTree,
  createEmptyTree,
  computeFlatMessages,
  addNode,
  getSiblingAtOffset,
  recomputePathFromNode,
} from '../utils/messageTree';

// Re-export types for consumers
export type { ChatRole, ChatMessage, Attachment } from '../utils/messageTree';

/**
 * Options for configuring the useRioChat hook.
 */
interface UseRioChatOptions {
  /** Model identifier to use (default: 'rio-2.5') */
  model?: string;
  /** API endpoint URL (default: '/api/chat') */
  apiUrl?: string;
  /** Initial messages to populate the conversation */
  initialMessages?: Array<{ role: ChatRole; content: string }>;
  /** System prompt for the AI (null to disable) */
  systemPrompt?: string | null;
  /** Maximum number of messages to include in history (null for unlimited) */
  historyLimit?: number | null;
  /** Custom error message to display on API failures */
  errorMessage?: string;
}

const DEFAULT_API_URL = '/api/chat';
const DEFAULT_MODEL = 'rio-2.5';
const DEFAULT_SYSTEM_PROMPT =
  'Seja amigável e respeitoso, sempre buscando atender da melhor maneira possível. Responda na mesma língua que o usuário estiver usando.';
const DEFAULT_HISTORY_LIMIT = 30;
const DEFAULT_ERROR_MESSAGE =
  'Desculpe, ocorreu um erro ao me comunicar com a API. Por favor, tente novamente mais tarde.';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const _getLastNodeId = useCallback((): string | null => {
    return tree.selectedPath.length > 0 ? tree.selectedPath[tree.selectedPath.length - 1] ?? null : null;
  }, [tree.selectedPath]);

  // Remove message at index (for editing - now deprecated, use editAndResubmit)
  const removeMessageAt = useCallback((_index: number) => {
    // This is kept for backward compatibility but doesn't modify the tree
    // The editing flow should use editAndResubmit instead
  }, []);

  // Insert message at index (deprecated)
  const insertMessageAt = useCallback(
    (_index: number, _message: { role: ChatRole; content: string }) => {
      // Deprecated: use editAndResubmit instead
    },
    []
  );

  // Stop ongoing request
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // Submit a new message
  const handleSubmit = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>, attachments: import('../utils/messageTree').Attachment[] = []) => {
      if (event) {
        event.preventDefault();
      }

      const hasContent = input.trim().length > 0;
      const hasAttachments = attachments && attachments.length > 0;

      if ((!hasContent && !hasAttachments) || isLoadingRef.current) return;

      const userContent = input;
      setInput('');
      setIsLoading(true);

      // Add user message to tree
      let currentTree: MessageTree;
      let _userNodeId: string;

      setTree((prevTree) => {
        const parentId: string | null =
          prevTree.selectedPath.length > 0
            ? (prevTree.selectedPath[prevTree.selectedPath.length - 1] ?? null)
            : null;

        const { newTree, newNodeId } = addNode(prevTree, 'user', userContent, parentId, attachments);
        _userNodeId = newNodeId;
        currentTree = {
          ...newTree,
          selectedPath: [...prevTree.selectedPath, newNodeId],
        };
        return currentTree;
      });

      // Wait for state to settle
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Rebuild history with attachments
      const historyPayload = tree.selectedPath.map(id => {
        const node = tree.nodes.get(id);
        if (!node) return null;

        const contentBlock: any[] = [];

        // Add text content if present
        if (node.content) {
          contentBlock.push({ type: 'text', text: node.content });
        }

        // Add attachments if present
        if (node.attachments && node.attachments.length > 0) {
          node.attachments.forEach(att => {
            if (att.type === 'image') {
              contentBlock.push({
                type: 'image_url',
                image_url: { url: att.dataUrl }
              });
            } else if (att.type === 'file') {
              contentBlock.push({
                type: 'file',
                file: {
                  filename: att.name,
                  file_data: att.dataUrl
                }
              });
            }
          });
        }

        // If simpler text-only message (and no attachments), send as string to be safe/compatible
        // or use array format if we want consistency. Using array format for Rio 3 / consistency.
        if (node.attachments && node.attachments.length > 0) {
          return { role: node.role, content: contentBlock };
        }

        return { role: node.role, content: node.content };
      }).filter(Boolean);

      // We need to apply history limit to this payload
      // Note: historyPayload is derived from the *current* tree state (before update),
      // so it contains previous messages but NOT the new one we just added via setTree.
      const payloadHistorySlice =
        typeof historyLimit === 'number' && historyLimit >= 0
          ? historyPayload.slice(-historyLimit)
          : historyPayload;

      // Construct the current message payload object
      const currentUserMessagePayload: any = { role: 'user', content: userContent };

      if ((attachments && attachments.length > 0) || (userContent && attachments && attachments.length > 0)) {
        const contentBlock: any[] = [];

        // Add text if present
        if (userContent) {
          contentBlock.push({ type: 'text', text: userContent });
        }

        // Add attachments
        if (attachments && attachments.length > 0) {
          attachments.forEach(att => {
            if (att.type === 'image') {
              contentBlock.push({ type: 'image_url', image_url: { url: att.dataUrl } });
            } else if (att.type === 'file') {
              contentBlock.push({ type: 'file', file: { filename: att.name, file_data: att.dataUrl } });
            }
          });
        }

        currentUserMessagePayload.content = contentBlock;
      }

      const payloadMessages = [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...payloadHistorySlice,
        currentUserMessagePayload
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
            const userParentId: string | null = prevTree.selectedPath[prevTree.selectedPath.length - 1] ?? null;
            const { newTree, newNodeId } = addNode(
              prevTree,
              'assistant',
              assistantContent,
              userParentId
            );
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
          const userParentId: string | null = prevTree.selectedPath[prevTree.selectedPath.length - 1] ?? null;
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
    [input, tree, historyLimit, systemPrompt, targetApiUrl, model, errorMessage]
  );

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
      const historyMessages = pathToUser
        .map((id) => {
          const node = tree.nodes.get(id);
          return node ? { role: node.role, content: node.content } : null;
        })
        .filter(Boolean) as Array<{ role: string; content: string }>;

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
            const userNodeId: string | null = pathToUser[pathToUser.length - 1] ?? null;
            const { newTree, newNodeId } = addNode(
              prevTree,
              'assistant',
              assistantContent,
              userNodeId
            );
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
          const userNodeId: string | null = pathToUser[pathToUser.length - 1] ?? null;
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
      const parentId: string | null = pathToParent.length > 0 ? (pathToParent[pathToParent.length - 1] ?? null) : null;

      // Create new user node as sibling
      let _newUserNodeId: string;
      let treeAfterUser: MessageTree;

      setTree((prevTree) => {
        const { newTree, newNodeId } = addNode(prevTree, 'user', newContent, parentId);
        _newUserNodeId = newNodeId;
        treeAfterUser = {
          ...newTree,
          selectedPath: [...pathToParent, newNodeId],
        };
        return treeAfterUser;
      });

      // Wait for state update
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Prepare messages for API
      const historyMessages = pathToParent
        .map((id) => {
          const n = tree.nodes.get(id);
          return n ? { role: n.role, content: n.content } : null;
        })
        .filter(Boolean) as Array<{ role: string; content: string }>;

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
            const userParentId: string | null = prevTree.selectedPath[prevTree.selectedPath.length - 1] ?? null;
            const { newTree, newNodeId } = addNode(
              prevTree,
              'assistant',
              assistantContent,
              userParentId
            );
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
          const userParentId: string | null = prevTree.selectedPath[prevTree.selectedPath.length - 1] ?? null;
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
  const editMessage = useCallback(
    (messageId: string, newContent: string) => {
      editAndResubmit(messageId, newContent);
    },
    [editAndResubmit]
  );

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
