import React, { useState } from 'react';
import type { Model } from '../../types/index';
import {
    ArrowLeft,
    ArrowUpRight,
    Merge,
    Sparkles,
    Brain,
    Code,
    Sigma,
    Languages,
    Microscope,
    GraduationCap,
    Lightbulb,
    Eye,
    BarChart3,
    Stethoscope,
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

interface Rio30DetailProps {
    model: Model;
    onBack: () => void;
}

// Expert models that were merged to create Rio 3
const EXPERT_MODELS = [
    { id: 1, name: 'Lógica', specialty: 'Raciocínio Lógico', icon: Brain, color: 'text-violet-600', bgColor: 'bg-violet-100', borderColor: 'border-violet-200', glowColor: 'bg-violet-400/30', particleColor: '#7c3aed' },
    { id: 2, name: 'Código', specialty: 'Programação', icon: Code, color: 'text-emerald-600', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-200', glowColor: 'bg-emerald-400/30', particleColor: '#059669' },
    { id: 3, name: 'Matemática', specialty: 'Cálculos Avançados', icon: Sigma, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200', glowColor: 'bg-blue-400/30', particleColor: '#2563eb' },
    { id: 4, name: 'Linguagem', specialty: 'Processamento de Texto', icon: Languages, color: 'text-amber-600', bgColor: 'bg-amber-100', borderColor: 'border-amber-200', glowColor: 'bg-amber-400/30', particleColor: '#d97706' },
    { id: 5, name: 'Ciência', specialty: 'Conhecimento Científico', icon: Microscope, color: 'text-cyan-600', bgColor: 'bg-cyan-100', borderColor: 'border-cyan-200', glowColor: 'bg-cyan-400/30', particleColor: '#0891b2' },
    { id: 6, name: 'Aprendizado', specialty: 'Aprendizagem Contínua', icon: GraduationCap, color: 'text-rose-600', bgColor: 'bg-rose-100', borderColor: 'border-rose-200', glowColor: 'bg-rose-400/30', particleColor: '#e11d48' },
    { id: 7, name: 'Criatividade', specialty: 'Geração Criativa', icon: Lightbulb, color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200', glowColor: 'bg-yellow-400/30', particleColor: '#ca8a04' },
    { id: 8, name: 'Visão', specialty: 'Processamento Visual', icon: Eye, color: 'text-indigo-600', bgColor: 'bg-indigo-100', borderColor: 'border-indigo-200', glowColor: 'bg-indigo-400/30', particleColor: '#4f46e5' },
    { id: 9, name: 'Análise', specialty: 'Análise de Dados', icon: BarChart3, color: 'text-teal-600', bgColor: 'bg-teal-100', borderColor: 'border-teal-200', glowColor: 'bg-teal-400/30', particleColor: '#0d9488' },
    { id: 10, name: 'Saúde', specialty: 'Conhecimento Médico', icon: Stethoscope, color: 'text-pink-600', bgColor: 'bg-pink-100', borderColor: 'border-pink-200', glowColor: 'bg-pink-400/30', particleColor: '#db2777' },
];

// Benchmarks for Rio 3.0 Preview
const BENCHMARKS_MATH: Array<{ metric: string; scoreNoCode: string; scoreWithCode: string; note: string }> = [
    { metric: 'AIME 2025', scoreNoCode: '98,3', scoreWithCode: '100,0', note: 'avg@16' },
    { metric: 'BRUMO 2025', scoreNoCode: '99,0', scoreWithCode: '99,6', note: 'avg@16' },
    { metric: 'HMMT Feb 2025', scoreNoCode: '98,5', scoreWithCode: '99,6', note: 'avg@16' },
    { metric: 'HMMT Nov 2025', scoreNoCode: '95,8', scoreWithCode: '99,2', note: 'avg@16' },
    { metric: 'SMT 2025', scoreNoCode: '94,6', scoreWithCode: '96,9', note: 'avg@16' },
];

const BENCHMARKS_GENERAL: Array<{ metric: string; score: string; note: string }> = [
    { metric: 'GPQA Diamond', score: '88,6', note: 'avg@8' },
    { metric: 'SWE-bench Verified', score: '80,0', note: 'avg@1' },
    { metric: 'LiveCodeBench v6', score: '89,0', note: 'avg@2' },
];

const BENCHMARKS_MULTIMODAL: Array<{ metric: string; score: string; note: string }> = [
    { metric: 'MMMU-Pro', score: '79,7', note: 'avg@1' },
    { metric: 'Video-MMMU', score: '86,1', note: 'avg@1' },
    { metric: 'MMLU-Pro', score: '87,1%', note: 'avg@1' },
];

const BENCHMARKS_AGENT: Array<{ metric: string; score: string; note: string }> = [
    { metric: 'BrowseComp', score: '65,1', note: 'avg@1' },
    { metric: 'IFBench', score: '81,2%', note: 'avg@4' },
    { metric: 'Toolathlon', score: '45,8%', note: 'avg@2' },
];

const BENCHMARKS_MRCR: Array<{ needles: string; context: string; score: string }> = [
    { needles: '2', context: '128k', score: '97,2' },
    { needles: '2', context: '1M', score: '91,3' },
    { needles: '4', context: '128k', score: '86,4' },
    { needles: '4', context: '1M', score: '53,9' },
    { needles: '8', context: '128k', score: '51,0' },
    { needles: '8', context: '1M', score: '37,7' },
];

// MRCR Chart Component with hover tooltips
const MrcrChart: React.FC = () => {
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; score: number; context: string; needles: number } | null>(null);

    // Data: context sizes and scores for each needle count
    const contexts = ['8k', '16k', '32k', '64k', '128k', '256k', '512k', '1M'];
    const contextTokens = [8, 16, 32, 64, 128, 256, 512, 1024];
    const needles2 = [99.6, 99.8, 99.8, 98.5, 97.2, 97.4, 93.1, 91.3];
    const needles4 = [99.9, 98.7, 93.5, 91.0, 86.4, 82.9, 55.0, 53.9];
    const needles8 = [98.2, 89.1, 84.9, 78.9, 51.0, 52.6, 45.5, 37.7];

    // Chart dimensions
    const chartLeft = 60;
    const chartRight = 550;
    const chartTop = 20;
    const chartBottom = 220;
    const chartWidth = chartRight - chartLeft;
    const chartHeight = chartBottom - chartTop;

    // Log scale for x-axis
    const logMin = Math.log10(8);
    const logMax = Math.log10(1024);
    const getX = (tokens: number) => chartLeft + ((Math.log10(tokens) - logMin) / (logMax - logMin)) * chartWidth;
    const getY = (score: number) => chartBottom - (score / 100) * chartHeight;

    // Generate polyline points
    const points2 = contextTokens.map((t, i) => `${getX(t)},${getY(needles2[i])}`).join(' ');
    const points4 = contextTokens.map((t, i) => `${getX(t)},${getY(needles4[i])}`).join(' ');
    const points8 = contextTokens.map((t, i) => `${getX(t)},${getY(needles8[i])}`).join(' ');

    const renderDots = (scores: number[], needleCount: number, color: string) =>
        contextTokens.map((t, i) => (
            <circle
                key={`n${needleCount}-${i}`}
                cx={getX(t)}
                cy={getY(scores[i])}
                r={hoveredPoint?.needles === needleCount && hoveredPoint?.context === contexts[i] ? 7 : 4}
                fill={color}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredPoint({ x: getX(t), y: getY(scores[i]), score: scores[i], context: contexts[i], needles: needleCount })}
                onMouseLeave={() => setHoveredPoint(null)}
            />
        ));

    return (
        <>
            <svg viewBox="0 0 600 280" className="w-full max-w-3xl mx-auto">
                {/* Background */}
                <rect x={chartLeft} y={chartTop} width={chartWidth} height={chartHeight} fill="#f8fafc" rx="4" />

                {/* Y-axis gridlines and labels */}
                {[0, 25, 50, 75, 100].map((val) => {
                    const y = getY(val);
                    return (
                        <g key={`y-${val}`}>
                            <line x1={chartLeft} y1={y} x2={chartRight} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                            <text x={chartLeft - 10} y={y + 4} textAnchor="end" className="text-[11px] fill-slate-500">{val}%</text>
                        </g>
                    );
                })}

                {/* X-axis labels */}
                {contexts.map((label, i) => (
                    <text key={label} x={getX(contextTokens[i])} y="250" textAnchor="middle" className="text-[10px] fill-slate-500">{label}</text>
                ))}

                {/* Axes */}
                <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1={chartLeft} y1={chartTop} x2={chartLeft} y2={chartBottom} stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Lines */}
                <polyline points={points2} fill="none" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={points4} fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={points8} fill="none" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Dots with hover */}
                {renderDots(needles2, 2, '#1E40AF')}
                {renderDots(needles4, 4, '#0D9488')}
                {renderDots(needles8, 8, '#EA580C')}

                {/* Endpoint labels */}
                <text x={getX(1024) + 8} y={getY(91.3) + 4} textAnchor="start" className="text-[10px] fill-[#1E40AF] font-semibold">91,3%</text>
                <text x={getX(1024) + 8} y={getY(53.9) + 4} textAnchor="start" className="text-[10px] fill-[#0D9488] font-semibold">53,9%</text>
                <text x={getX(1024) + 8} y={getY(37.7) + 4} textAnchor="start" className="text-[10px] fill-[#EA580C] font-semibold">37,7%</text>

                {/* Tooltip */}
                {hoveredPoint && (() => {
                    // Show tooltip below if point is near top of chart
                    const showBelow = hoveredPoint.y < 55;
                    const tooltipY = showBelow ? hoveredPoint.y + 12 : hoveredPoint.y - 40;
                    return (
                        <g>
                            <rect
                                x={hoveredPoint.x - 45}
                                y={tooltipY}
                                width="90"
                                height="32"
                                rx="6"
                                fill="#1e293b"
                                opacity="0.95"
                            />
                            <text x={hoveredPoint.x} y={tooltipY + 14} textAnchor="middle" className="text-[11px] fill-white font-semibold">
                                {hoveredPoint.score.toFixed(1).replace('.', ',')}%
                            </text>
                            <text x={hoveredPoint.x} y={tooltipY + 27} textAnchor="middle" className="text-[9px] fill-slate-300">
                                {hoveredPoint.context} • {hoveredPoint.needles} needles
                            </text>
                        </g>
                    );
                })()}
            </svg>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 rounded-full bg-[#1E40AF]" />
                    <span className="text-sm text-prose-light">2 needles</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 rounded-full bg-[#0D9488]" />
                    <span className="text-sm text-prose-light">4 needles</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 rounded-full bg-[#EA580C]" />
                    <span className="text-sm text-prose-light">8 needles</span>
                </div>
            </div>
        </>
    );
};



const LABEL_POSITION_OVERRIDES: Partial<Record<string, LabelOverride>> = {
    'DeepSeek-v3.2-Speciale': 'bottom-right',
    'Claude Sonnet 4.5': 'top-left',
    'Gemini 3 Pro': 'top-right',
    'Gemini 3 Flash': 'bottom-right',
    'Grok 4.1 Fast': 'bottom-left',
    'Rio 3 Preview': 'top-left',
    'Kimi K2 Thinking': { matharena: 'bottom-right', hle: 'top-right' },
    'GLM 4.6': { matharena: 'top-right', hle: 'bottom-right' },
    'GPT-5 mini': 'top-left',
    'GPT-5.2': { hle: 'bottom-left' },
};

// MathArena Apex and HLE benchmark comparison with official pricing
const MODEL_COMPARISON: ModelComparisonDatum[] = [
    {
        model: 'Rio 3 Preview',
        cost: 1.5,
        gpqa: 88.6,
        aime: 100.0,
        matharena: 18.23,
        hle: 35.1,
        color: '#1E40AF',
        isRio: true,
    },
    {
        model: 'Gemini 3 Pro',
        cost: 12,
        gpqa: 91.9,
        aime: 95.0,
        matharena: 23.44,
        hle: 37.5,
        color: '#9CA3AF',
        isRio: false,
    },
    {
        model: 'Gemini 3 Flash',
        cost: 3,
        gpqa: 90.4,
        aime: 95.2,
        matharena: 15.62,
        hle: 33.7,
        color: '#9CA3AF',
        isRio: false,
    },
    {
        model: 'GPT-5.2',
        cost: 14,
        gpqa: 92.4,
        aime: 100.0,
        matharena: 13.54,
        hle: 34.5,
        color: '#9CA3AF',
        isRio: false,
    },
    {
        model: 'DeepSeek-v3.2-Speciale',
        cost: 0.42,
        gpqa: 0,
        aime: 0,
        matharena: 9.38,
        hle: 30.6,
        color: '#9CA3AF',
        isRio: false,
    },
    {
        model: 'Claude Sonnet 4.5',
        cost: 15,
        gpqa: 83.4,
        aime: 87,
        matharena: 1.56,
        hle: 13.7,
        color: '#9CA3AF',
        isRio: false,
    },
    {
        model: 'Grok 4.1 Fast',
        cost: 0.5,
        gpqa: 0,
        aime: 0,
        matharena: 5.21,
        hle: 17.6,
        color: '#9CA3AF',
        isRio: false,
    },
    {
        model: 'GPT-5 mini',
        cost: 2.0,
        gpqa: 82.3,
        aime: 91.1,
        matharena: 1.04,
        hle: 16.7,
        color: '#9CA3AF',
        isRio: false,
    },
    {
        model: 'GLM 4.6',
        cost: 2.2,
        gpqa: 0,
        aime: 0,
        matharena: 0.52,
        hle: 17.2,
        color: '#9CA3AF',
        isRio: false,
    },
    {
        model: 'Kimi K2 Thinking',
        cost: 2.50,
        gpqa: 0,
        aime: 0,
        matharena: 0.0,
        hle: 23.9,
        color: '#9CA3AF',
        isRio: false,
    },
    {
        model: 'Qwen3-235B-Thinking-2507',
        cost: 2.3,
        gpqa: 0,
        aime: 0,
        matharena: 5.21,
        hle: 18.2,
        color: '#9CA3AF',
        isRio: false,
    },
];

const METRIC_CONFIGS: Array<{
    metric: ComparisonMetric;
    label: string;
    yTicks: number[];
    minY?: number;
}> = [
        {
            metric: 'matharena',
            label: 'MathArena Apex',
            yTicks: [0, 5, 10, 15, 20, 25],
            minY: 0,
        },
        {
            metric: 'hle',
            label: "Humanity's Last Exam",
            yTicks: [10, 20, 30, 40],
            minY: 10,
        },
    ];


export const Rio30Detail: React.FC<Rio30DetailProps> = ({ model, onBack }) => {
    const huggingFaceWeightsUrl = model.huggingFaceUrl;





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
                                        <div
                                            key={config.metric}
                                            className={config.metric === 'livebench' ? 'lg:col-span-2' : ''}
                                        >
                                            <ComparisonChart
                                                {...config}
                                                data={MODEL_COMPARISON}
                                                labelOverrides={LABEL_POSITION_OVERRIDES}
                                                minCost={0.25}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-16">
                {/* Math Benchmarks - with code/no code comparison */}
                <AnimateOnScroll>
                    <section className="rounded-[40px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                                    Benchmarks de Matemática
                                </p>
                                <p className="mt-2 text-sm text-prose-light">
                                    Resultados com e sem uso de código para resolução de problemas.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="pb-3 text-sm font-semibold text-prose">Benchmark</th>
                                        <th className="pb-3 text-sm font-semibold text-prose text-center">Sem Código</th>
                                        <th className="pb-3 text-sm font-semibold text-prose text-center">Com Código</th>
                                        <th className="pb-3 text-sm font-semibold text-prose-light text-right">Nota</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {BENCHMARKS_MATH.map((row) => (
                                        <tr key={row.metric} className="border-b border-slate-100">
                                            <td className="py-4 text-base font-medium text-prose">{row.metric}</td>
                                            <td className="py-4 text-center">
                                                <span className="text-2xl font-bold text-prose">{row.scoreNoCode}</span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="text-2xl font-bold text-emerald-600">{row.scoreWithCode}</span>
                                            </td>
                                            <td className="py-4 text-sm text-prose-light text-right">{row.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </AnimateOnScroll>

                {/* General Benchmarks */}
                <AnimateOnScroll>
                    <section className="rounded-[40px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                                Benchmarks Gerais
                            </p>
                        </div>

                        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {BENCHMARKS_GENERAL.map((row) => (
                                <div
                                    key={row.metric}
                                    className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-base font-semibold text-prose">{row.metric}</p>
                                            <p className="text-xs text-prose-light mt-1">{row.note}</p>
                                        </div>
                                        <span className="text-3xl font-bold text-prose">{row.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </AnimateOnScroll>

                {/* Multimodal Benchmarks */}
                <AnimateOnScroll>
                    <section className="rounded-[40px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                                Benchmarks Multimodais
                            </p>
                        </div>

                        <div className="mt-10 grid gap-6 sm:grid-cols-3">
                            {BENCHMARKS_MULTIMODAL.map((row) => (
                                <div
                                    key={row.metric}
                                    className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-base font-semibold text-prose">{row.metric}</p>
                                            <p className="text-xs text-prose-light mt-1">{row.note}</p>
                                        </div>
                                        <span className="text-3xl font-bold text-prose">{row.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </AnimateOnScroll>

                {/* Agent Benchmarks */}
                <AnimateOnScroll>
                    <section className="rounded-[40px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                                Benchmarks de Agentes
                            </p>
                        </div>

                        <div className="mt-10 grid gap-6 sm:grid-cols-3">
                            {BENCHMARKS_AGENT.map((row) => (
                                <div
                                    key={row.metric}
                                    className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-base font-semibold text-prose">{row.metric}</p>
                                            <p className="text-xs text-prose-light mt-1">{row.note}</p>
                                        </div>
                                        <span className="text-3xl font-bold text-prose">{row.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </AnimateOnScroll>

                {/* MRCR Benchmark Line Chart */}
                <AnimateOnScroll>
                    <section className="rounded-[40px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                                MRCR (Multi-needle Retrieval)
                            </p>
                            <p className="mt-2 text-sm text-prose-light">
                                Avaliação de recuperação de informações em contextos longos.
                            </p>
                        </div>

                        <div className="mt-10">
                            {/* MRCR Line Chart - Log scale X axis (8k to 1M tokens) */}
                            <MrcrChart />
                        </div>
                    </section>
                </AnimateOnScroll>

                {/* Deepthink Internalization Merging Section */}
                <AnimateOnScroll>
                    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10 overflow-hidden">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                                    Como criamos esse modelo
                                </p>
                                <h2 className="mt-2 text-3xl font-bold text-prose">
                                    Deepthink Internalization Merging
                                </h2>
                            </div>
                        </div>
                        <div className="mt-10 rounded-[32px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 sm:p-8">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-semibold text-prose">10 especialistas → 1 inteligência unificada</h3>
                                <p className="text-sm text-prose-light max-w-3xl">
                                    10 modelos especializados são treinados independentemente e então fundidos em um único modelo através do método Deepthink Internalization Merging. O modelo resultante herda as capacidades de todos os especialistas.
                                </p>
                            </div>

                            {/* Radial Expert Visualization */}
                            <div className="mt-12 relative">
                                {/* Mobile: Grid layout */}
                                <div className="md:hidden grid grid-cols-2 gap-3">
                                    {EXPERT_MODELS.map((expert) => (
                                        <div
                                            key={expert.id}
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                                        >
                                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${expert.bgColor}`}>
                                                <expert.icon className={`h-5 w-5 ${expert.color}`} />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-prose truncate">{expert.name}</p>
                                                <p className="text-[10px] text-prose-light truncate">{expert.specialty}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop: Convergence Synthesis */}
                                <div className="hidden md:block relative h-[520px] overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                                    {/* Subtle radial glow from center */}
                                    <div
                                        className="absolute inset-0 opacity-40"
                                        style={{
                                            background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)'
                                        }}
                                    />

                                    {/* SVG Canvas */}
                                    <svg
                                        className="absolute inset-0 w-full h-full"
                                        viewBox="0 0 800 520"
                                        preserveAspectRatio="xMidYMid meet"
                                    >
                                        <defs>
                                            {/* Unified color palette - emerald/teal theme */}
                                            <linearGradient id="stream-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                                                <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                            </linearGradient>

                                            {/* Core glow */}
                                            <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
                                                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                                                <stop offset="30%" stopColor="#10b981" stopOpacity="0.9" />
                                                <stop offset="70%" stopColor="#059669" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                                            </radialGradient>

                                            {/* Soft glow filter */}
                                            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                                                <feGaussianBlur stdDeviation="3" result="glow" />
                                                <feMerge>
                                                    <feMergeNode in="glow" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>

                                            {/* Particle glow */}
                                            <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
                                                <feGaussianBlur stdDeviation="2" result="blur" />
                                                <feMerge>
                                                    <feMergeNode in="blur" />
                                                    <feMergeNode in="blur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        {/* Curved paths from experts to center with flowing particles */}
                                        {EXPERT_MODELS.map((expert, i) => {
                                            const angleRad = (i * 36 - 90) * (Math.PI / 180);
                                            const outerR = 200;
                                            const startX = 400 + outerR * Math.cos(angleRad);
                                            const startY = 260 + outerR * Math.sin(angleRad);

                                            // Create curved path to center
                                            const midAngle = angleRad + (Math.PI / 8) * (i % 2 === 0 ? 1 : -1);
                                            const midR = outerR * 0.5;
                                            const midX = 400 + midR * Math.cos(midAngle);
                                            const midY = 260 + midR * Math.sin(midAngle);

                                            const path = `M ${startX} ${startY} Q ${midX} ${midY} 400 260`;
                                            const pathId = `flow-path-${i}`;

                                            return (
                                                <g key={`stream-${i}`}>
                                                    {/* Define the path */}
                                                    <path id={pathId} d={path} fill="none" stroke="none" />

                                                    {/* Faint trail */}
                                                    <path
                                                        d={path}
                                                        fill="none"
                                                        stroke={expert.particleColor}
                                                        strokeWidth="1"
                                                        opacity="0.1"
                                                    />

                                                    {/* Flowing particle 1 */}
                                                    <circle r="3" fill={expert.particleColor} filter="url(#particle-glow)">
                                                        <animateMotion
                                                            dur="2.5s"
                                                            repeatCount="indefinite"
                                                            begin={`${i * 0.2}s`}
                                                        >
                                                            <mpath href={`#${pathId}`} />
                                                        </animateMotion>
                                                        <animate
                                                            attributeName="opacity"
                                                            values="0;1;1;0"
                                                            dur="2.5s"
                                                            repeatCount="indefinite"
                                                            begin={`${i * 0.2}s`}
                                                        />
                                                        <animate
                                                            attributeName="r"
                                                            values="2;4;2"
                                                            dur="2.5s"
                                                            repeatCount="indefinite"
                                                            begin={`${i * 0.2}s`}
                                                        />
                                                    </circle>

                                                    {/* Flowing particle 2 (offset) */}
                                                    <circle r="2" fill={expert.particleColor} filter="url(#particle-glow)">
                                                        <animateMotion
                                                            dur="2.5s"
                                                            repeatCount="indefinite"
                                                            begin={`${i * 0.2 + 1.25}s`}
                                                        >
                                                            <mpath href={`#${pathId}`} />
                                                        </animateMotion>
                                                        <animate
                                                            attributeName="opacity"
                                                            values="0;0.7;0.7;0"
                                                            dur="2.5s"
                                                            repeatCount="indefinite"
                                                            begin={`${i * 0.2 + 1.25}s`}
                                                        />
                                                    </circle>
                                                </g>
                                            );
                                        })}

                                        {/* Central Core - The Unified Mind */}
                                        <g transform="translate(400, 260)">
                                            {/* Outer pulse ring */}
                                            <circle r="50" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3">
                                                <animate attributeName="r" values="50;65;50" dur="4s" repeatCount="indefinite" />
                                                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
                                            </circle>

                                            {/* Inner pulse ring */}
                                            <circle r="35" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.5">
                                                <animate attributeName="r" values="35;45;35" dur="3s" repeatCount="indefinite" />
                                                <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
                                            </circle>

                                            {/* Core sphere */}
                                            <circle r="28" fill="url(#core-glow)" filter="url(#soft-glow)">
                                                <animate attributeName="r" values="28;31;28" dur="2s" repeatCount="indefinite" />
                                            </circle>

                                            {/* Inner bright core */}
                                            <circle r="12" fill="#ffffff" opacity="0.9">
                                                <animate attributeName="opacity" values="0.9;1;0.9" dur="1.5s" repeatCount="indefinite" />
                                            </circle>
                                        </g>
                                    </svg>

                                    {/* Expert Nodes - Clean icons around the perimeter */}
                                    {EXPERT_MODELS.map((expert, i) => {
                                        const angleRad = (i * 36 - 90) * (Math.PI / 180);
                                        const radius = 200;
                                        const x = radius * Math.cos(angleRad);
                                        const y = radius * Math.sin(angleRad);

                                        return (
                                            <div
                                                key={`node-${expert.id}`}
                                                className="absolute group"
                                                style={{
                                                    left: '50%',
                                                    top: '50%',
                                                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                                                }}
                                            >
                                                <div className="relative flex flex-col items-center">
                                                    {/* Node circle */}
                                                    <div
                                                        className="flex h-11 w-11 items-center justify-center rounded-full border-2 bg-slate-900/90 backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                                                        style={{
                                                            borderColor: expert.particleColor,
                                                            boxShadow: `0 0 20px ${expert.particleColor}40`
                                                        }}
                                                    >
                                                        <expert.icon size={18} style={{ color: expert.particleColor }} />
                                                    </div>

                                                    {/* Label */}
                                                    <div className="absolute top-12 flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <span
                                                            className="text-[10px] font-semibold tracking-wide uppercase"
                                                            style={{ color: expert.particleColor }}
                                                        >
                                                            {expert.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Central Label */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mt-16">
                                        <span className="text-2xl font-bold text-white tracking-tight">Rio 3</span>
                                    </div>
                                </div>

                                {/* Mobile: Simple merge indicator */}
                                <div className="md:hidden mt-6 flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-3 rounded-2xl border border-rio-primary/30 bg-rio-primary/5 px-4 py-2">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rio-primary/20">
                                            <Merge className="h-5 w-5 text-rio-primary" />
                                        </span>
                                        <p className="text-sm font-semibold text-rio-primary">Deepthink Merging</p>
                                    </div>
                                    <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-md">
                                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                                            <Sparkles className="h-6 w-6 text-emerald-600" />
                                        </span>
                                        <div>
                                            <p className="text-lg font-semibold text-prose">Rio 3 Preview</p>
                                            <p className="text-xs text-prose-light">800B parâmetros (30B ativados)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </section >
                </AnimateOnScroll >

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
            </div >
        </div >
    );
};
