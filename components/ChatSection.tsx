import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Send, Copy, Check, Edit3, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Highlight, Language, themes } from 'prism-react-renderer';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { AnimateOnScroll } from './AnimateOnScroll';
import { ChatMessage, useRioChat } from '../hooks/useRioChat';
import { normalizeMathDelimiters } from '../lib/markdown';

const codeTheme = themes.nightOwl;

const ThinkingIndicator = () => (
  <div className="flex justify-center">
    <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-2 shadow-[0_10px_28px_rgba(15,23,42,0.12)] backdrop-blur">
      <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">
        Rio 2
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-full bg-rio-primary/85 animate-[pulse_1.6s_ease-in-out_infinite]"
        />
        <span
          className="h-2 w-2 rounded-full bg-rio-secondary/80 animate-[pulse_1.6s_ease-in-out_infinite]"
          style={{ animationDelay: '0.25s' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-rio-accent/75 animate-[pulse_1.6s_ease-in-out_infinite]"
          style={{ animationDelay: '0.5s' }}
        />
      </span>
    </div>
  </div>
);

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
  disableActions?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onEdit, disableActions }) => {
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

  const CodeBlock: React.FC<{
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
    node?: {
      lang?: string | null;
    };
  }> = ({ inline, className, children, node, ...codeProps }) => {
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
      <div className="group relative mt-3 overflow-hidden rounded-2xl border border-slate-800/80 bg-[radial-gradient(circle_at_top,_#172036,_#090b12)] text-white shadow-[0_18px_40px_-24px_rgba(8,10,20,0.9)]">
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

  const actionButtonClass =
    'inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300/70 bg-white/90 text-slate-500 shadow-sm transition hover:border-rio-primary/60 hover:text-rio-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary/50 disabled:opacity-50';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[80%] flex-col gap-1 ${
          isUser ? 'items-end text-left' : 'items-start text-left'
        }`}
      >
        <div
          className={`group relative rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm transition ${
            isUser ? 'bg-rio-primary/10 text-rio-primary' : 'bg-slate-100 text-prose'
          }`}
        >
        <div className="max-w-none whitespace-normal break-words text-[14px] leading-relaxed text-prose [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>*+*]:mt-3">
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
            components={{
              a: ({ node, ...anchorProps }) => (
                <a {...anchorProps} rel="noopener noreferrer" target="_blank" />
              ),
              code: CodeBlock,
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
          className={`flex items-center gap-1 text-xs font-medium ${
            isUser ? 'justify-end text-rio-primary' : 'justify-start text-slate-500'
          }`}
        >
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
        </div>
      </div>
    </div>
  );
};

type EditingState = {
  index: number;
  userMessage: ChatMessage;
  assistantMessage?: ChatMessage;
};

export const ChatSection = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
    removeMessageAt,
    insertMessageAt,
  } = useRioChat();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [editingState, setEditingState] = useState<EditingState | null>(null);

  useEffect(() => {
    if (messages.length === 0 && !isLoading) {
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
  }, [messages, isLoading]);

  const handleEditMessage = useCallback(
    (index: number) => {
      if (isLoading) return;
      const targetMessage = messages[index];
      if (!targetMessage || targetMessage.role !== 'user') {
        return;
      }

      const possibleAssistantReply =
        index + 1 < messages.length && messages[index + 1]?.role === 'assistant'
          ? messages[index + 1]
          : undefined;

      setEditingState({
        index,
        userMessage: targetMessage,
        assistantMessage: possibleAssistantReply,
      });
      setInput(targetMessage.content);

      if (possibleAssistantReply) {
        removeMessageAt(index + 1);
      }
      removeMessageAt(index);
    },
    [isLoading, messages, removeMessageAt, setInput]
  );

  const handleCancelEdit = useCallback(() => {
    if (!editingState) return;

    insertMessageAt(editingState.index, editingState.userMessage);
    if (editingState.assistantMessage) {
      insertMessageAt(editingState.index + 1, editingState.assistantMessage);
    }
    setEditingState(null);
    setInput('');
  }, [editingState, insertMessageAt, setInput]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    handleSubmit();
    if (editingState) {
      setEditingState(null);
    }
  };

  return (
    <section id="chat" className="bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-prose sm:text-4xl">Converse com o Rio 2.0</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-prose-light">
            Faça uma pergunta para nosso modelo flagship.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={200} className="mt-12 max-w-3xl mx-auto">
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {messages.map((msg, index) => (
                <ChatBubble
                  key={`${index}-${msg.role}`}
                  message={msg}
                  disableActions={isLoading}
                  onEdit={msg.role === 'user' ? () => handleEditMessage(index) : undefined}
                />
              ))}
              {isLoading && <ThinkingIndicator />}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-slate-200 bg-white p-4">
              {editingState && (
                <div className="mb-3 flex items-center justify-between rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <span>Voc&ecirc; est&aacute; editando uma mensagem enviada.</span>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:text-rio-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary/60"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancelar
                  </button>
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    editingState ? 'Edite sua mensagem e envie novamente...' : 'Digite sua mensagem aqui...'
                  }
                  disabled={isLoading}
                  className="w-full flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm placeholder:text-slate-500 focus:border-rio-primary focus:outline-none focus:ring-1 focus:ring-rio-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-500 transition-colors hover:bg-rio-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Enviar mensagem"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};
