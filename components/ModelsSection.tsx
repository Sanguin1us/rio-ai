import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RIO_MODELS } from '../constants';
import { ModelCard } from './ModelCard';
import { AnimateOnScroll } from './AnimateOnScroll';
import { LineageTree } from './LineageTree';
import type { Model } from '../types/index';
import { RIO_1_NODES, RIO_1_5_NODES, RIO_2_NODES, RIO_2_5_NODES } from './lineage-data';

interface ModelsSectionProps {
  onSelectModel: (model: Model) => void;
}

type Generation = '1.0' | '1.5' | '2.0' | '2.5';

export const ModelsSection: React.FC<ModelsSectionProps> = ({ onSelectModel }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedGeneration, setSelectedGeneration] = useState<Generation>('2.5');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const categories = useMemo(
    () => ['Todos', ...new Set(RIO_MODELS.map((model) => model.category))],
    []
  );

  const filteredModels = useMemo(
    () =>
      selectedCategory === 'Todos'
        ? RIO_MODELS
        : RIO_MODELS.filter((model) => model.category === selectedCategory),
    [selectedCategory]
  );

  const currentNodes = useMemo(() => {
    switch (selectedGeneration) {
      case '1.0':
        return RIO_1_NODES;
      case '1.5':
        return RIO_1_5_NODES;
      case '2.0':
        return RIO_2_NODES;
      case '2.5':
        return RIO_2_5_NODES;
      default:
        return RIO_2_5_NODES;
    }
  }, [selectedGeneration]);

  return (
    <section id="modelos" className="bg-light-bg py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-prose sm:text-4xl">
            Nossa Família de Modelos
          </h2>
          <p className="mt-4 text-lg text-prose-light">
            Da fundação à convergência: conheça a evolução da nossa inteligência artificial.
          </p>
        </AnimateOnScroll>

        {/* Interactive Tree Visualization */}
        <AnimateOnScroll delay={100} className="mt-12 mb-16 hidden md:block">
          {/* Generation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-sm">
              {(['1.0', '1.5', '2.0', '2.5'] as Generation[]).map((gen) => (
                <button
                  key={gen}
                  onClick={() => setSelectedGeneration(gen)}
                  className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedGeneration === gen
                      ? 'text-white shadow-md'
                      : 'text-slate-500 hover:text-prose hover:bg-slate-50'
                  }`}
                >
                  {selectedGeneration === gen && (
                    <div className="absolute inset-0 bg-rio-primary rounded-full" />
                  )}
                  <span className="relative z-10">Rio {gen}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-8 overflow-hidden">
            <LineageTree onSelectModel={onSelectModel} nodes={currentNodes} />
          </div>
        </AnimateOnScroll>

        {/* Mobile Fallback / Detailed Grid View */}
        {/* Mobile Fallback / Detailed Grid View */}
        <div className="mt-12">
          {/* Button Toggle Wrapper */}
          <div
            className={`flex justify-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              isCatalogOpen
                ? 'max-h-0 opacity-0 scale-90 overflow-hidden'
                : 'max-h-40 opacity-100 scale-100 py-8'
            }`}
          >
            <button
              onClick={() => setIsCatalogOpen(true)}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-rio-primary via-blue-600 to-rio-primary bg-[length:200%_auto] px-10 py-5 font-semibold text-white shadow-xl transition-all duration-500 hover:bg-[position:right_center] hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-md"></div>
              <div className="flex items-center gap-4 relative z-10">
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-400 border-2 border-white"></span>
                </span>
                <span className="text-xl tracking-wide font-bold text-shadow-sm">
                  Explorar Catálogo Completo
                </span>
                <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                  <ChevronDown className="h-6 w-6 transition-transform duration-500 group-hover:rotate-180" />
                </div>
              </div>
            </button>
          </div>

          {/* Expandable Content Wrapper */}
          <div
            className={`grid transition-[grid-template-rows,opacity,transform] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isCatalogOpen
                ? 'grid-rows-[1fr] opacity-100 translate-y-0'
                : 'grid-rows-[0fr] opacity-0 translate-y-8'
            }`}
          >
            <div className="overflow-hidden min-h-0">
              <div className="pt-8 animate-slideIn">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-2">
                  <button
                    onClick={() => setIsCatalogOpen(false)}
                    className="group flex items-center gap-3 text-2xl font-bold text-prose hover:text-rio-primary transition-colors duration-300"
                  >
                    <span>Catálogo Completo</span>
                    <div className="p-1.5 rounded-full bg-slate-100 group-hover:bg-rio-primary/10 transition-colors">
                      <ChevronUp className="h-6 w-6 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:text-rio-primary" />
                    </div>
                  </button>

                  {/* Category Filter */}
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-xl backdrop-blur-sm">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                          selectedCategory === category
                            ? 'bg-white text-rio-primary shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-8">
                  {filteredModels.map((model, index) => (
                    <AnimateOnScroll key={model.name} delay={index * 50} duration="duration-700">
                      <ModelCard model={model} onSelectModel={onSelectModel} />
                    </AnimateOnScroll>
                  ))}
                </div>

                <div className="flex justify-center pb-8">
                  <button
                    onClick={() => {
                      setIsCatalogOpen(false);
                      // Optional: scroll slightly up if needed, but keeping context is usually better
                      const element = document.getElementById('modelos');
                      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="group flex flex-col items-center gap-2 text-sm font-semibold text-slate-400 hover:text-rio-primary transition-colors duration-300"
                  >
                    <span className="uppercase tracking-widest text-xs">Fechar Visualização</span>
                    <div className="p-3 rounded-full bg-white shadow-md border border-slate-100 group-hover:shadow-lg group-hover:-translate-y-1 transition-all">
                      <ChevronUp className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
