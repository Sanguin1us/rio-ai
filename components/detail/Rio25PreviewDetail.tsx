import React, { useMemo, useState } from 'react';
import type { Model } from '../../types';
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Activity,
  Layers,
  ShieldCheck,
  Rocket,
} from 'lucide-react';
import { DetailUseCases } from './DetailUseCases';
import { DetailCodeSnippets } from './DetailCodeSnippets';
import { DetailSpecs } from './DetailSpecs';
import { AnimateOnScroll } from '../AnimateOnScroll';

interface Rio25PreviewDetailProps {
  model: Model;
  onBack: () => void;
}

const BENCHMARKS = [
  { metric: 'AIME 2025', base: '85.0', preview: '93.3', latent: '95.0' },
  { metric: 'HMMT 2025', base: '71.4', preview: '80.0', latent: '86.6' },
  { metric: 'GPQA Diamond', base: '73.4', preview: '75.8', latent: '77.2' },
  { metric: 'LiveCodeBench v6', base: '66.0', preview: '69.4', latent: '69.6' },
];

const REASONING_MODES = [
  {
    id: 'explicit',
    label: 'Sem raciocínio latente',
    description:
      'Fluxo tradicional com cadeia de pensamento explícita. Menor latência e custo previsível para integrações.',
    highlights: ['Menor custo', 'Latência reduzida'],
    scores: { AIME: '93.3', HMMT: '80.0', GPQA: '75.8', LiveCodeBench: '69.4' },
  },
  {
    id: 'latent',
    label: 'Com raciocínio latente',
    description:
      'Ativa o mecanismo inspirado no SwiReasoning, permitindo que o modelo pense em espaço latente antes de verbalizar.',
    highlights: ['+6.6 pts no HMMT', 'Melhor para avaliações críticas'],
    scores: { AIME: '95.0', HMMT: '86.6', GPQA: '77.2', LiveCodeBench: '69.6' },
  },
];

const TIMELINE = [
  {
    Icon: Layers,
    title: 'Fundação Qwen3-30B',
    description:
      'Partimos do Qwen3-30B-A3B-Thinking-2507 para preservar raciocínio longo e compatibilidade com pipelines existentes.',
  },
  {
    Icon: ShieldCheck,
    title: 'Reforço proprietário',
    description:
      'Aplicamos técnicas de Reinforcement Learning para ajustar estilo, segurança e alinhamento institucional.',
  },
  {
    Icon: Rocket,
    title: 'Prévia pública',
    description:
      'Disponibilizamos a versão open source para coletar feedback e medir integrações antes do lançamento estável.',
  },
];

