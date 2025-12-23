import React, { useState } from 'react';
import type { CodeSnippet } from '../../types/index';
import { Clipboard, Check } from 'lucide-react';

interface DetailCodeSnippetsProps {
  snippets: CodeSnippet[];
}

export const DetailCodeSnippets: React.FC<DetailCodeSnippetsProps> = ({ snippets }) => {
  const [activeLang, setActiveLang] = useState(snippets[0]?.lang || '');
  const [copied, setCopied] = useState(false);

  const activeSnippet = snippets.find((s) => s.lang === activeLang);

  const handleCopy = () => {
    if (activeSnippet) {
      navigator.clipboard.writeText(activeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-prose mb-4">Comece a Usar</h2>
      <div className="rounded-lg border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-light-bg p-2">
          <div className="flex items-center gap-2">
            {snippets.map((snippet) => (
              <button
                key={snippet.lang}
                onClick={() => setActiveLang(snippet.lang)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
                  activeLang === snippet.lang
                    ? 'bg-white shadow-sm text-rio-primary'
                    : 'text-prose-light hover:bg-slate-200'
                }`}
              >
                <snippet.Icon className="h-4 w-4" />
                {snippet.lang}
              </button>
            ))}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition bg-slate-200 hover:bg-slate-300 text-prose-light"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
        {activeSnippet && (
          <div className="bg-slate-900 p-4 text-sm text-white overflow-x-auto">
            <pre>
              <code>{activeSnippet.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
