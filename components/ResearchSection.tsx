import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';
import { ArrowRight, Calendar } from 'lucide-react';
import type { ResearchPost } from '../types/index';

const RESEARCH_POSTS: ResearchPost[] = [
  {
    id: '1',
    title: 'Avanços em Modelos de Linguagem para o Português Brasileiro',
    summary:
      'Explorando novas técnicas de tokenização e fine-tuning para melhorar a compreensão e geração de texto em variantes do português.',
    date: '04 Dez 2025',
    imageUrl:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    tags: ['NLP', 'LLM', 'Português'],
  },
  {
    id: '2',
    title: 'Otimizando Inferência em Hardware de Borda',
    summary:
      'Como reduzimos a latência e o consumo de energia dos nossos modelos de visão computacional para implantação em câmeras de segurança.',
    date: '28 Nov 2025',
    imageUrl:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop',
    tags: ['Edge AI', 'Visão Computacional', 'Otimização'],
  },
  {
    id: '3',
    title: 'Rio 2.5: Uma Nova Arquitetura Multimodal',
    summary:
      'Detalhes técnicos sobre a arquitetura do Rio 2.5, combinando processamento de áudio, visão e texto em um único modelo unificado.',
    date: '15 Nov 2025',
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    tags: ['Multimodal', 'Arquitetura', 'Rio 2.5'],
  },
  {
    id: '4',
    title: 'Segurança e Alinhamento em Modelos Públicos',
    summary:
      'Nossas abordagens para garantir que os modelos de IA utilizados no setor público sejam seguros, imparciais e alinhados com os valores cívicos.',
    date: '01 Nov 2025',
    imageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    tags: ['AI Safety', 'Ética', 'Alinhamento'],
  },
];

const ResearchCard: React.FC<{ post: ResearchPost }> = ({ post }) => (
  <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200 h-full">
    <div className="relative h-48 overflow-hidden">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
        <Calendar className="h-3.5 w-3.5" />
        {post.date}
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-rio-primary transition-colors">
        {post.title}
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-slate-600 flex-grow">{post.summary}</p>
      <div className="mt-auto">
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-rio-primary transition-colors group-hover:text-blue-700">
          Ler Artigo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </div>
);

export const ResearchSection: React.FC = () => {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pesquisa & Desenvolvimento
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Acompanhe nossos avanços mais recentes, metodologias de treinamento e descobertas no
            campo da Inteligência Artificial aplicada ao setor público.
          </p>
        </AnimateOnScroll>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {RESEARCH_POSTS.map((post, index) => (
            <AnimateOnScroll key={post.id} delay={index * 100} duration="duration-700">
              <ResearchCard post={post} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
