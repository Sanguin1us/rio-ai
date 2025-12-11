import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Send, Copy, Check, Edit3, X, Zap, Sparkles, RefreshCw, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Highlight, Language, themes } from 'prism-react-renderer';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { AnimateOnScroll } from './AnimateOnScroll';
import { ThinkingAnimation } from './ThinkingAnimation';
import { ChatMessage, useRioChat } from '../hooks/useRioChat';
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
    return getNodeText(node.props.children);
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
      : className?.replace('language-', '') ?? '';
  const displayLanguage = (rawLanguage || 'code').toLowerCase();
  const fallbackLanguage: Language = 'tsx';
  const language = rawLanguage.toLowerCase();
  const prismLanguage = language ? (language as Language) : fallbackLanguage;
  const codeTextRaw = getNodeText(children);
  const codeText = codeTextRaw.replace(/\s+$/, '');
  const trimmed = codeText.trim();
  const shouldRenderAsChip =
    !inline &&
    trimmed.length > 0 &&
    trimmed.length <= 40 &&
    !trimmed.includes('\n');

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
    <div className="group relative mt-3 w-full overflow-x-auto rounded-2xl border border-slate-800/80 bg-[radial-gradient(circle_at_top,_#172036,_#090b12)] pb-2 text-white shadow-[0_18px_40px_-24px_rgba(8,10,20,0.9)] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:mx-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-500/60 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400/70 [&::-webkit-scrollbar-button]:hidden">
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
      <Highlight
        theme={codeTheme}
        code={codeText}
        language={prismLanguage}
      >
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

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onEdit, onRegenerate, onFeedback, onNavigate, disableActions }) => {
  const isUser = message.role === 'user';
  const [copiedBubble, setCopiedBubble] = useState(false);
  const bubbleCopyTimeoutRef = useRef<number | null>(null);
  const markdownContent = normalizeMathDelimiters(message.content);

  useEffect(
    () => () => {
      if (bubbleCopyTimeoutRef.current) {
        window.clearTimeout(bubbleCopyTimeoutRef.current);
      }
    },
    []
  );

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

  const actionButtonClass =
    'inline-flex h-8 w-8 items-center justify-center text-slate-400 transition hover:text-rio-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary/50 disabled:opacity-50';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`group flex max-w-[80%] min-w-0 flex-col gap-1 ${isUser ? 'items-end text-left' : 'items-start text-left'
          }`}
      >
        <div
          className={`relative min-w-0 max-w-full overflow-hidden rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm transition ${isUser ? 'bg-rio-primary/10 text-rio-primary' : 'bg-slate-100 text-prose'
            }`}
        >
          <div className="min-w-0 max-w-full whitespace-normal break-words text-[14px] leading-relaxed text-prose [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>*+*]:mt-3">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeKatex]}
              components={{
                a: ({ node, ...anchorProps }) => (
                  <a {...anchorProps} rel="noopener noreferrer" target="_blank" />
                ),
                // @ts-ignore
                code: (props) => <CodeBlock {...props} isUser={isUser} />,
                blockquote: ({ node, className, children, ...blockquoteProps }) => (
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
                ul: ({ node, className, ...listProps }) => (
                  <ul
                    className={['list-disc space-y-2 pl-5', className].filter(Boolean).join(' ')}
                    {...listProps}
                  />
                ),
                ol: ({ node, className, ...listProps }) => (
                  <ol
                    className={['list-decimal space-y-2 pl-5', className].filter(Boolean).join(' ')}
                    {...listProps}
                  />
                ),
                li: ({ node, className, ...itemProps }) => (
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
                table: ({ node, className, children, ...tableProps }) => (
                  <div className="my-4 overflow-x-auto">
                    <table
                      className={[
                        'min-w-full border-collapse text-left text-sm',
                        className,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      {...tableProps}
                    >
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ node, className, ...theadProps }) => (
                  <thead className={['bg-slate-200/80', className].filter(Boolean).join(' ')} {...theadProps} />
                ),
                tbody: ({ node, className, ...tbodyProps }) => (
                  <tbody className={['divide-y divide-slate-200', className].filter(Boolean).join(' ')} {...tbodyProps} />
                ),
                tr: ({ node, className, ...trProps }) => (
                  <tr className={[className, 'odd:bg-white even:bg-slate-50'].filter(Boolean).join(' ')} {...trProps} />
                ),
                th: ({ node, className, ...thProps }) => (
                  <th
                    className={['px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600', className]
                      .filter(Boolean)
                      .join(' ')}
                    {...thProps}
                  />
                ),
                td: ({ node, className, ...tdProps }) => (
                  <td
                    className={['px-3 py-2 align-top text-sm text-slate-700', className].filter(Boolean).join(' ')}
                    {...tdProps}
                  />
                ),
                hr: () => <hr className="my-4 border border-slate-300/70" />,
                p: ({ node, className, ...paragraphProps }) => {
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
  const [isFastModel, setIsFastModel] = useState(false);
  const currentModel = isFastModel ? 'rio-2.5-fast' : 'rio-2.5';

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

  useEffect(() => {
    if (messages.length === 0 && !isLoading) {
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
  }, [messages, isLoading]);

  const handleEditMessage = useCallback(
    (messageId: string, content: string) => {
      if (isLoading) return;
      setEditingState({
        messageId,
        originalContent: content,
      });
      setInput(content);
    },
    [isLoading, setInput]
  );

  const handleCancelEdit = useCallback(() => {
    if (!editingState) return;
    setEditingState(null);
    setInput('');
  }, [editingState, setInput]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    if (editingState) {
      // Create a new branch with the edited content
      editAndResubmit(editingState.messageId, input);
      setEditingState(null);
    } else {
      handleSubmit();
    }
  };

  const handleFeedback = (type: FeedbackType, message: ChatMessage) => {
    setFeedbackState({
      isOpen: true,
      type,
      message,
    });
  };

  const handleFeedbackSubmit = (data: FeedbackData) => {
    console.log('Feedback submitted:', data, feedbackState.message);
    setFeedbackState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <section id="chat" className="bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-prose sm:text-4xl">Converse com o Rio 2.5</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-prose-light">
            Faça uma pergunta para nosso modelo flagship.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={200} className="mt-12 max-w-3xl mx-auto">
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden p-6">
              {messages.map((msg, index) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  disableActions={isLoading}
                  onRegenerate={
                    msg.role === 'user'
                      ? () => regenerate(index)
                      : index > 0 && messages[index - 1].role === 'user'
                        ? () => regenerate(index - 1)
                        : undefined
                  }
                  onEdit={msg.role === 'user' ? () => handleEditMessage(msg.id, msg.content) : undefined}
                  onNavigate={(direction) => navigateMessage(msg.id, direction)}
                  onFeedback={handleFeedback}
                />
              ))}
              {isLoading && <ThinkingAnimation />}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-slate-200 bg-white p-4">
              {editingState && (
                <div className="mb-3 flex items-center justify-between rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <span>Voc&ecirc; est&aacute; editando uma mensagem enviada.</span>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancelar
                  </button>
                </div>
              )}

              <form
                onSubmit={handleFormSubmit}
                className={`group flex items-center gap-2 rounded-2xl border bg-white p-1.5 pl-3 shadow-sm transition-all duration-300 ${isFastModel
                  ? 'border-amber-200 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-500/10'
                  : 'border-slate-200 focus-within:border-rio-primary focus-within:ring-4 focus-within:ring-rio-primary/10'
                  }`}
              >
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsFastModel(!isFastModel)}
                    className={`flex items-center gap-2 rounded-xl py-1.5 pl-2 pr-3 text-xs font-medium transition-all duration-300 hover:bg-slate-100 ${isFastModel ? 'text-amber-600' : 'text-rio-primary'
                      }`}
                    title={isFastModel ? 'Mudar para Rio 2.5 (Alta precisão)' : 'Mudar para Rio 2.5 Flash (Rápido)'}
                  >
                    <div
                      className={`relative flex h-6 w-6 items-center justify-center rounded-lg transition-colors duration-300 ${isFastModel ? 'bg-amber-100' : 'bg-rio-primary/10'
                        }`}
                    >
                      <Sparkles
                        className={`absolute h-3.5 w-3.5 transition-all duration-300 ${isFastModel ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                          }`}
                      />
                      <Zap
                        className={`absolute h-3.5 w-3.5 transition-all duration-300 ${isFastModel ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                          }`}
                      />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
                        Modelo
                      </span>
                      <span className="font-semibold">{isFastModel ? 'Flash' : 'Rio 2.5'}</span>
                    </div>
                    <div className="ml-1 h-3 w-[1px] bg-slate-200" />
                  </button>
                </div>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    editingState
                      ? 'Edite sua mensagem...'
                      : isFastModel
                        ? 'Perguntar para o Flash...'
                        : 'Perguntar para o Rio 2.5...'
                  }
                  className="flex-1 border-none bg-transparent px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                />

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
                    disabled={!input.trim()}
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 ${isFastModel
                      ? 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25'
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
