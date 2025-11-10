import React from 'react';
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
  { metric: 'HMMT 2025', base: '71.4', preview: '80.0', latent: '83.3' },
  { metric: 'GPQA Diamond', base: '73.4', preview: '75.8', latent: '77.2' },
  { metric: 'LiveCodeBench v6', base: '66.0', preview: '69.4', latent: '69.6' },
];

type ComparisonMetric = 'gpqa' | 'aime';

type LabelPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type LabelOverride = LabelPosition | Partial<Record<ComparisonMetric, LabelPosition>>;

type ModelComparisonDatum = {
  model: string;
  cost: number;
  gpqa: number;
  aime: number;
  color: string;
  isRio: boolean;
};

const LABEL_POSITION_OVERRIDES: Partial<Record<string, LabelOverride>> = {
  'Gemini 2.5 Pro': 'top-right',
  'Gemini 2.5 Flash': 'bottom-right',
  'Claude Sonnet 4.5': 'bottom-left',
  'Gemini 2.5 Flash-Lite': { gpqa: 'bottom-right' },
};

const MODEL_COMPARISON: ModelComparisonDatum[] = [
  { model: 'Gemini 2.5 Pro', cost: 10, gpqa: 86.4, aime: 88, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5', cost: 10, gpqa: 85.7, aime: 94.6, color: '#9CA3AF', isRio: false },
  { model: 'Rio 2.5 Preview', cost: 0.1, gpqa: 77.2, aime: 95, color: '#1E40AF', isRio: true },
  { model: 'Gemini 2.5 Flash', cost: 2.5, gpqa: 79, aime: 78, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5 mini', cost: 2, gpqa: 82.3, aime: 91.1, color: '#9CA3AF', isRio: false },
  { model: 'Gemini 2.5 Flash-Lite', cost: 0.4, gpqa: 71, aime: 69, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5 nano', cost: 0.4, gpqa: 71.2, aime: 85.2, color: '#9CA3AF', isRio: false },
  { model: 'Claude Sonnet 4.5', cost: 15, gpqa: 83.4, aime: 87, color: '#9CA3AF', isRio: false },
  { model: 'Claude Haiku 4.5', cost: 5, gpqa: 73, aime: 80.7, color: '#9CA3AF', isRio: false },
];

const COST_TICKS = [0.1, 1, 10];
const COST_DOMAIN = {
  min: 0.05,
  max: 30,
};
const DEFAULT_Y_MIN = 65;
const LABEL_POSITION_CONFIG: Record<
  LabelPosition,
  { dx: number; dy: number; anchor: 'start' | 'end' }
> = {
  'top-right': { dx: 12, dy: -12, anchor: 'start' },
  'top-left': { dx: -12, dy: -12, anchor: 'end' },
  'bottom-right': { dx: 12, dy: 16, anchor: 'start' },
  'bottom-left': { dx: -12, dy: 16, anchor: 'end' },
};

const METRIC_CONFIGS: Array<{
  metric: ComparisonMetric;
  label: string;
  yTicks: number[];
  minY?: number;
}> = [
  {
    metric: 'aime',
    label: 'AIME 2025',
    yTicks: [70, 80, 90, 100],
  },
  {
    metric: 'gpqa',
    label: 'GPQA-Diamond',
    yTicks: [70, 80, 90],
    minY: 67,
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
const CHART_DIMENSIONS = { width: 720, height: 340 };
const CHART_PADDING = { top: 20, right: 32, bottom: 60, left: 58 };

const ComparisonChart: React.FC<{
  metric: ComparisonMetric;
  label: string;
  yTicks: number[];
  minY?: number;
}> = ({ metric, label, yTicks, minY }) => {
  const [hovered, setHovered] = React.useState<ModelComparisonDatum | null>(null);
  const { width, height } = CHART_DIMENSIONS;
  const { top, right, bottom, left } = CHART_PADDING;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const logMin = Math.log10(COST_DOMAIN.min);
  const logMax = Math.log10(COST_DOMAIN.max);
  const metricValues = MODEL_COMPARISON.map((item) => item[metric]);
  const domainMinBase = minY ?? DEFAULT_Y_MIN;
  const domainMin = Math.min(domainMinBase, ...metricValues, yTicks[0]);
  const domainMax = Math.max(Math.max(...metricValues), yTicks[yTicks.length - 1]);
  const getX = (cost: number) => {
    const ratio = (Math.log10(cost) - logMin) / Math.max(logMax - logMin, 1);
    return left + ratio * plotWidth;
  };
  const getY = (value: number) => {
    const ratio = (value - domainMin) / Math.max(domainMax - domainMin, 1);
    return height - bottom - ratio * plotHeight;
  };
  const formatCost = (value: number) => {
    if (value >= 1) {
      const formatted = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
      return `$${formatted}`;
    }
    if (value >= 0.1) return `$${value.toFixed(1)}`;
    return `$${value.toFixed(2)}`;
  };
  const resolveLabelPosition = (model: string, defaultAnchor: 'start' | 'end') => {
    const override = LABEL_POSITION_OVERRIDES[model];
    const specific =
      typeof override === 'string' ? override : override?.[metric];
    const fallback: LabelPosition = defaultAnchor === 'end' ? 'top-left' : 'top-right';
    const position = specific ?? (typeof override === 'string' ? override : fallback);
    return LABEL_POSITION_CONFIG[position];
  };
  const formatTooltipScore = (value: number) =>
    Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  const formatTooltipCost = (value: number) => {
    if (value < 1) return `$${value.toFixed(2)}`;
    const fixed = value.toFixed(2);
    return `$${fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed}`;
  };
  const tooltipMetrics = hovered
    ? {
        pointX: getX(hovered.cost),
        pointY: getY(hovered[metric]),
        score: hovered[metric],
      }
    : null;
  const tooltipBox = (() => {
    if (!tooltipMetrics) return null;
    const tooltipWidth = 220;
    const tooltipHeight = 78;
    const xMin = left;
    const xMax = width - right - tooltipWidth;
    const clampedX = Math.min(Math.max(tooltipMetrics.pointX - tooltipWidth / 2, xMin), xMax);
    const clampedY = Math.max(tooltipMetrics.pointY - tooltipHeight - 16, top);
    return {
      ...tooltipMetrics,
      boxX: clampedX,
      boxY: clampedY,
      width: tooltipWidth,
      height: tooltipHeight,
    };
  })();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-5">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.5em] text-rio-primary">{label}</p>
      </div>
      <div className="mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          className="h-80 w-full"
          onMouseLeave={() => setHovered(null)}
        >
          <line
            x1={left}
            y1={height - bottom}
            x2={width - right}
            y2={height - bottom}
            className="stroke-slate-300"
            strokeWidth={1}
          />
          <line
            x1={left}
            y1={top}
            x2={left}
            y2={height - bottom}
            className="stroke-slate-300"
            strokeWidth={1}
          />
          <line
            x1={left}
            y1={height - bottom}
            x2={width - right}
            y2={height - bottom}
            className="stroke-slate-300"
            strokeWidth={1}
          />
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <text
                key={`${metric}-y-${tick}`}
                x={left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[11px] fill-slate-500"
              >
                {tick}
              </text>
            );
          })}
          {COST_TICKS.map((tick) => {
            const x = getX(tick);
            return (
              <text
                key={`${metric}-x-${tick}`}
                x={x}
                y={height - bottom + 18}
                textAnchor="middle"
                className="text-[11px] fill-slate-500"
              >
                {formatCost(tick)}
              </text>
            );
          })}
          <text
            x={(left + width - right) / 2}
            y={height - 8}
            textAnchor="middle"
            className="text-[11px] fill-slate-400"
          >
            Custo por 1M tokens (USD)
          </text>
          {MODEL_COMPARISON.map((item) => {
            const x = getX(item.cost);
            const y = getY(item[metric]);
            const defaultAnchor = x > left + plotWidth * 0.6 ? 'end' : 'start';
            const { dx, dy, anchor } = resolveLabelPosition(item.model, defaultAnchor);
            const labelX = x + dx;
            const labelY = y + dy;
            const radius = item.isRio ? 7 : 5;
            const isBelow = dy >= 0;
            const lineStartX = x + (anchor === 'end' ? -radius : radius);
            const lineStartY = y + (isBelow ? radius : -radius);
            const targetX = labelX;
            const targetY = labelY - (isBelow ? 2 : 4);
            const dxLine = targetX - lineStartX;
            const dyLine = targetY - lineStartY;
            const lineLength = Math.hypot(dxLine, dyLine);
            const shorten = 4;
            const scale =
              lineLength > shorten ? (lineLength - shorten) / lineLength : 0;
            const lineEndX = lineStartX + dxLine * scale;
            const lineEndY = lineStartY + dyLine * scale;
            const isHovered = hovered?.model === item.model;
            const circleRadius = radius + (isHovered ? 2 : 0);
            const faded = Boolean(hovered) && !isHovered;
            return (
              <g
                key={`${metric}-${item.model}`}
                className="cursor-pointer outline-none focus-visible:opacity-100"
                tabIndex={0}
                role="button"
                aria-label={`${item.model} - ${label} ${formatTooltipScore(item[metric])}, custo ${formatTooltipCost(item.cost)} por 1M tokens`}
                onMouseEnter={() => setHovered(item)}
                onFocus={() => setHovered(item)}
                onMouseLeave={() => setHovered(null)}
                onBlur={() => setHovered(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={circleRadius + (item.isRio ? 1 : 0)}
                  fill={item.isRio ? '#1E40AF' : '#FFFFFF'}
                  stroke={item.isRio ? '#1E40AF' : item.color}
                  strokeWidth={item.isRio ? 2.5 : 1.5}
                  opacity={faded ? 0.4 : 1}
                />
                <line
                  x1={lineStartX}
                  y1={lineStartY}
                  x2={lineEndX}
                  y2={lineEndY}
                  className="stroke-slate-300"
                  strokeWidth={1}
                  opacity={faded ? 0.5 : 1}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={anchor}
                  className="text-[11px] font-semibold fill-slate-700"
                  opacity={faded ? 0.5 : 1}
                >
                  {item.model}
                </text>
              </g>
            );
          })}
          {tooltipBox && hovered && (
            <>
              <line
                x1={tooltipBox.pointX}
                y1={tooltipBox.pointY}
                x2={tooltipBox.pointX}
                y2={tooltipBox.boxY + tooltipBox.height}
                className="stroke-slate-300"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <foreignObject
                x={tooltipBox.boxX}
                y={tooltipBox.boxY}
                width={tooltipBox.width}
                height={tooltipBox.height}
                pointerEvents="none"
              >
                <div className="h-full rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg ring-1 ring-black/5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {hovered.model}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {label}:{' '}
                    <span className="text-rio-primary">
                      {formatTooltipScore(tooltipBox.score)}
                    </span>
                  </p>
                  <p className="text-xs text-slate-600">
                    Preco: {formatTooltipCost(hovered.cost)} / 1M tokens
                  </p>
                </div>
              </foreignObject>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};
export const Rio25PreviewDetail: React.FC<Rio25PreviewDetailProps> = ({ model, onBack }) => {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-10 sm:pb-16">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-prose-light hover:text-rio-primary transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para todos os modelos
          </button>

          <div className="mt-6 space-y-10">
            <div className="space-y-6">
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
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-rio-primary/10 blur-2xl" />
              </div>
              <div className="relative flex h-full flex-col gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">Comparativo externo</p>
                  <p className="mt-2 text-sm text-prose-light">
                    Os gráficos mostram o custo por 1M de output tokens no eixo X (escala logarítmica) e as pontuações para os benchmarks AIME 2025 e GPQA-Diamond no eixo Y.
                  </p>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {METRIC_CONFIGS.map((config) => (
                    <ComparisonChart key={config.metric} {...config} />
                  ))}
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












