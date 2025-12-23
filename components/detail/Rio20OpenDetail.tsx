import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Model } from '../../types/index';
import {
    ArrowLeft,
    ArrowUpRight,
    Bolt,
    Box,
    Dumbbell,
    Goal,
    Library,
    Route,
    Sparkles,
} from 'lucide-react';
import { ComparisonChart } from './ComparisonChart';
import {
    ComparisonMetric,
    LabelOverride,
    ModelComparisonDatum,
} from '../../types/chart';
import { DetailUseCases } from './DetailUseCases';
import { DetailCodeSnippets } from './DetailCodeSnippets';
import { DetailSpecs } from './DetailSpecs';
import { AnimateOnScroll } from '../AnimateOnScroll';

interface Rio20OpenDetailProps {
    model: Model;
    onBack: () => void;
}

const BENCHMARKS: Array<{ metric: string; score: string; note?: string }> = [
    { metric: 'GPQA Diamond', score: '75.1' },
    { metric: 'AIME 2025', score: '88.1' },
    { metric: 'AIME 2024', score: '91.6' },
    { metric: 'MMLU Pro', score: '76.9' },
    { metric: 'HLE (text)', score: '12.8' },
];

interface ConnectorLayout {
    width: number;
    height: number;
    baseBottom: number;
    baseCenter: number;
    pretrainTop: number;
    pretrainCenter: number;
    pretrainBottom: number;
    routerTop: number;
    routerCenter: number;
    routerBottom: number;
    cardTop: number;
    cardBottom: number;
    rioTop: number;
    cardCenters: number[];
}

const LABEL_POSITION_OVERRIDES: Partial<Record<string, LabelOverride>> = {
    'Gemini 3 Pro': 'top-left',
    'GPT-5.2': 'bottom-right',
    'Gemini 3 Flash': 'bottom-right',
    'Claude Sonnet 4.5': 'bottom-left',
    'Gemini 2.5 Flash-Lite': { gpqa: 'bottom-right' },
    'GPT-5 mini': { aime: 'bottom-right' },
};

const MODEL_COMPARISON: ModelComparisonDatum[] = [
    { model: 'Gemini 3 Pro', cost: 12, gpqa: 91.9, aime: 95.0, color: '#9CA3AF', isRio: false },
    { model: 'GPT-5.2', cost: 14, gpqa: 92.4, aime: 100.0, color: '#9CA3AF', isRio: false },
    { model: 'Rio 2.0 Open', cost: 0.15, gpqa: 75.1, aime: 88.1, color: '#1E40AF', isRio: true },
    { model: 'Gemini 3 Flash', cost: 3, gpqa: 90.4, aime: 95.2, color: '#9CA3AF', isRio: false },
    { model: 'GPT-5 mini', cost: 2, gpqa: 82.3, aime: 91.1, color: '#9CA3AF', isRio: false },
    { model: 'Gemini 2.5 Flash-Lite', cost: 0.4, gpqa: 71, aime: 69, color: '#9CA3AF', isRio: false },
    { model: 'GPT-5 nano', cost: 0.4, gpqa: 71.2, aime: 85.2, color: '#9CA3AF', isRio: false },
    { model: 'Claude Sonnet 4.5', cost: 15, gpqa: 83.4, aime: 87, color: '#9CA3AF', isRio: false },
    { model: 'Claude Haiku 4.5', cost: 5, gpqa: 73, aime: 80.7, color: '#9CA3AF', isRio: false },
];

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

const TRAINING_MODES = [
    {
        Icon: Dumbbell,
        title: 'Reinforcement Learning',
    },
    {
        Icon: Bolt,
        title: 'Supervised Fine-Tuning',
    },
    {
        Icon: Goal,
        title: 'On-Policy Distillation',
    },
];

const DEFAULT_MODE_WEIGHTS: Record<string, number> = {
    'Reinforcement Learning': 0.34,
    'Supervised Fine-Tuning': 0.46,
    'On-Policy Distillation': 0.2,
};
const generateModeWeights = () => {
    const samples = TRAINING_MODES.map(() => Math.random() + 0.3);
    const total = samples.reduce((sum, value) => sum + value, 0);
    return TRAINING_MODES.reduce<Record<string, number>>((acc, mode, index) => {
        acc[mode.title] = samples[index] / total;
        return acc;
    }, {});
};

