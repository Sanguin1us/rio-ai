import React from 'react';
import type { Model } from '../../types/index';
import { ArrowLeft } from 'lucide-react';

interface DetailHeaderProps {
  model: Model;
  onBack: () => void;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({ model, onBack }) => {
  return (
    <header className="bg-light-bg border-b border-slate-200 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-prose-light hover:text-rio-primary transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para todos os modelos
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-rio-primary/10 shrink-0">
            <model.Icon className="h-8 w-8 text-rio-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-prose">{model.name}</h1>
            <p className="mt-3 text-lg text-prose-light max-w-3xl">{model.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
