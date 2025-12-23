import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';
import type { Model } from '../types/index';
import { ModelCard } from './ModelCard';

interface OpenSourceSectionProps {
  models: Model[];
  onSelectModel: (model: Model) => void;
}

export const OpenSourceSection: React.FC<OpenSourceSectionProps> = ({ models, onSelectModel }) => {
  return (
    <section id="open-source" className="bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-prose sm:text-4xl">
            <span className="text-rio-primary">Democratizando</span> a IA no Brasil
          </h2>
          <p className="mt-4 text-lg text-prose-light">
            Acreditamos no poder da colaboração para acelerar a inovação. Explore nossos modelos de
            código aberto, licenciados sob CC BY 4.0, e junte-se a nós na construção do futuro da
            inteligência artificial.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 max-w-5xl mx-auto grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {models.map((model, index) => (
            <AnimateOnScroll key={model.name} delay={index * 100}>
              <ModelCard model={model} onSelectModel={onSelectModel} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
