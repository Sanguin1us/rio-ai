import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { AnimateOnScroll } from './AnimateOnScroll';
import { ChatMessage, useRioChat } from '../hooks/useRioChat';

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

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`group relative max-w-[80%] rounded-xl px-4 py-2.5 text-sm text-prose shadow-sm transition ${
          isUser ? 'bg-blue-100 text-right' : 'bg-slate-100'
        }`}
      >
        <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words text-prose [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              a: ({ node, ...anchorProps }) => (
                <a {...anchorProps} rel="noopener noreferrer" target="_blank" />
              ),
              code: ({ inline, className, children, node, ...codeProps }) => {
                if (inline) {
                  return (
                    <code
                      className={`rounded bg-slate-200/80 px-1.5 py-0.5 font-mono ${className ?? ''}`}
                      {...codeProps}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 px-3 py-2 text-white">
                    <code className={`font-mono text-xs ${className ?? ''}`} {...codeProps}>
                      {children}
                    </code>
                  </pre>
                );
              },
              ul: ({ node, className, ...listProps }) => (
                <ul
                  className={`list-disc space-y-2 pl-5 ${className ?? ''}`}
                  {...listProps}
                />
              ),
              ol: ({ node, className, ...listProps }) => (
                <ol
                  className={`list-decimal space-y-2 pl-5 ${className ?? ''}`}
                  {...listProps}
                />
              ),
              li: ({ node, className, ...itemProps }) => (
                <li className={`leading-relaxed ${className ?? ''}`} {...itemProps} />
              ),
              hr: () => <hr className="my-4 border border-slate-300/70" />,
              p: ({ node, className, ...paragraphProps }) => {
                const paragraphClasses = [
                  className,
                  'leading-relaxed',
                  'my-2',
                  'first:mt-0',
                  'last:mb-0',
                  isUser ? 'text-right' : null,
                ]
                  .filter(Boolean)
                  .join(' ');
                return <p className={paragraphClasses} {...paragraphProps} />;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <span className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/40 transition" />
      </div>
    </div>
  );
};

export const ChatSection = () => {
  const { messages, input, setInput, isLoading, handleSubmit } = useRioChat();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && !isLoading) {
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
  }, [messages, isLoading]);

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
                <ChatBubble key={index} message={msg} />
              ))}
              {isLoading && <ThinkingIndicator />}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-slate-200 bg-white p-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
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
