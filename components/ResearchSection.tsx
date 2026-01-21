import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';
import type { ResearchPost } from '../types/index';

const RESEARCH_POSTS: ResearchPost[] = [
  {
    id: 'efficient-cot-language',
    title: 'Creating a Language for Efficient CoT',
    summary:
      'Como desenvolvemos um meta-dialeto simbólico ultra-denso que permite aos modelos Rio realizar raciocínios complexos consumindo até 80% menos tokens do que o Chain-of-Thought em linguagem natural.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/efficient-cot-language.png',
  },
  {
    id: 'jepa-controller',
    title: 'JEPA-Controller',
    summary:
      'A peça que faltava para a autonomia: como o Controller utiliza as capacidades preditivas do Rio-JEPA para planejar e executar sequências complexas de ações no mundo real.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/jepa-controller.png',
  },
  {
    id: 'autoregressive-3d-models',
    title: 'Autoregressive 3D Models',
    summary:
      'Uma nova fronteira em IA generativa espacial, onde modelos Rio aprendem a construir geometrias 3D complexas de forma autorregressiva, prometendo revolucionar o planejamento urbano e o design digital.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/autoregressive-3d-models.png',
  },
  {
    id: 'mastering-voice-and-sound',
    title: 'Mastering Voice and Sound',
    summary:
      'Uma exploração profunda das capacidades de áudio nativas do Rio 3, abordando desde a síntese de voz emocionalmente expressiva até a compreensão de ambientes sonoros complexos em tempo real.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/mastering-voice-and-sound.png',
  },
  {
    id: 'mixture-of-efforts',
    title: 'Mixture-of-Efforts',
    summary:
      'Uma nova taxonomia para modelos de computação adaptativa, onde o modelo decide dinamicamente a profundidade do processamento necessária para cada consulta, otimizando o equilíbrio entre precisão e custo operacional.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/mixture-of-efforts.png',
  },
  {
    id: 'turbo-speculative-decoding',
    title: 'Turbo Speculative Decoding',
    summary:
      'Uma análise profunda de como utilizamos modelos de rascunho ultra-rápidos e verificação paralela para multiplicar a velocidade de geração de nossos modelos carro-chefe em até 3x sem qualquer perda de qualidade.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/turbo-speculative-decoding.png',
  },
  {
    id: 'high-quality-video-editing',
    title: 'High-quality Video Editing',
    summary:
      'Explorando como nossos novos modelos multimodais permitem edição de vídeo assistida por IA com precisão temporal e consistência visual sem precedentes.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/high-quality-video-editing.png',
  },
  {
    id: 'latent-reasoning',
    title: 'Latent Reasoning',
    summary:
      'Uma exploração de como os modelos Rio processam cadeias de pensamento internamente no espaço latente antes de gerar tokens visíveis, permitindo um raciocínio mais profundo sem aumentar o tamanho da janela de contexto.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/latent-reasoning.png',
  },
  {
    id: 'better-4-bit-quantization',
    title: 'Better 4-Bit Quantization',
    summary:
      'Avanços em compressão de modelos que permitem rodar o Rio 3 em GPUs de classe consumidora com perda quase nula de precisão, utilizando técnicas personalizadas de calibração de pesos.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/better-4bit-quantization.png',
  },
  {
    id: 'rio-jepa',
    title: 'Rio-JEPA',
    summary:
      'Uma implementação da Joint-Embedding Predictive Architecture para compreensão de mundo, permitindo que nossos modelos aprendam representações abstratas sem depender de previsão de pixel ou token.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/rio-jepa.png',
  },
  {
    id: 'elastic-vision',
    title: 'Elastic Vision',
    summary:
      'Uma abordagem inovadora para processamento de imagens de resolução variável, onde o modelo adapta dinamicamente sua malha de atenção para focar em detalhes críticos sem o custo computacional de altas resoluções estáticas.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/elastic-vision.png',
    isFeatured: true,
  },
  {
    id: 'test-time-attention',
    title: 'Introduzindo <br /> Test-Time Attention',
    summary:
      'Uma análise técnica sobre como mecanismos de atenção adaptativos durante a inferência permitem que nossos modelos "pensem" mais profundamente antes de responder.',
    content: `
\`\`\`
ATTENTION_ACCURACY_CHART
\`\`\`

Em 12 de Setembro de 2024, a OpenAI introduziu o paradigma de raciocínio aos modelos de linguagem. A partir do o1 preview, as LLMs passaram a ser capazes de pensar sobre suas respostas, abrindo uma frente inteiramente nova de scaling. Hoje, trazemos o Rio 3.0 Preview, que desperta um novo eixo de aprendizado: a capacidade de pensar sobre e reler as perguntas ou, como chamamos essa técnica internamente, Test-Time Attention.

Apesar dos grandes avanços em sua qualidade e sofisticação, todas as LLMs atuais sofrem com um grave problema que atrapalha seu uso no dia a dia: a incapacidade de lidar com textos longos com precisão similar aos curtos. Como podemos observar no gráfico abaixo, o mecanismo de Test-Time Attention permite que superemos esse impasse, relendo o texto múltiplas vezes para capturar cada detalhe e minúcia:

\`\`\`
MANY_NEEDLES_CHART
\`\`\`

\`\`\`
TTA_TYPEWRITER_CALLOUT
\`\`\`

\`\`\`
SPINNING_EARTH_VISUALIZATION
\`\`\`

`,
    date: '10 Jan 2026',
    imageUrl: '/images/research/test-time-attention.png',
    isFeatured: true,
  },
  {
    id: 'on-policy-distillation',
    title: 'On-Policy Distillation',
    summary:
      'Como utilizamos destilação on-policy para transferir capacidades de raciocínio de modelos gigantes para modelos menores e mais eficientes.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/on-policy-distillation.png',
  },
  {
    id: 'constructive-fine-tuning',
    title: 'Constructive Fine-Tuning',
    summary:
      'Uma nova metodologia de treinamento que foca em reforçar caminhos neurais positivos e corrigir inconsistências lógicas de forma estrutural.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/constructive-fine-tuning.png',
  },
  {
    id: 'reinforcement-pre-training',
    title: 'Reinforcement Pre-Training',
    summary:
      'Invertendo o pipeline tradicional ao introduzir sinais de reforço logo no início do pré-treinamento para "embutir" capacidades de raciocínio desde a fundação.',
    content: '',
    date: '11 Jan 2026',
    imageUrl: '/images/research/reinforcement-pre-training.png',
  },
];

