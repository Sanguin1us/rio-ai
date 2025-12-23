import { useMemo, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Highlight, Language, themes } from 'prism-react-renderer';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ChatMessage, useRioChat } from '../../hooks/useRioChat';
import { normalizeMathDelimiters } from '../../lib/markdown';

const codeTheme = themes.nightOwl;

const ThinkingIndicator = () => (
  <div className="flex justify-center">
    <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.1)] backdrop-blur">
      <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">
        Rio 2
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-rio-primary/85 animate-[pulse_1.6s_ease-in-out_infinite]" />
        <span
          className="h-1.5 w-1.5 rounded-full bg-rio-secondary/80 animate-[pulse_1.6s_ease-in-out_infinite]"
          style={{ animationDelay: '0.25s' }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-rio-accent/75 animate-[pulse_1.6s_ease-in-out_infinite]"
          style={{ animationDelay: '0.5s' }}
        />
      </span>
    </div>
  </div>
);

const renderMathToHtml = (value: string | undefined, displayMode: boolean) => {
  if (!value || value.trim().length === 0) {
    return value ?? '';
  }
  try {
    return katex.renderToString(value, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
    });
  } catch (error) {
    console.error('Failed to render KaTeX expression', error);
    return value;
  }
};

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  const markdownContent = normalizeMathDelimiters(message.content);

  return (
    <div className={`flex px-3 py-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[85%] rounded-2xl border ${isUser
            ? 'border-blue-100 bg-blue-50/90 text-slate-800 shadow-[0_18px_28px_-24px_rgba(0,43,127,0.55)]'
            : 'border-slate-200 bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]'
          } px-4 py-3 text-sm leading-relaxed`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
          components={{
            h1: ({ node: _node, ...props }) => (
              <h1 className="mb-3 text-xl font-bold text-prose first:mt-0" {...props} />
            ),
            h2: ({ node: _node, ...props }) => (
              <h2 className="mb-3 mt-4 text-lg font-semibold text-prose" {...props} />
            ),
            h3: ({ node: _node, ...props }) => (
              <h3 className="mb-2 mt-4 text-base font-semibold text-prose" {...props} />
            ),
            p: ({ node: _node, className, ...props }) => (
              <p
                className={['mb-3 mt-3 text-sm text-prose-light first:mt-0 last:mb-0', className]
                  .filter(Boolean)
                  .join(' ')}
                {...props}
              />
            ),
            strong: ({ node: _node, ...props }) => (
              <strong className="font-semibold text-prose" {...props} />
            ),
            em: ({ node: _node, ...props }) => <em className="italic text-prose-light" {...props} />,
            ul: ({ node: _node, className, ...props }) => (
              <ul
                className={['mb-3 mt-3 list-disc pl-5 text-sm text-prose-light', className]
                  .filter(Boolean)
                  .join(' ')}
                {...props}
              />
            ),
            ol: ({ node: _node, className, ...props }) => (
              <ol
                className={['mb-3 mt-3 list-decimal pl-5 text-sm text-prose-light', className]
                  .filter(Boolean)
                  .join(' ')}
                {...props}
              />
            ),
            li: ({ node: _node, className, children, ...props }) => (
              <li
                className={['mt-1 text-sm leading-relaxed text-prose-light first:mt-0', className]
                  .filter(Boolean)
                  .join(' ')}
                {...props}
              >
                <span>{children}</span>
              </li>
            ),
            blockquote: ({ node: _node, className, ...props }) => (
              <blockquote
                className={[
                  'my-4 border-l-4 border-rio-primary/40 bg-rio-primary/10 px-4 py-2 text-sm text-prose',
                  className,
                ]
                  .filter(Boolean)
                  .join(' ')}
                {...props}
              />
            ),
            hr: () => <hr className="my-4 border border-slate-200/80" />,
            inlineMath: ({ value, children }) => {
              const mathContent =
                typeof value === 'string'
                  ? value
                  : Array.isArray(children)
                    ? children.join('')
                    : children
                      ? String(children)
                      : '';
              return (
                <span
                  className="katex math-inline"
                  dangerouslySetInnerHTML={{
                    __html: renderMathToHtml(mathContent, false),
                  }}
                />
              );
            },
            math: ({ value, children }) => {
              const mathContent =
                typeof value === 'string'
                  ? value
                  : Array.isArray(children)
                    ? children.join('')
                    : children
                      ? String(children)
                      : '';
              return (
                <div
                  className="my-4 overflow-x-auto text-center"
                  dangerouslySetInnerHTML={{
                    __html: renderMathToHtml(mathContent, true),
                  }}
                />
              );
            },
            table: ({ node: _node, className, ...props }) => (
              <div className="my-4 overflow-hidden rounded-lg border border-slate-200">
                <table
                  className={['w-full border-collapse text-left text-sm', className]
                    .filter(Boolean)
                    .join(' ')}
                  {...props}
                />
              </div>
            ),
            thead: ({ node: _node, ...props }) => (
              <thead className="bg-slate-100 text-sm font-semibold text-prose" {...props} />
            ),
            td: ({ node: _node, className, ...props }) => (
              <td
                className={['px-3 py-2 align-top text-sm text-prose-light', className]
                  .filter(Boolean)
                  .join(' ')}
                {...props}
              />
            ),
            th: ({ node: _node, className, ...props }) => (
              <th
                className={['px-3 py-2 text-left text-sm text-prose', className]
                  .filter(Boolean)
                  .join(' ')}
                {...props}
              />
            ),
            a: ({ node: _node, className, ...props }) => (
              <a
                className={[
                  'text-rio-primary underline decoration-2 underline-offset-2 hover:text-blue-800',
                  className,
                ]
                  .filter(Boolean)
                  .join(' ')}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            code: ({ node: _node, inline, className, children, ...props }) => {
              const rawLanguage =
                typeof className === 'string' ? className.replace('language-', '') : '';
              const language = rawLanguage
                ? (rawLanguage.toLowerCase() as Language)
                : ('tsx' as Language);
              const code = String(children).replace(/\s+$/, '');

              if (inline) {
                return (
                  <code
                    className={[
                      'rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700',
                      className,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <div className="my-4 overflow-hidden rounded-xl border border-slate-800/60 bg-[#111827] text-left text-white">
                  <div className="flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-wide text-white/60">
                    <span>{rawLanguage || 'code'}</span>
                  </div>
                  <Highlight theme={codeTheme} code={code} language={language}>
                    {({
                      className: highlightClassName,
                      style,
                      tokens,
                      getLineProps,
                      getTokenProps,
                    }) => (
                      <pre
                        className={`overflow-x-auto px-4 pb-4 pt-2 text-xs leading-relaxed ${highlightClassName ?? ''}`}
                        style={{ ...style, background: 'transparent' }}
                        {...props}
                      >
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token, key })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              );
            },
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export const DetailPlayground: React.FC<{ modelName: string }> = ({ modelName }) => {
  const initialMessages = useMemo<ChatMessage[]>(
    () => [
      {
        role: 'assistant',
        content: `Olá! Você está conversando com o ${modelName}. Como posso ajudar?`,
      },
    ],
    [modelName]
  );

  const { messages, input, setInput, isLoading, handleSubmit } = useRioChat({
    initialMessages,
    systemPrompt: null,
    historyLimit: null,
    errorMessage: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && !isLoading) {
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
  }, [messages, isLoading]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <h3 className="text-lg font-semibold text-prose p-4 border-b border-slate-200">
        Playground Interativo
      </h3>
      <div className="h-80 flex flex-col">
        <div className="flex-1 space-y-2 overflow-y-auto p-2">
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {isLoading && <ThinkingIndicator />}
          <div ref={chatEndRef} />
        </div>
        <div className="border-t border-slate-200 p-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Envie uma mensagem..."
              disabled={isLoading}
              className="w-full flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-rio-primary focus:outline-none focus:ring-1 focus:ring-rio-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-rio-primary text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
