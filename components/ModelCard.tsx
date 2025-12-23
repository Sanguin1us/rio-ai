import React from 'react';
import type { Model } from '../types/index';
import { ArrowRight } from 'lucide-react';

interface ModelCardProps {
  model: Model;
  onSelectModel: (model: Model) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, onSelectModel }) => {
  const { name, description, Icon, tags, isOpenSource } = model;
  return (
    <div className="flex flex-col rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-rio-primary hover:-translate-y-1 h-full">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rio-primary/10">
              <Icon className="h-6 w-6 text-rio-primary" />
            </div>
            <h3 className="text-xl font-semibold text-prose">{name}</h3>
          </div>
          {isOpenSource && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-200">
              Open Source
            </span>
          )}
        </div>
        <p className="mt-4 text-prose-light text-sm leading-6 flex-grow">{description}</p>
      </div>
      <div className="border-t border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => onSelectModel(model)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-rio-primary transition hover:text-blue-800 group"
          >
            Ver Detalhes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