export const ResearchSection: React.FC<{ onSelectPost?: (post: ResearchPost) => void }> = ({
  onSelectPost
}) => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <AnimateOnScroll className="mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rio-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rio-primary"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Research Feed</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 font-display">
            Pushing the boundaries of <br className="hidden md:block" />
            <span className="text-rio-primary">Structural Intelligence.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 leading-relaxed font-medium">
            Explore our latest breakthroughs in large-scale model optimization,
            test-time reasoning, and multimodal architectures designed for civic infrastructure.
          </p>
        </AnimateOnScroll>

        {/* Featured Section */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-10 overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Featured Research</h3>
            <div className="h-[1px] w-full bg-slate-100" />
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            {RESEARCH_POSTS.filter(p => p.isFeatured).map((post, index) => (
              <AnimateOnScroll key={post.id} delay={index * 100}>
                <div
                  onClick={() => onSelectPost?.(post)}
                  className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 cursor-pointer h-[500px] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-10">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Featured Paper</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-rio-primary" />
                        <span className="text-[10px] font-bold text-white/60">{post.date}</span>
                      </div>
                      <h4
                        className="text-3xl font-bold text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title }}
                      />
                      <p className="text-white/70 line-clamp-2 text-sm leading-relaxed max-w-md">
                        {post.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Research Index */}
        <div>
          <div className="flex items-center gap-4 mb-12 overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Technical Index</h3>
            <div className="h-[1px] w-full bg-slate-100" />
          </div>
          <div className="grid gap-x-10 gap-y-16 lg:grid-cols-3">
            {RESEARCH_POSTS.filter(p => !p.isFeatured).map((post, index) => (
              <AnimateOnScroll key={post.id} delay={index * 50}>
                <div
                  onClick={() => onSelectPost?.(post)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[16/10] mb-8 overflow-hidden rounded-3xl border border-slate-100 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-900/5">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover grayscale-[0.8] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rio-primary">Technical Report</span>
                    <span className="text-slate-200">/</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{post.date}</span>
                  </div>
                  <h4
                    className="text-xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-rio-primary transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
