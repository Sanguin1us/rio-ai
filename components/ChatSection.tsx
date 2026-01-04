import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Send,
  Copy,
  Check,
  Edit3,
  X,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Square,
  Paperclip,
  FileText,
  Loader2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Highlight, Language, themes } from 'prism-react-renderer';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { AnimateOnScroll } from './AnimateOnScroll';
import { ThinkingAnimation } from './ThinkingAnimation';
import { ChatMessage, useRioChat, Attachment } from '../hooks/useRioChat';
import { normalizeMathDelimiters } from '../lib/markdown';
import { FeedbackModal, FeedbackType, FeedbackData } from './FeedbackModal';

const codeTheme = themes.nightOwl;

const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }
  if (React.isValidElement(node)) {
    return getNodeText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
};

interface ChatBubbleProps {
  message: ChatMessage;
  onEdit?: () => void;
  onRegenerate?: () => void;
  onFeedback?: (type: FeedbackType, message: ChatMessage) => void;
  onNavigate?: (direction: -1 | 1) => void;
  disableActions?: boolean;
  isEditing?: boolean;
  editContent?: string;
  onEditContentChange?: (content: string) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
}

const CodeBlock: React.FC<{
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  node?: {
    lang?: string | null;
  };
  isUser: boolean;
}> = ({ inline, className, children, node, isUser, ...codeProps }) => {
  const [codeCopied, setCodeCopied] = useState(false);
  const codeCopyTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (codeCopyTimeoutRef.current) {
        window.clearTimeout(codeCopyTimeoutRef.current);
      }
    },
    []
  );

  const rawLanguage =
    typeof node?.lang === 'string' && node.lang.trim().length > 0
      ? node.lang.trim()
      : (className?.replace('language-', '') ?? '');
  const displayLanguage = (rawLanguage || 'code').toLowerCase();
  const fallbackLanguage: Language = 'tsx';
  const language = rawLanguage.toLowerCase();
  const prismLanguage = language ? (language as Language) : fallbackLanguage;
  const codeTextRaw = getNodeText(children);
  const codeText = codeTextRaw.replace(/\s+$/, '');
  const trimmed = codeText.trim();
  const shouldRenderAsChip =
    !inline && trimmed.length > 0 && trimmed.length <= 40 && !trimmed.includes('\n');

  const handleCopyCode = useCallback(async () => {
    if (!codeText || typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(codeText);
      setCodeCopied(true);
      if (codeCopyTimeoutRef.current) {
        window.clearTimeout(codeCopyTimeoutRef.current);
      }
      codeCopyTimeoutRef.current = window.setTimeout(() => setCodeCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy code block', error);
    }
  }, [codeText]);

  if (inline) {
    return (
      <code
        className={['rounded bg-slate-200/80 px-1.5 py-0.5 font-mono', className]
          .filter(Boolean)
          .join(' ')}
        {...codeProps}
      >
        {children}
      </code>
    );
  }

  if (shouldRenderAsChip) {
    const chipBase =
      'inline-flex items-center justify-center rounded-[6px] border font-mono text-[11px] leading-snug shadow-sm';
    const chipPadding = 'px-1 py-[1px]';
    const chipStyles = isUser
      ? 'border-white/60 bg-white/80 text-rio-primary'
      : 'border-slate-300/80 bg-slate-100 text-slate-700';

    return <span className={`${chipBase} ${chipPadding} ${chipStyles}`}>{trimmed}</span>;
  }

  return (
    <div className="group relative mt-3 w-full overflow-x-auto rounded-2xl border border-slate-800/80 bg-[radial-gradient(circle_at_top,_#172036,_#090b12)] pb-2 text-white shadow-[0_18px_40px_-24px_rgba(8,10,20,0.9)] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#090b12] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb:hover]:bg-slate-500 [&::-webkit-scrollbar-corner]:bg-[#090b12] [&::-webkit-scrollbar-button]:hidden">
      <div className="absolute top-1.5 left-4 right-4 flex items-center justify-between text-[11px] font-semibold text-white/70">
        <span className="inline-flex items-center rounded-full bg-white/8 px-2.5 py-1 backdrop-blur">
          {displayLanguage}
        </span>
        <button
          type="button"
          onClick={handleCopyCode}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/80 opacity-0 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group-hover:opacity-100"
          aria-label="Copiar bloco de código"
        >
          {codeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <Highlight theme={codeTheme} code={codeText} language={prismLanguage}>
        {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`overflow-x-auto px-4 pb-4 pt-12 text-sm leading-relaxed ${highlightClassName}`}
            style={{
              ...style,
              background: 'transparent',
              margin: 0,
            }}
            {...codeProps}
          >
            {(() => {
              const visibleTokens = tokens.slice();
              while (visibleTokens.length > 0) {
                const lastLine = visibleTokens[visibleTokens.length - 1];
                if (!lastLine) break;
                const lastLineContent = lastLine.map((token) => token.content).join('');
                if (lastLineContent.trim().length === 0) {
                  visibleTokens.pop();
                } else {
                  break;
                }
              }
              return visibleTokens;
            })().map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onEdit,
  onRegenerate,
  onFeedback,
  onNavigate,
  disableActions,
  isEditing,
  editContent,
  onEditContentChange,
  onSaveEdit,
  onCancelEdit,
}) => {
  const isUser = message.role === 'user';
  const [copiedBubble, setCopiedBubble] = useState(false);
  const bubbleCopyTimeoutRef = useRef<number | null>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const markdownContent = normalizeMathDelimiters(message.content);

  useEffect(
    () => () => {
      if (bubbleCopyTimeoutRef.current) {
        window.clearTimeout(bubbleCopyTimeoutRef.current);
      }
    },
    []
  );

  // Focus and resize textarea when entering edit mode
  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = `${Math.min(editTextareaRef.current.scrollHeight, 200)}px`;
    }
  }, [isEditing]);

  const handleCopyMessage = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedBubble(true);
      if (bubbleCopyTimeoutRef.current) {
        window.clearTimeout(bubbleCopyTimeoutRef.current);
      }
      bubbleCopyTimeoutRef.current = window.setTimeout(() => setCopiedBubble(false), 1500);
    } catch (error) {
      console.error('Failed to copy chat message', error);
    }
  }, [message.content]);

  const attachments = message.attachments || [];

  const actionButtonClass =
    'inline-flex h-8 w-8 items-center justify-center text-slate-400 transition hover:text-rio-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary/50 disabled:opacity-50';

  // Inline editing UI for user messages
  if (isEditing && isUser) {
    return (
      <div data-message-id={message.id} className="flex justify-end w-full">
        <div className="w-full max-w-[90%] flex flex-col gap-2">
          <div className="rounded-2xl border-2 border-rio-primary/40 bg-white p-3 shadow-sm">
            <textarea
              ref={editTextareaRef}
              value={editContent}
              onChange={(e) => {
                onEditContentChange?.(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (editContent?.trim()) {
                    onSaveEdit?.();
                  }
                }
                if (e.key === 'Escape') {
                  onCancelEdit?.();
                }
              }}
              className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 resize-none max-h-[200px] overflow-y-auto"
              style={{ minHeight: '40px' }}
              rows={1}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Editar a mensagem ramificará o chat.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onSaveEdit}
                disabled={!editContent?.trim()}
                className="px-4 py-1.5 text-sm font-medium text-white bg-rio-primary hover:bg-rio-primary/90 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-message-id={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`group flex max-w-[80%] min-w-0 flex-col gap-1 ${isUser ? 'items-end text-left' : 'items-start text-left'
          }`}
      >
        {attachments.length > 0 && (
          <div className={`flex flex-wrap gap-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {attachments.map((att) => (
              <div key={att.id} className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                {att.type === 'image' ? (
                  <img src={att.dataUrl} alt={att.name} className="h-48 w-auto object-cover max-w-[200px]" />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-xs font-medium text-slate-700 max-w-[150px]" title={att.name}>{att.name}</span>
                      <span className="text-[10px] text-slate-500 uppercase">PDF</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div
          className={`relative min-w-0 max-w-full overflow-hidden rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm transition ${isUser ? 'bg-rio-primary/10 text-rio-primary' : 'bg-slate-100 text-prose'
            }`}
        >
          <div className="min-w-0 max-w-full whitespace-normal break-words text-[14px] leading-relaxed text-prose [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>*+*]:mt-3">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeKatex]}
              components={{
                a: ({ node: _node, ...anchorProps }) => (
                  <a {...anchorProps} rel="noopener noreferrer" target="_blank" />
                ),
                // @ts-expect-error - react-markdown types don't include inline prop
                code: (props) => <CodeBlock {...props} isUser={isUser} />,
                blockquote: ({ node: _node, className, children, ...blockquoteProps }) => (
                  <blockquote
                    className={[
                      className,
                      'border-l-4 border-slate-300/70 bg-slate-100/60 px-4 py-2 italic text-prose-light',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    {...blockquoteProps}
                  >
                    {children}
                  </blockquote>
                ),
                ul: ({ node: _node, className, ...listProps }) => (
                  <ul
                    className={['list-disc space-y-2 pl-5', className].filter(Boolean).join(' ')}
                    {...listProps}
                  />
                ),
                ol: ({ node: _node, className, ...listProps }) => (
                  <ol
                    className={['list-decimal space-y-2 pl-5', className].filter(Boolean).join(' ')}
                    {...listProps}
                  />
                ),
                li: ({ node: _node, className, ...itemProps }) => (
                  <li
                    className={[
                      'leading-relaxed',
                      'marker:text-rio-primary/80',
                      '[&>p:first-child]:mt-0',
                      '[&>p:first-child]:mb-1',
                      '[&>p:last-child]:mb-0',
                      className,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    {...itemProps}
                  />
                ),
                table: ({ node: _node, className, children, ...tableProps }) => (
                  <div className="my-4 overflow-x-auto">
                    <table
                      className={['min-w-full border-collapse text-left text-sm', className]
                        .filter(Boolean)
                        .join(' ')}
                      {...tableProps}
                    >
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ node: _node, className, ...theadProps }) => (
                  <thead
                    className={['bg-slate-200/80', className].filter(Boolean).join(' ')}
                    {...theadProps}
                  />
                ),
                tbody: ({ node: _node, className, ...tbodyProps }) => (
                  <tbody
                    className={['divide-y divide-slate-200', className].filter(Boolean).join(' ')}
                    {...tbodyProps}
                  />
                ),
                tr: ({ node: _node, className, ...trProps }) => (
                  <tr
                    className={[className, 'odd:bg-white even:bg-slate-50']
                      .filter(Boolean)
                      .join(' ')}
                    {...trProps}
                  />
                ),
                th: ({ node: _node, className, ...thProps }) => (
                  <th
                    className={[
                      'px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600',
                      className,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    {...thProps}
                  />
                ),
                td: ({ node: _node, className, ...tdProps }) => (
                  <td
                    className={['px-3 py-2 align-top text-sm text-slate-700', className]
                      .filter(Boolean)
                      .join(' ')}
                    {...tdProps}
                  />
                ),
                hr: () => <hr className="my-4 border border-slate-300/70" />,
                p: ({ node: _node, className, ...paragraphProps }) => {
                  const paragraphClasses = [
                    className,
                    'mt-2',
                    'mb-2',
                    'first:mt-0',
                    'last:mb-0',
                    'leading-relaxed',
                  ]
                    .filter(Boolean)
                    .join(' ');
                  return <p className={paragraphClasses} {...paragraphProps} />;
                },
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
          <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/0 transition group-hover:border-white/40" />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium transition-opacity duration-200 ${isUser
            ? 'justify-end text-rio-primary opacity-0 group-hover:opacity-100'
            : 'justify-start text-slate-500 opacity-0 group-hover:opacity-100'
            }`}
        >
          {!isUser && (
            <button
              type="button"
              onClick={handleCopyMessage}
              disabled={disableActions || copiedBubble}
              className={actionButtonClass}
              aria-label="Copiar mensagem"
              title="Copiar mensagem"
            >
              {copiedBubble ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          )}

          {!isUser && onFeedback && (
            <>
              <button
                type="button"
                onClick={() => onFeedback('positive', message)}
                disabled={disableActions}
                className={actionButtonClass}
                aria-label="Dar feedback positivo"
                title="Dar feedback positivo"
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onFeedback('negative', message)}
                disabled={disableActions}
                className={actionButtonClass}
                aria-label="Dar feedback negativo"
                title="Dar feedback negativo"
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
            </>
          )}

          {!isUser && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={disableActions}
              className={actionButtonClass}
              aria-label="Tentar novamente"
              title="Tentar novamente"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}

          {isUser && onRegenerate ? (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={disableActions}
              className={actionButtonClass}
              aria-label="Tentar novamente"
              title="Tentar novamente"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          ) : null}

          {isUser && onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              disabled={disableActions}
              className={actionButtonClass}
              aria-label="Editar mensagem"
              title="Editar mensagem"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          ) : null}

          {isUser && (
            <button
              type="button"
              onClick={handleCopyMessage}
              disabled={disableActions || copiedBubble}
              className={actionButtonClass}
              aria-label="Copiar mensagem"
              title="Copiar mensagem"
            >
              {copiedBubble ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          )}

          {message.siblingCount > 1 && onNavigate && (
            <div className="flex items-center gap-1 ml-2 text-slate-400 select-none">
              <button
                type="button"
                onClick={() => onNavigate(-1)}
                disabled={disableActions || message.siblingIndex <= 0}
                className="hover:text-rio-primary disabled:opacity-30 disabled:hover:text-slate-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-[10px] tabular-nums font-semibold min-w-[20px] text-center">
                {message.siblingIndex + 1}/{message.siblingCount}
              </span>

              <button
                type="button"
                onClick={() => onNavigate(1)}
                disabled={disableActions || message.siblingIndex >= message.siblingCount - 1}
                className="hover:text-rio-primary disabled:opacity-30 disabled:hover:text-slate-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type EditingState = {
  messageId: string;
  originalContent: string;
};

type FeedbackState = {
  isOpen: boolean;
  type: FeedbackType;
  message?: ChatMessage;
};

export const ChatSection = () => {
  const [selectedModelId, setSelectedModelId] = useState<'rio-2.5' | 'rio-2.5-fast' | 'rio-3.0-preview'>('rio-3.0-preview');
  const currentModel = selectedModelId;

  const chatModels = [
    {
      id: 'rio-2.5' as const,
      name: 'Rio 2.5',
      description: 'Alta precisão',
    },
    {
      id: 'rio-2.5-fast' as const,
      name: 'Rio 2.5 Flash',
      description: 'Respostas rápidas',
    },
    {
      id: 'rio-3.0-preview' as const,
      name: 'Rio 3',
      description: 'Estado da arte',
    },
  ];

  const currentModelData = chatModels.find((m) => m.id === selectedModelId) || chatModels[0];
  if (!currentModelData) throw new Error("Default model not found");
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
    regenerate,
    navigateMessage,
    editAndResubmit,
    stop,
  } = useRioChat({
    model: currentModel,
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    isOpen: false,
    type: 'positive',
  });

  const [selectedFiles, setSelectedFiles] = useState<Attachment[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process files (shared between input and drag-drop)
  const processFiles = async (files: File[]) => {
    if (selectedModelId !== 'rio-3.0-preview') return;

    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
    const validFiles = files.filter(f => validTypes.includes(f.type));

    if (validFiles.length === 0) return;

    setIsUploadingFiles(true);
    const newAttachments: Attachment[] = [];

    for (const file of validFiles) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const type = file.type.startsWith('image/') ? 'image' : 'file';

      newAttachments.push({
        id: crypto.randomUUID(),
        type,
        mimeType: file.type,
        name: file.name,
        dataUrl: base64
      });
    }

    setSelectedFiles(prev => [...prev, ...newAttachments]);
    setIsUploadingFiles(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedModelId === 'rio-3.0-preview') {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (selectedModelId !== 'rio-3.0-preview') return;

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Clear files when switching models, just to be safe/clean
  useEffect(() => {
    if (selectedModelId !== 'rio-3.0-preview') {
      setSelectedFiles([]);
    }
  }, [selectedModelId]);

  useEffect(() => {
    if (messages.length === 0 && !isLoading) {
      return;
    }

    const chatContainer = chatEndRef.current?.parentElement;
    if (!chatContainer) return;

    // When loading (awaiting response), scroll so the last user message is at the top
    // This creates space below for the AI response, like Claude's UX
    if (isLoading) {
      const lastUserMessageIndex = messages.findLastIndex(m => m.role === 'user');
      if (lastUserMessageIndex !== -1) {
        const messageElements = chatContainer.querySelectorAll('[data-message-id]');
        const lastUserMessageEl = messageElements?.[lastUserMessageIndex] as HTMLElement | undefined;

        if (lastUserMessageEl) {
          // Calculate the scroll position to put the message at the top of the container
          const messageTop = lastUserMessageEl.offsetTop;
          chatContainer.scrollTo({
            top: messageTop - 16, // 16px padding from top
            behavior: 'smooth'
          });
          return;
        }
      }
    }

    // Default: scroll to bottom with smooth animation
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isLoading]);

  const handleEditMessage = useCallback(
    (messageId: string, content: string) => {
      if (isLoading) return;
      setEditingState({
        messageId,
        originalContent: content,
      });
    },
    [isLoading]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingState(null);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingState) return;
    editAndResubmit(editingState.messageId, editingState.originalContent);
    setEditingState(null);
  }, [editingState, editAndResubmit]);

  const handleEditContentChange = useCallback((content: string) => {
    setEditingState(prev => prev ? { ...prev, originalContent: content } : null);
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if ((!input.trim() && selectedFiles.length === 0) || isLoading || editingState) return;

    handleSubmit(undefined, selectedFiles);
    setSelectedFiles([]);
  };

  const handleFeedback = (type: FeedbackType, message: ChatMessage) => {
    setFeedbackState({
      isOpen: true,
      type,
      message,
    });
  };

  const handleFeedbackSubmit = (_data: FeedbackData) => {
    // TODO: Implement feedback submission to backend API
    setFeedbackState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <section id="chat" className="bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-prose sm:text-4xl">
            Converse com o {currentModelData.name}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-prose-light">
            {selectedModelId === 'rio-3.0-preview'
              ? 'Experimente o futuro com nosso modelo mais avançado até agora.'
              : 'Faça uma pergunta para nosso modelo flagship.'}
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={200} className="mt-12 max-w-3xl mx-auto">
          <div
            className={`relative flex min-h-[400px] max-h-[70vh] h-[500px] flex-col rounded-lg border bg-white shadow-sm transition-all duration-300 ${isDraggingOver && selectedModelId === 'rio-3.0-preview'
              ? 'border-indigo-400 ring-4 ring-indigo-500/20'
              : 'border-slate-200'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drag overlay */}
            {isDraggingOver && selectedModelId === 'rio-3.0-preview' && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-indigo-50/90 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 text-indigo-600">
                  <Paperclip className="h-8 w-8" />
                  <span className="text-sm font-medium">Solte o arquivo aqui</span>
                </div>
              </div>
            )}
            <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden p-6">
              {messages.map((msg, index) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  disableActions={isLoading || !!editingState}
                  onRegenerate={
                    msg.role === 'user'
                      ? () => regenerate(index)
                      : index > 0 && messages[index - 1]?.role === 'user'
                        ? () => regenerate(index - 1)
                        : undefined
                  }
                  onEdit={
                    msg.role === 'user' ? () => handleEditMessage(msg.id, msg.content) : undefined
                  }
                  onNavigate={(direction) => navigateMessage(msg.id, direction)}
                  onFeedback={handleFeedback}
                  isEditing={editingState?.messageId === msg.id}
                  editContent={editingState?.messageId === msg.id ? editingState.originalContent : undefined}
                  onEditContentChange={handleEditContentChange}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              ))}
              {isLoading && <ThinkingAnimation modelName={currentModelData.name} />}
              {/* Spacer to allow scrolling the last message to the top during loading */}
              <div ref={chatEndRef} className={isLoading ? 'min-h-[300px]' : ''} />
            </div>
            <div className="border-t border-slate-200 bg-white p-4">
              {selectedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedFiles.map((file) => (
                    <div key={file.id} className="relative group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm pr-8">
                      {file.type === 'image' ? (
                        <div className="flex items-center gap-2 p-1">
                          <img src={file.dataUrl} alt={file.name} className="h-10 w-10 rounded object-cover" />
                          <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">{file.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">{file.name}</span>
                            <span className="text-[10px] text-slate-500 uppercase">PDF</span>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form
                onSubmit={handleFormSubmit}
                className={`group relative flex items-center gap-2 rounded-2xl border bg-white p-1.5 pl-3 shadow-sm transition-all duration-300 ${selectedModelId === 'rio-2.5-fast'
                  ? 'border-amber-200 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-500/10'
                  : selectedModelId === 'rio-3.0-preview'
                    ? 'border-indigo-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10'
                    : 'border-slate-200 focus-within:border-rio-primary focus-within:ring-4 focus-within:ring-rio-primary/10'
                  }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                />

                {selectedModelId === 'rio-3.0-preview' && (
                  <button
                    type="button"
                    onClick={() => !isUploadingFiles && fileInputRef.current?.click()}
                    disabled={isUploadingFiles}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isUploadingFiles ? 'Carregando...' : 'Adicionar imagem ou PDF'}
                  >
                    {isUploadingFiles ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Paperclip className="h-5 w-5" />
                    )}
                  </button>
                )}

                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Auto-resize the textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                  }}
                  onKeyDown={(e) => {
                    // Submit on Enter (without Shift)
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if ((input.trim() || selectedFiles.length > 0) && !isLoading) {
                        const form = e.currentTarget.closest('form');
                        if (form) form.requestSubmit();
                      }
                    }
                  }}
                  placeholder={`Perguntar para o ${currentModelData.name}...`}
                  rows={1}
                  className="flex-1 border-none bg-transparent px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 resize-none max-h-[200px] overflow-y-auto"
                  style={{ minHeight: '40px' }}
                />

                {/* Model selector on the right, Claude-style */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsModelMenuOpen(false);
                      } else if (e.key === 'ArrowDown' && !isModelMenuOpen) {
                        e.preventDefault();
                        setIsModelMenuOpen(true);
                      }
                    }}
                    className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100"
                    title="Mudar de modelo"
                    aria-haspopup="listbox"
                    aria-expanded={isModelMenuOpen}
                  >
                    <span className="font-medium">{currentModelData.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isModelMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsModelMenuOpen(false)}
                      />
                      <div
                        className="absolute bottom-full right-0 z-20 mb-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
                        role="listbox"
                        onKeyDown={(e) => {
                          const currentIndex = chatModels.findIndex(m => m.id === selectedModelId);
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            const nextIndex = (currentIndex + 1) % chatModels.length;
                            setSelectedModelId(chatModels[nextIndex].id);
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            const prevIndex = (currentIndex - 1 + chatModels.length) % chatModels.length;
                            setSelectedModelId(chatModels[prevIndex].id);
                          } else if (e.key === 'Escape' || e.key === 'Enter') {
                            setIsModelMenuOpen(false);
                          }
                        }}
                        tabIndex={0}
                        ref={(el) => el?.focus()}
                      >
                        {chatModels.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setSelectedModelId(m.id);
                              setIsModelMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50 ${selectedModelId === m.id ? 'bg-slate-50' : ''
                              }`}
                            role="option"
                            aria-selected={selectedModelId === m.id}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-800">{m.name}</span>
                              <span className="text-xs text-slate-500">{m.description}</span>
                            </div>
                            {selectedModelId === m.id && (
                              <Check className="h-4 w-4 text-rio-primary shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {isLoading ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      stop();
                    }}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-red-500 px-3 text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25"
                    aria-label="Interromper"
                  >
                    <Square className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">Parar</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() && selectedFiles.length === 0}
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-500 disabled:pointer-events-none disabled:opacity-50 ${selectedModelId === 'rio-2.5-fast'
                      ? 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25'
                      : selectedModelId === 'rio-3.0-preview'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25'
                        : 'bg-rio-primary text-white hover:bg-rio-primary/90 hover:shadow-lg hover:shadow-rio-primary/25'
                      }`}
                    aria-label="Enviar mensagem"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                )}
              </form>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
      <FeedbackModal
        isOpen={feedbackState.isOpen}
        onClose={() => setFeedbackState((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleFeedbackSubmit}
        type={feedbackState.type}
      />
    </section>
  );
};
