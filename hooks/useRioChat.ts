import { useCallback, useEffect, useMemo, useState } from 'react';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
  // Branching fields (optional for backward compatibility)
  id?: string;
  siblingIndex?: number;
  siblingCount?: number;
}

interface UseRioChatOptions {
  model?: string;
  apiUrl?: string;
  initialMessages?: ChatMessage[];
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

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const serializedInitialMessages = useMemo(
    () => JSON.stringify(initialMessages),
    [initialMessages]
  );

  useEffect(() => {
    setMessages(initialMessages);
  }, [serializedInitialMessages]);

  const removeMessageAt = useCallback(
    (index: number) => {
      setMessages((prev) => {
        if (index < 0 || index >= prev.length) {
          return prev;
        }
        const next = prev.slice(0, index).concat(prev.slice(index + 1));
        return next;
      });
    },
    [setMessages]
  );

  const insertMessageAt = useCallback(
    (index: number, message: ChatMessage) => {
      setMessages((prev) => {
        const safeIndex = Math.min(Math.max(index, 0), prev.length);
        const next = [...prev];
        next.splice(safeIndex, 0, message);
        return next;
      });
    },
    [setMessages]
  );

  const handleSubmit = useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput('');
    setIsLoading(true);

    const currentMessages =
      typeof historyLimit === 'number' && historyLimit >= 0
        ? messages.slice(-historyLimit)
        : messages;

    const payloadMessages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...currentMessages,
      userMessage,
    ];

    try {
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
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.choices?.[0]?.message?.content?.trim() ?? '',
      };

      if (assistantMessage.content) {
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to fetch from Rio API', error);
      const failureMessage: ChatMessage = {
        role: 'assistant',
        content: errorMessage,
      };
      setMessages((prev) => [...prev, failureMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, historyLimit, systemPrompt, targetApiUrl, model, errorMessage]);

  const regenerate = useCallback(
    async (index: number) => {
      if (isLoading) return;

      const messageToRetain = messages[index];
      if (!messageToRetain) return;

      const truncatedMessages = messages.slice(0, index + 1);
      setMessages(truncatedMessages);
      setIsLoading(true);

      const historySlice =
        typeof historyLimit === 'number' && historyLimit >= 0
          ? truncatedMessages.slice(-historyLimit)
          : truncatedMessages;

      const payloadMessages = [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...historySlice,
      ];

      try {
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
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.choices?.[0]?.message?.content?.trim() ?? '',
        };

        if (assistantMessage.content) {
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (error) {
        console.error('Failed to fetch from Rio API', error);
        const failureMessage: ChatMessage = {
          role: 'assistant',
          content: errorMessage,
        };
        setMessages((prev) => [...prev, failureMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      isLoading,
      messages,
      historyLimit,
      systemPrompt,
      targetApiUrl,
      model,
      errorMessage,
    ]
  );

  // Placeholder for future branching - currently no-ops
  const navigateMessage = useCallback((messageId: string, direction: -1 | 1) => {
    // Branching navigation not implemented in this simplified version
  }, []);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    // For now, this is a no-op. The ChatSection handles editing via removeMessageAt.
  }, []);

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
  };
}
