import React, { useState, useEffect, useRef } from 'react';

const lines = [
  { text: '$ rio-evolve run --task "circle_packing_32"', type: 'command' },
  {
    text: '[Briefing]: objetivo = acomodar 32 circulos; restricoes = raio minimo e area fixa do container.',
    type: 'log',
  },
  { text: '[Seed pool]: 3 layouts campeoes recuperados do arquivo evolutivo.', type: 'log' },
  { text: '[Omni 32B]: geracao inicial concluida — 8 candidatos prontos para avaliacao.', type: 'log' },
  { text: '[Variation::mutate]: layout A2 ajustou angulos com restricoes geometricas locais.', type: 'dispatch' },
  { text: '[Variation::recombine]: layout B1 herdou trechos dos campeoes 2024 e 2023.', type: 'dispatch' },
  { text: '[Evaluator]: medindo folgas, simetria e aproveitamento de area...', type: 'agent' },
  { text: '[Evaluator]: B1 melhora o aproveitamento em 12.4% usando apenas 15 amostras.', type: 'success' },
  { text: '[Scoreboard]: ranking parcial → B1 > A2 > seed_alpha. geracoes restantes: 2.', type: 'log' },
  { text: '[Variation::distill]: criando layout C0 combinando os dois melhores.', type: 'dispatch' },
  { text: '[Evaluator]: stress test de tolerancia de raio...', type: 'agent' },
  { text: '[Evaluator]: C0 atinge packing rate de 92.1% e estabilidade maxima.', type: 'success' },
  { text: '[Archive]: C0 promovido a campeao v2025.03 e salvo para reuso futuro.', type: 'log' },
  {
    text: '[Rio 2.0 Evolve]: layout exportado para producao e registrado na memoria.',
    type: 'log-bold',
  },
  { text: '$ ciclo finalizado com sucesso.', type: 'command' },
];

const TerminalAnimation: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleLines(0);

          const timeouts: ReturnType<typeof setTimeout>[] = [];
          lines.forEach((_, index) => {
            const delay = index * 300 + Math.random() * 200;
            timeouts.push(
              setTimeout(() => {
                setVisibleLines((prev) => prev + 1);
              }, delay)
            );
          });

          if (ref.current) {
            observer.unobserve(ref.current);
          }

          return () => {
            timeouts.forEach(clearTimeout);
          };
        }
      },
      { threshold: 0.6 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getLineClass = (type: string) => {
    switch (type) {
      case 'command':
        return 'text-green-400';
      case 'log':
        return 'text-slate-400';
      case 'log-bold':
        return 'text-white font-semibold';
      case 'dispatch':
        return 'text-cyan-400';
      case 'agent':
        return 'text-yellow-400 pl-4';
      case 'success':
        return 'text-green-400 pl-4';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div
      ref={ref}
      className="w-full h-96 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl p-4 font-mono text-sm overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
      </div>
      <div className="overflow-y-auto h-[calc(100%-28px)] no-scrollbar">
        {lines.slice(0, visibleLines).map((line, index) => (
          <div key={index} className="flex items-center">
            <p className={`whitespace-nowrap ${getLineClass(line.type)}`}>{line.text}</p>
            {index === visibleLines - 1 && index < lines.length - 1 && (
              <span className="ml-2 h-4 w-2 bg-green-400 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalAnimation;
