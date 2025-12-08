import React from 'react';
import { Database, Layers } from 'lucide-react';
import { AnimateOnScroll } from './AnimateOnScroll';

export const TechDetailsSection = () => {
  return (
    <section id="detalhes" className="bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-prose sm:text-4xl">
            Fundamentos Técnicos
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-prose-light">
            Nossos modelos são construídos sobre bases sólidas e treinados com datasets de alta qualidade.
          </p>
        </AnimateOnScroll>
        <div className="mt-16 max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <AnimateOnScroll>
            <div className="p-8 rounded-lg bg-light-bg border border-slate-200 h-full">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rio-primary/10">
                  <Layers className="h-6 w-6 text-rio-primary" />
                </div>
                <h3 className="text-xl font-semibold text-prose">Modelos Base</h3>
              </div>
              <p className="mt-4 text-prose-light">
                Utilizamos a robusta arquitetura da família Qwen 2.5 como ponto de partida para o pós-treinamento dos nossos principais modelos, garantindo uma base de alta performance.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>
                  <span className="font-semibold text-rio-primary">Rio 2.0:</span> Pós-treinado do Qwen 2.5 32B
                </li>
                <li>
                  <span className="font-semibold text-rio-primary">Rio 2.0 Preview:</span> Pós-treinado do Qwen 2.5 14B
                </li>
                <li>
                  <span className="font-semibold text-rio-primary">Rio 2.5:</span> Pós-treinado do Qwen 3 Next
                </li>
                <li>
                  <span className="font-semibold text-rio-primary">Rio 2.5 Preview:</span> Pós-treinado do Qwen 3 30B-A3B Thinking 2507
                </li>
              </ul>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <div className="p-8 rounded-lg bg-light-bg border border-slate-200 h-full">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rio-primary/10">
                  <Database className="h-6 w-6 text-rio-primary" />
                </div>
                <h3 className="text-xl font-semibold text-prose">Conjuntos de Dados</h3>
              </div>
              <p className="mt-4 text-prose-light">
                O treinamento foi realizado com datasets de ponta, cuidadosamente filtrados para evitar contaminação com conjuntos de teste e garantir uma avaliação justa.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>nvidia/OpenScienceReasoning-2</li>
                <li>nvidia/Nemotron-Post-Training-Dataset-v1</li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};