export const Rio20OpenDetail: React.FC<Rio20OpenDetailProps> = ({ model, onBack }) => {
    const [modeWeights, setModeWeights] = useState<Record<string, number>>(DEFAULT_MODE_WEIGHTS);
    const baseRef = useRef<HTMLDivElement | null>(null);
    const pretrainRef = useRef<HTMLDivElement | null>(null);
    const connectorRef = useRef<HTMLDivElement | null>(null);
    const routerRef = useRef<HTMLDivElement | null>(null);
    const cardGridRef = useRef<HTMLDivElement | null>(null);
    const rioRef = useRef<HTMLDivElement | null>(null);
    const [connectorLayout, setConnectorLayout] = useState<ConnectorLayout | null>(null);
    const huggingFaceWeightsUrl = model.huggingFaceUrl;

    const measureConnectorLayout = useCallback(() => {
        if (
            !baseRef.current ||
            !pretrainRef.current ||
            !connectorRef.current ||
            !routerRef.current ||
            !cardGridRef.current ||
            !rioRef.current
        ) {
            return;
        }

        const containerRect = connectorRef.current.getBoundingClientRect();
        const baseRect = baseRef.current.getBoundingClientRect();
        const pretrainRect = pretrainRef.current.getBoundingClientRect();
        const routerRect = routerRef.current.getBoundingClientRect();
        const cardsRect = cardGridRef.current.getBoundingClientRect();
        const rioRect = rioRef.current.getBoundingClientRect();
        const cardNodes = Array.from(
            cardGridRef.current.querySelectorAll<HTMLElement>('[data-connector-card="true"]')
        );

        if (!cardNodes.length) {
            return;
        }

        const cardCenters = cardNodes.map((node) => {
            const rect = node.getBoundingClientRect();
            return rect.left - containerRect.left + rect.width / 2;
        });

        setConnectorLayout({
            width: containerRect.width,
            height: containerRect.height,
            baseBottom: baseRect.bottom - containerRect.top,
            baseCenter: baseRect.left - containerRect.left + baseRect.width / 2,
            pretrainTop: pretrainRect.top - containerRect.top,
            pretrainCenter: pretrainRect.left - containerRect.left + pretrainRect.width / 2,
            pretrainBottom: pretrainRect.bottom - containerRect.top,
            routerTop: routerRect.top - containerRect.top,
            routerCenter: routerRect.left - containerRect.left + routerRect.width / 2,
            routerBottom: routerRect.bottom - containerRect.top,
            cardTop: cardsRect.top - containerRect.top,
            cardBottom: cardsRect.bottom - containerRect.top,
            rioTop: rioRect.top - containerRect.top,
            cardCenters,
        });
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const interval = window.setInterval(() => {
            setModeWeights(generateModeWeights());
        }, 2800);
        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        measureConnectorLayout();
        if (typeof window === 'undefined') return undefined;
        window.addEventListener('resize', measureConnectorLayout);
        return () => window.removeEventListener('resize', measureConnectorLayout);
    }, [measureConnectorLayout]);

    useEffect(() => {
        measureConnectorLayout();
    }, [measureConnectorLayout, modeWeights]);

    const connectorMetrics = useMemo(() => {
        if (!connectorLayout || connectorLayout.cardCenters.length === 0) {
            return null;
        }
        const centerX =
            connectorLayout.routerCenter ??
            connectorLayout.pretrainCenter ??
            connectorLayout.baseCenter ??
            connectorLayout.width / 2;
        const firstX = Math.min(...connectorLayout.cardCenters);
        const lastX = Math.max(...connectorLayout.cardCenters);
        const topGap = Math.max(connectorLayout.cardTop - connectorLayout.routerBottom, 24);
        const bottomGap = Math.max(connectorLayout.rioTop - connectorLayout.cardBottom, 24);
        const topRailY = connectorLayout.routerBottom + topGap * 0.5;
        const bottomRailY = connectorLayout.cardBottom + bottomGap * 0.5;
        const baseLine = {
            x: connectorLayout.baseCenter ?? centerX,
            startY: connectorLayout.baseBottom,
            endY: connectorLayout.pretrainTop,
        };
        const pretrainLine = {
            x: connectorLayout.pretrainCenter ?? centerX,
            startY: connectorLayout.pretrainBottom,
            endY: connectorLayout.routerTop,
        };
        return { centerX, firstX, lastX, topRailY, bottomRailY, baseLine, pretrainLine };
    }, [connectorLayout]);

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
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-6 lg:max-w-3xl">
                                <h1 className="text-4xl font-bold leading-tight text-prose sm:text-5xl">
                                    {model.name}
                                </h1>
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

                            {huggingFaceWeightsUrl && (
                                <a
                                    href={huggingFaceWeightsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-prose shadow-sm transition hover:border-rio-primary/50 hover:text-rio-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:self-start"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                                        <img
                                            src="/logos/huggingface-2.svg"
                                            alt="Logomarca do Hugging Face"
                                            className="h-6 w-6"
                                        />
                                    </span>
                                    <span className="text-base">Acessar pesos</span>
                                    <ArrowUpRight className="h-4 w-4" />
                                </a>
                            )}
                        </div>

                        <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-rio-primary/10 blur-2xl" />
                            </div>
                            <div className="relative flex h-full flex-col gap-6">
                                <div className="grid gap-4 lg:grid-cols-2">
                                    {METRIC_CONFIGS.map((config) => (
                                        <ComparisonChart
                                            key={config.metric}
                                            {...config}
                                            data={MODEL_COMPARISON}
                                            labelOverrides={LABEL_POSITION_OVERRIDES}
                                        />
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
                                <p className="mt-2 text-sm text-prose-light">
                                    Como o Rio 2.0 não tem um controlador de esforço de pensamento, definimos o uso de
                                    budget forcing como seu modo high, de maneira a fazer uma comparação fiel a
                                    modelos com tais mecanismos.
                                    <br />
                                    Em nossos testes, a quantidade de tokens de raciocínio é comparável a modelos como
                                    o gpt-oss 20b (high).
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {BENCHMARKS.map((row) => (
                                <div
                                    key={row.metric}
                                    className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-base font-semibold text-prose">{row.metric}</p>
                                        <span className="text-3xl font-bold text-prose">{row.score}</span>
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
                                    Como treinamos esse modelo
                                </p>
                                <h2 className="mt-2 text-3xl font-bold text-prose">
                                    RL, SFT e destilação atuando juntos
                                </h2>
                            </div>
                            <p className="text-sm text-prose-light max-w-lg">Treinamento nativo em 4-bit</p>
                        </div>
                        <div className="mt-10 rounded-[32px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 sm:p-8">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-semibold text-prose">Pipeline de Treinamento</h3>
                                <p className="text-sm text-prose-light max-w-4xl">
                                    Primeiro, o modelo passa por RLPT, onde sua base de conhecimento é fortalecida de
                                    maneira ampla.
                                    <br />
                                    O diagrama demonstra como o Rio 2.0 Open simultaneamente maximiza três objetivos:
                                    RL, SFT e OPD,
                                    <br />
                                    com um router adaptativo equilibrando os pesos dados a cada método.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-col items-center gap-6">
                                <div
                                    ref={connectorRef}
                                    className="relative flex w-full max-w-3xl flex-col items-center gap-6"
                                >
                                    {connectorMetrics && connectorLayout && (
                                        <svg
                                            className="pointer-events-none absolute inset-0 hidden h-full w-full text-slate-200 md:block"
                                            preserveAspectRatio="none"
                                            viewBox={`0 0 ${connectorLayout.width} ${Math.max(connectorLayout.height, 1)}`}
                                            aria-hidden="true"
                                        >
                                            {connectorMetrics.baseLine && (
                                                <>
                                                    <line
                                                        x1={connectorMetrics.baseLine.x}
                                                        y1={connectorMetrics.baseLine.startY}
                                                        x2={connectorMetrics.baseLine.x}
                                                        y2={connectorMetrics.baseLine.endY}
                                                        stroke="currentColor"
                                                        strokeWidth={1.5}
                                                        strokeLinecap="round"
                                                    />
                                                    <circle
                                                        cx={connectorMetrics.baseLine.x}
                                                        cy={connectorMetrics.baseLine.startY}
                                                        r={3}
                                                        fill="currentColor"
                                                    />
                                                    <circle
                                                        cx={connectorMetrics.baseLine.x}
                                                        cy={connectorMetrics.baseLine.endY}
                                                        r={3}
                                                        fill="currentColor"
                                                    />
                                                </>
                                            )}
                                            {connectorMetrics.pretrainLine && (
                                                <>
                                                    <line
                                                        x1={connectorMetrics.pretrainLine.x}
                                                        y1={connectorMetrics.pretrainLine.startY}
                                                        x2={connectorMetrics.pretrainLine.x}
                                                        y2={connectorMetrics.pretrainLine.endY}
                                                        stroke="currentColor"
                                                        strokeWidth={1.5}
                                                        strokeLinecap="round"
                                                    />
                                                    <circle
                                                        cx={connectorMetrics.pretrainLine.x}
                                                        cy={connectorMetrics.pretrainLine.startY}
                                                        r={3}
                                                        fill="currentColor"
                                                    />
                                                    <circle
                                                        cx={connectorMetrics.pretrainLine.x}
                                                        cy={connectorMetrics.pretrainLine.endY}
                                                        r={3}
                                                        fill="currentColor"
                                                    />
                                                </>
                                            )}
                                            <line
                                                x1={connectorMetrics.centerX}
                                                y1={connectorLayout.routerBottom}
                                                x2={connectorMetrics.centerX}
                                                y2={connectorMetrics.topRailY}
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                                strokeLinecap="round"
                                            />
                                            <line
                                                x1={connectorMetrics.firstX}
                                                y1={connectorMetrics.topRailY}
                                                x2={connectorMetrics.lastX}
                                                y2={connectorMetrics.topRailY}
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                                strokeLinecap="round"
                                            />
                                            {connectorLayout.cardCenters.map((x, index) => (
                                                <g key={`connector-line-${index}`}>
                                                    <line
                                                        x1={x}
                                                        y1={connectorMetrics.topRailY}
                                                        x2={x}
                                                        y2={connectorLayout.cardTop}
                                                        stroke="currentColor"
                                                        strokeWidth={1.5}
                                                    />
                                                    <line
                                                        x1={x}
                                                        y1={connectorLayout.cardBottom}
                                                        x2={x}
                                                        y2={connectorMetrics.bottomRailY}
                                                        stroke="currentColor"
                                                        strokeWidth={1.5}
                                                    />
                                                    <circle cx={x} cy={connectorMetrics.topRailY} r={3} fill="currentColor" />
                                                    <circle
                                                        cx={x}
                                                        cy={connectorMetrics.bottomRailY}
                                                        r={3}
                                                        fill="currentColor"
                                                    />
                                                </g>
                                            ))}
                                            <line
                                                x1={connectorMetrics.firstX}
                                                y1={connectorMetrics.bottomRailY}
                                                x2={connectorMetrics.lastX}
                                                y2={connectorMetrics.bottomRailY}
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                                strokeLinecap="round"
                                            />
                                            <line
                                                x1={connectorMetrics.centerX}
                                                y1={connectorMetrics.bottomRailY}
                                                x2={connectorMetrics.centerX}
                                                y2={connectorLayout.rioTop}
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    )}

                                    <div ref={baseRef} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                                                <Box className="h-6 w-6 text-rio-primary" />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-prose">Base model</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-0.5 bg-slate-200 md:hidden" />
                                    </div>

                                    <div ref={pretrainRef} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className="h-8 w-0.5 bg-slate-200 md:hidden" />
                                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rio-primary/10">
                                                <Library className="h-6 w-6 text-rio-primary" />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-prose">
                                                    Reinforcement Learning Pre-Training
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-0.5 bg-slate-200 md:hidden" />
                                    </div>

                                    <div ref={routerRef} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className="h-8 w-0.5 bg-slate-200 md:hidden" />
                                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rio-primary/10">
                                                <Route className="h-6 w-6 text-rio-primary" />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-prose">THOR Router</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-0.5 bg-slate-200 md:hidden" />
                                    </div>

                                    <div ref={cardGridRef} className="relative z-10 grid w-full gap-4 md:grid-cols-3">
                                        {TRAINING_MODES.map(({ Icon, title }) => {
                                            const weight = modeWeights[title] ?? 0.33;
                                            const percent = Math.round(weight * 100);
                                            return (
                                                <div
                                                    key={title}
                                                    data-connector-card="true"
                                                    className="relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm"
                                                >
                                                    <span className="pointer-events-none absolute -top-6 left-1/2 block h-6 w-0.5 -translate-x-1/2 bg-slate-200 md:hidden" />
                                                    <span className="pointer-events-none absolute -bottom-6 left-1/2 block h-6 w-0.5 -translate-x-1/2 bg-slate-200 md:hidden" />
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                                                            <Icon className="h-6 w-6 text-rio-primary" />
                                                        </span>
                                                        <div>
                                                            <p className="text-sm font-semibold text-prose">{title}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="h-2 rounded-full bg-slate-100">
                                                            <div
                                                                className="h-full rounded-full bg-rio-primary transition-[width] duration-700 ease-out"
                                                                style={{ width: `${Math.max(percent, 8)}%` }}
                                                            />
                                                        </div>
                                                        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                                            {percent}%
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div ref={rioRef} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className="h-8 w-0.5 bg-slate-200 md:hidden" />
                                        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-md">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                                                <Sparkles className="h-6 w-6 text-emerald-600" />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-prose">Rio 2.0 Open</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                        </div>
                    </section>
                </AnimateOnScroll>
            </div>
        </div>
    );
};
