import React from 'react';
import type { Model } from '../types/index';
import { DetailHeader } from './detail/DetailHeader';
import { DetailPlayground } from './detail/DetailPlayground';
import { DetailUseCases } from './detail/DetailUseCases';
import { DetailCodeSnippets } from './detail/DetailCodeSnippets';
import { DetailSpecs } from './detail/DetailSpecs';
import { AnimateOnScroll } from './AnimateOnScroll';
import { ArrowUpRight } from 'lucide-react';
import { Rio25OpenDetail } from './detail/Rio25OpenDetail';
import { Rio20OpenDetail } from './detail/Rio20OpenDetail';
import { Rio20Detail } from './detail/Rio20Detail';
import { Rio25Detail } from './detail/Rio25Detail';

interface ModelDetailViewProps {
  model: Model;
  onBack: () => void;
}

export const ModelDetailView: React.FC<ModelDetailViewProps> = ({ model, onBack }) => {
  if (model.name === 'Rio 2.5 Open') {
    return <Rio25OpenDetail model={model} onBack={onBack} />;
  }

  if (model.name === 'Rio 2.0 Open') {
    return <Rio20OpenDetail model={model} onBack={onBack} />;
  }

  if (model.name === 'Rio 2.5') {
    return <Rio25Detail model={model} onBack={onBack} />;
  }

  if (model.name === 'Rio 2.0') {
    return <Rio20Detail model={model} onBack={onBack} />;
  }

  return (
    <div className="bg-white">
      <AnimateOnScroll>
        <DetailHeader model={model} onBack={onBack} />
      </AnimateOnScroll>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {model.useCases && (
              <AnimateOnScroll delay={100}>
                <DetailUseCases useCases={model.useCases} />
              </AnimateOnScroll>
            )}
            {model.codeSnippets && (
              <AnimateOnScroll delay={200}>
                <DetailCodeSnippets snippets={model.codeSnippets} />
              </AnimateOnScroll>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-12">
            <AnimateOnScroll delay={300}>
              {model.supportsChat ? (
                <DetailPlayground modelName={model.name} />
              ) : model.huggingFaceUrl ? (
                <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50/60 to-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-prose">Explore no Hugging Face</h3>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 ring-1 ring-inset ring-green-200">
                      Open Source
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-prose-light leading-relaxed">
                    Acesse nosso modelo aberto no Hugging Face, explore a documentação e veja como
                    usá-lo em minutos.
                  </p>
                  <a
                    href={model.huggingFaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-rio-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rio-primary"
                  >
                    Abrir repositório
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-prose">Demo interativa indisponível</h3>
                  <p className="mt-2 text-sm text-prose-light">
                    O chat ao vivo está disponível apenas para o modelo flagship Rio 2.0 Omni.
                  </p>
                </div>
              )}
            </AnimateOnScroll>
            <AnimateOnScroll delay={400}>
              <DetailSpecs model={model} />
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
};