const parseScore = (value: string) => Number.parseFloat(value);
const formatDelta = (value: string, base: string) => {
  const delta = parseScore(value) - parseScore(base);
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}`;
};
const RAW_MIN = Math.min(...BENCHMARKS.map((row) => parseScore(row.base)));
const RAW_MAX = Math.max(...BENCHMARKS.map((row) => parseScore(row.latent)));
const SCALE_MIN = Math.max(0, Math.floor((RAW_MIN - 2) / 5) * 5);
const SCALE_MAX = Math.ceil((RAW_MAX + 2) / 5) * 5;
const scaleValue = (value: string) => {
  if (SCALE_MAX === SCALE_MIN) return 0.5;
  const ratio = (parseScore(value) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
  return Math.min(Math.max(ratio, 0), 1);
};
const positionStyle = (value: string) => ({
  left: `${scaleValue(value) * 100}%`,
});
const segmentStyle = (start: string, end: string) => {
  const startRatio = scaleValue(start);
  const endRatio = scaleValue(end);
  const width = Math.abs(endRatio - startRatio) * 100;
  const left = Math.min(startRatio, endRatio) * 100;
  return {
    left: `${left}%`,
    width: `${Math.max(width, 4)}%`,
  };
};
const averageGain = (
  BENCHMARKS.reduce((total, row) => total + (parseScore(row.latent) - parseScore(row.base)), 0) / BENCHMARKS.length
).toFixed(1);
const topMetric = BENCHMARKS.reduce(
  (best, row) => {
    const delta = parseScore(row.latent) - parseScore(row.base);
    return delta > best.delta ? { name: row.metric, delta } : best;
  },
  { name: BENCHMARKS[0].metric, delta: parseScore(BENCHMARKS[0].latent) - parseScore(BENCHMARKS[0].base) },
);

export const Rio25PreviewDetail: React.FC<Rio25PreviewDetailProps> = ({ model, onBack }) => {
  const [activeMode, setActiveMode] = useState<(typeof REASONING_MODES)[number]['id']>('explicit');
  const mode = useMemo(
    () => REASONING_MODES.find((item) => item.id === activeMode) ?? REASONING_MODES[0],
    [activeMode],
  );

  const ScoreBar: React.FC<{ label: string; score: string; baseScore: string }> = ({
    label,
    score,
    baseScore,
  }) => {
    const width = `${Math.min(parseScore(score), 100)}%`;
    const delta = (parseScore(score) - parseScore(baseScore)).toFixed(1);
    const positive = parseFloat(delta) >= 0;

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-prose">
          <span>{label}</span>
          <span>{score}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-rio-primary" style={{ width }} />
        </div>
        <p className="text-xs text-prose-light">Δ {delta} vs base {positive ? '▲' : '▼'}</p>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-prose-light hover:text-rio-primary transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para todos os modelos
          </button>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rio-primary shadow-sm ring-1 ring-slate-200">
                Prévia exclusiva
              </div>
              <h1 className="text-4xl font-bold leading-tight text-prose sm:text-5xl">{model.name}</h1>
              <p className="text-lg text-prose-light leading-relaxed">{model.description}</p>
              <div className="flex flex-wrap gap-2">
                {model.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-rio-primary" />
                    <div>
                      <p className="text-sm font-semibold text-prose">Modelo Base</p>
                      <p className="text-xs text-prose-light">{model.baseModel}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-prose-light">
                    Construído sobre o Qwen3-30B-A3B-Thinking-2507 para preservar raciocínio longo.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-rio-primary" />
                    <div>
                      <p className="text-sm font-semibold text-prose">Reinforcement Learning</p>
                      <p className="text-xs text-prose-light">Métodos proprietários</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-prose-light">
                    Novas políticas de reforço garantem alinhamento institucional e segurança.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-rio-primary/10 blur-2xl" />
              </div>
              <div className="relative flex h-full flex-col gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">Modo dual</p>
                  <h2 className="mt-2 text-2xl font-bold text-prose">Um modelo, duas formas de pensar</h2>
                  <p className="mt-2 text-sm text-prose-light">
                    Alterne entre fluxo padrão e raciocínio latente sem trocar de modelo ou de stack.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {REASONING_MODES.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMode(item.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        activeMode === item.id
                          ? 'border-rio-primary bg-rio-primary/5 text-prose'
                          : 'border-slate-200 text-prose-light hover:border-slate-300'
                      }`}
                    >
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="mt-1 text-xs">{item.highlights[0]}</p>
                    </button>
                  ))}
                </div>
                <div className="space-y-3 rounded-2xl border border-slate-100 bg-white/80 p-4">
                  <ScoreBar label="AIME 2025" score={mode.scores.AIME} baseScore="85.0" />
                  <ScoreBar label="HMMT 2025" score={mode.scores.HMMT} baseScore="71.4" />
                  <ScoreBar label="GPQA" score={mode.scores.GPQA} baseScore="73.4" />
                  <ScoreBar label="LiveCodeBench" score={mode.scores.LiveCodeBench} baseScore="66.0" />
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-prose">
                  <p className="font-semibold text-prose">Ganho prático</p>
                  <p className="mt-1 text-prose-light">
                    Até +10 pontos em AIME e +6.6 pontos em HMMT com o modo latente inspirado no SwiReasoning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-16">
        <AnimateOnScroll>
          <section className="rounded-[40px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                  Benchmarks oficiais
                </p>
                <h2 className="mt-2 text-3xl font-bold text-prose">Rio 2.5 Preview em um único painel</h2>
              </div>
            </div>

            <div className="mt-10 space-y-6">
              {BENCHMARKS.map((row) => (
                <div
                  key={row.metric}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rio-primary">
                      {row.metric}
                    </p>
                  </div>
                  <div className="relative mt-4 h-3 rounded-full bg-slate-100">
                    <div
                      className="absolute inset-y-[3px] rounded-full bg-gradient-to-r from-rio-primary via-rio-primary/70 to-emerald-500"
                      style={segmentStyle(row.base, row.latent)}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0">
                      {[
                        { label: 'Base', value: row.base, className: 'text-slate-600', showValue: true },
                        { label: '+RL', value: row.preview, className: 'text-rio-primary', showValue: false },
                        { label: '+Latente', value: row.latent, className: 'text-emerald-600', showValue: true },
                      ].map((mark) => (
                        <div
                          key={mark.label}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[11px] font-semibold"
                          style={positionStyle(mark.value)}
                        >
                          <div className="relative flex items-center justify-center">
                            {mark.showValue && (
                              <span
                                className={`absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-2 py-0.5 shadow ${mark.className}`}
                              >
                                {mark.value}
                              </span>
                            )}
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-slate-500 shadow">
                              {mark.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                  Pipeline de treinamento
                </p>
                <h2 className="mt-2 text-3xl font-bold text-prose">Do backbone à prévia pública</h2>
              </div>
              <p className="text-sm text-prose-light max-w-lg">
                Cada etapa foi desenhada para preservar raciocínio avançado e aplicar governança antes do lançamento.
              </p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {TIMELINE.map(({ Icon, title, description }) => (
                <div key={title} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <Icon className="h-6 w-6 text-rio-primary" />
                    </span>
                    <p className="text-base font-semibold text-prose">{title}</p>
                  </div>
                  <p className="mt-4 text-sm text-prose-light leading-relaxed">{description}</p>
                  <div className="absolute bottom-0 left-1/2 hidden h-12 w-px translate-y-1/2 bg-slate-200 md:block" />
                </div>
              ))}
            </div>
          </section>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <section className="grid gap-12 lg:grid-cols-5">
            <div className="space-y-12 lg:col-span-3">
              {model.useCases && <DetailUseCases useCases={model.useCases} />}
              {model.codeSnippets && <DetailCodeSnippets snippets={model.codeSnippets} />}
            </div>
            <div className="space-y-12 lg:col-span-2">
              <DetailSpecs model={model} />
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-prose">Por que liberar a prévia?</p>
                <p className="mt-2 text-sm text-prose-light">
                  Queremos que parceiros avaliem o modo latente, antecipem integrações e devolvam feedback antes da versão
                  estável.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-prose-light">
                  <li>• Métricas transparentes para comparações.</li>
                  <li>• Compatível com qualquer fluxo baseado em Qwen3.</li>
                  <li>• Feedback aplicado ao pipeline de RL proprietário.</li>
                </ul>
                <div className="mt-6 space-y-3 text-sm">
                  {model.huggingFaceUrl && (
                    <a
                      href={model.huggingFaceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 font-semibold text-prose transition hover:border-rio-primary/40 hover:text-rio-primary"
                    >
                      Acessar Hugging Face
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                  <a
                    href="https://swireasoning.github.io/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 font-semibold text-prose transition hover:border-rio-primary/40 hover:text-rio-primary"
                  >
                    Ler sobre SwiReasoning
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </AnimateOnScroll>
      </div>
    </div>
  );
};
