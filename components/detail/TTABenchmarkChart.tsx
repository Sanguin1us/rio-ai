import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TTA_BENCHMARK_DATA, TTABenchmarkPoint, TRAINING_COMPUTE_DATA } from '../../data/research-data';

// Color palette - muted for baselines, vibrant gradient for Rio
const BASELINE_COLORS: Record<string, string> = {
    'Claude Opus 4.5': '#D97757',  // Anthropic Orange
    'DeepSeek v3.2': '#4CC9F0',     // DeepSeek Cyan-Blue
    'GPT-5.2 xhigh': '#10B981',     // OpenAI Green
    'Gemini 3 Pro': '#8B5CF6',      // Google Gemini Purple
};

// Rio uses a blue gradient from light to dark based on TTA count
const RIO_COLORS: Record<string, string> = {
    'Rio 3 TTA 1': '#BFDBFE',      // Blue-200
    'Rio 3 TTA 10': '#93C5FD',     // Blue-300
    'Rio 3 TTA 100': '#60A5FA',    // Blue-400
    'Rio 3 TTA 1000': '#3B82F6',   // Blue-500
    'Rio 3 TTA 10000': '#1D4ED8',  // Blue-700 (hero line)
};

const TTA_LABELS: Record<string, string> = {
    'Rio 3 TTA 1': '1',
    'Rio 3 TTA 10': '10',
    'Rio 3 TTA 100': '100',
    'Rio 3 TTA 1000': '1K',
    'Rio 3 TTA 10000': '10K',
};

const ALL_COLORS = { ...BASELINE_COLORS, ...RIO_COLORS };
const BASELINE_MODELS = Object.keys(BASELINE_COLORS);
const RIO_MODELS = Object.keys(RIO_COLORS);

export const AttentionAccuracyChart: React.FC = () => {
    // Calculate AUC data dynamically
    const aucScalingData = useMemo(() => {
        const models = ['Rio 3 TTA 1', 'Rio 3 TTA 10', 'Rio 3 TTA 100', 'Rio 3 TTA 1000', 'Rio 3 TTA 10000'];
        const maxPossibleAUC = (TTA_BENCHMARK_DATA.length - 1) * 100;

        return models.map(model => {
            let auc = 0;
            for (let i = 0; i < TTA_BENCHMARK_DATA.length - 1; i++) {
                const current = TTA_BENCHMARK_DATA[i];
                const next = TTA_BENCHMARK_DATA[i + 1];
                if (!current || !next) continue;
                const y1 = (current[model as keyof TTABenchmarkPoint] as number | undefined) ?? 0;
                const y2 = (next[model as keyof TTABenchmarkPoint] as number | undefined) ?? 0;
                const x1 = current.context;
                const x2 = next.context;
                auc += ((y1 + y2) / 2) * (x2 - x1);
            }
            const ttaRaw = model.split('TTA ')[1] ?? '0';
            const ttaValue = Number.parseInt(ttaRaw, 10) || 0;
            return {
                model,
                tta: ttaValue,
                logTta: Math.log10(ttaValue),
                aucPercent: (auc / maxPossibleAUC)
            };
        });
    }, []);

    // Dimensions
    const width = 1000;
    const padding = { top: 60, right: 80, bottom: 120, left: 80 };
    const plotWidth = width - padding.left - padding.right;

    // AUC Plot Dimensions
    const aucHeight = 780;
    const aucPlotHeight = aucHeight - padding.top - padding.bottom;

    // AUC scale functions
    const getAucX = (val: number) => (padding.left + 50) + (val / 4) * (plotWidth - 100);
    const getAucY = (val: number) => padding.top + aucPlotHeight - val * aucPlotHeight;

    // CSS Breakout Style
    const breakoutStyle: React.CSSProperties = {
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
    };

    return (
        <div style={breakoutStyle} className="mt-22 mb-[12vh]">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
                {/* Left: Training Scaling */}
                <div className="overflow-hidden rounded-[2.5rem] bg-white p-12 shadow-sm border border-slate-200 flex flex-col items-center">
                    <div className="text-center z-10 mb-[-20px]">
                        <h4 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Precisão da Atenção
                            <span className="block text-slate-500 mt-0">durante o treinamento</span>
                        </h4>
                    </div>

                    <div className="relative w-full">
                        <svg viewBox={`0 0 ${width} ${aucHeight}`} className="w-full h-auto">
                            {/* Axes */}
                            <line x1={padding.left} y1={aucHeight - padding.bottom} x2={width - padding.right} y2={aucHeight - padding.bottom} stroke="#E2E8F0" strokeWidth={3} />
                            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={aucHeight - padding.bottom} stroke="#E2E8F0" strokeWidth={3} />

                            {/* Grid labels */}
                            {[0, 0.5, 1].map(v => (
                                <text key={v} x={padding.left - 24} y={getAucY(v) + 8} textAnchor="end" className="text-xl font-black fill-slate-400">{Math.round(v * 100)}%</text>
                            ))}

                            {/* X-axis labels */}
                            {TRAINING_COMPUTE_DATA.map((d, i) => (
                                <text key={d.compute} x={padding.left + 50 + (i / (TRAINING_COMPUTE_DATA.length - 1)) * (plotWidth - 100)} y={aucHeight - padding.bottom + 45} textAnchor="middle" className="text-lg font-black fill-slate-400">{d.compute}</text>
                            ))}

                            {/* X-axis title */}
                            <text x={padding.left + plotWidth / 2} y={aucHeight - 15} textAnchor="middle" className="text-xl font-black uppercase tracking-[0.2em] fill-slate-400">
                                Training Compute (log scale)
                            </text>

                            {/* Training Scaling Line */}
                            <path
                                d={`M ${TRAINING_COMPUTE_DATA.map((d, i) => `${padding.left + 50 + (i / (TRAINING_COMPUTE_DATA.length - 1)) * (plotWidth - 100)} ${getAucY(d.accuracy / 100)}`).join(' L ')}`}
                                fill="none"
                                stroke="#94A3B8"
                                strokeWidth={5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity={0.7}
                            />

                            {/* Data Points */}
                            {TRAINING_COMPUTE_DATA.map((d, i) => (
                                <g key={d.compute}>
                                    <circle
                                        cx={padding.left + 50 + (i / (TRAINING_COMPUTE_DATA.length - 1)) * (plotWidth - 100)}
                                        cy={getAucY(d.accuracy / 100)}
                                        r={8}
                                        fill="white"
                                        stroke="#94A3B8"
                                        strokeWidth={4}
                                    />
                                    <text
                                        x={padding.left + 50 + (i / (TRAINING_COMPUTE_DATA.length - 1)) * (plotWidth - 100)}
                                        y={getAucY(d.accuracy / 100) - 28}
                                        textAnchor="middle"
                                        className="text-xl font-black fill-slate-900"
                                    >
                                        {d.accuracy.toFixed(1)}%
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>

                {/* Right: Test-Time Scaling (Our Actual Data) */}
                <div className="overflow-hidden rounded-[2.5rem] bg-white p-12 shadow-sm border border-slate-200 flex flex-col items-center">
                    <div className="text-center z-10 mb-[-20px]">
                        <h4 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Precisão da Atenção
                            <span className="block text-slate-500 mt-0">com Test-Time Attention</span>
                        </h4>
                    </div>

                    <div className="relative w-full">
                        <svg viewBox={`0 0 ${width} ${aucHeight}`} className="w-full h-auto">
                            {/* Axes */}
                            <line x1={padding.left} y1={aucHeight - padding.bottom} x2={width - padding.right} y2={aucHeight - padding.bottom} stroke="#E2E8F0" strokeWidth={3} />
                            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={aucHeight - padding.bottom} stroke="#E2E8F0" strokeWidth={3} />

                            {/* Grid labels */}
                            {[0, 0.5, 1].map(v => (
                                <text key={v} x={padding.left - 24} y={getAucY(v) + 8} textAnchor="end" className="text-xl font-black fill-slate-400">{Math.round(v * 100)}%</text>
                            ))}

                            {/* X-axis TTA labels */}
                            {[1, 10, 100, 1000, 10000].map(tta => (
                                <text key={tta} x={getAucX(Math.log10(tta))} y={aucHeight - padding.bottom + 45} textAnchor="middle" className="text-lg font-black fill-slate-400">{tta >= 1000 ? `${tta / 1000}K` : tta}</text>
                            ))}

                            {/* X-axis title */}
                            <text x={padding.left + plotWidth / 2} y={aucHeight - 15} textAnchor="middle" className="text-xl font-black uppercase tracking-[0.2em] fill-slate-400">
                                Test-Time Compute (log scale)
                            </text>

                            {/* Scaling Line */}
                            <path
                                d={`M ${aucScalingData.map(d => `${getAucX(d.logTta)} ${getAucY(d.aucPercent)}`).join(' L ')}`}
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth={5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity={0.7}
                            />

                            {/* Data Points */}
                            {aucScalingData.map((d) => (
                                <g key={d.model}>
                                    <circle cx={getAucX(d.logTta)} cy={getAucY(d.aucPercent)} r={8} fill="white" stroke="#3B82F6" strokeWidth={4} />
                                    <text x={getAucX(d.logTta)} y={getAucY(d.aucPercent) - 28} textAnchor="middle" className="text-xl font-black fill-slate-900">{(d.aucPercent * 100).toFixed(1)}%</text>
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ManyNeedlesChart: React.FC = () => {
    const [hoveredModel, setHoveredModel] = useState<string | null>(null);
    const [hoveredContext, setHoveredContext] = useState<number | null>(null);

    const displayContext = hoveredContext;

    // Dimensions
    const padding = { top: 60, right: 80, bottom: 120, left: 80 };
    // Domain
    const xMin = 13;
    const xMax = 30;
    const yMin = 0;
    const yMax = 100;

    // Retrieval Chart dimensions (Widened for impact)
    const retWidth = 1600;
    const retHeight = 600;
    const retPlotWidth = retWidth - padding.left - padding.right;
    const retPlotHeight = retHeight - padding.top - padding.bottom;

    // Scale functions for retrieval chart
    const getRetX = (val: number) => padding.left + ((val - xMin) / (xMax - xMin)) * retPlotWidth;
    const getRetY = (val: number) => padding.top + retPlotHeight - ((val - yMin) / (yMax - yMin)) * retPlotHeight;

    // Create smooth path using Catmull-Rom spline
    const createPath = (model: string) => {
        const points = TTA_BENCHMARK_DATA
            .filter(d => d[model as keyof TTABenchmarkPoint] !== undefined)
            .map(d => ({ x: getRetX(d.context), y: getRetY(d[model as keyof TTABenchmarkPoint] as number) }));

        if (points.length < 2) return '';
        const firstPoint = points[0];
        if (!firstPoint) return '';

        let d = `M ${firstPoint.x} ${firstPoint.y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i - 1] || points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;
            if (!p0 || !p1 || !p2 || !p3) continue;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    };

    const isRio = (model: string) => RIO_MODELS.includes(model);
    const isHeroLine = (model: string) => model === 'Rio 3 TTA 10000';

    // Get opacity for lines based on state
    const getLineOpacity = (model: string) => {
        if (hoveredModel) {
            return hoveredModel === model ? 1 : 0.12;
        }
        if (isRio(model)) return isHeroLine(model) ? 1 : 0.7;
        return 0.85;
    };

    // Get stroke width
    const getStrokeWidth = (model: string) => {
        if (hoveredModel === model) return isRio(model) ? 5 : 4;
        if (isHeroLine(model)) return 4;
        if (isRio(model)) return 2.5;
        return 3;
    };

    // Format context length for labels
    const formatContext = (val: number) => {
        if (val === 30) return '1B';
        const powerOfTwo = Math.pow(2, val);
        if (val >= 20) {
            const m = powerOfTwo / (1024 * 1024);
            return `${Math.round(m)}M`;
        }
        const k = powerOfTwo / 1024;
        return `${Math.round(k)}K`;
    };

    // Milestones to label on X-axis - only major ones for cleaner look
    const milestoneContexts = [13, 15, 17, 19, 21, 23, 25, 27, 29, 30];

    // CSS Breakout Style
    const breakoutStyle: React.CSSProperties = {
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
    };

    return (
        <div style={breakoutStyle} className="my-16">
            <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 font-sans">
                <div className="w-full overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
                    {/* Header - Centered */}
                    <div className="mb-6">
                        <div className="text-center">
                            <h4 className="text-3xl font-black text-slate-900 tracking-tight">Many Needles in a Haystack</h4>
                            <p className="text-slate-500 text-base mt-2 leading-relaxed">
                                Recuperação de dezenas de fatos em contextos de até 1 bilhão de tokens
                            </p>
                        </div>

                        {/* Dynamic HUD Legend - Single Row */}
                        <div className="flex items-center justify-center gap-3 text-xs mt-6 min-h-[40px] flex-wrap">
                            {/* Rio Section */}
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-2 mr-1">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-blue-300 to-blue-700" />
                                    <span className="font-bold text-slate-600 text-sm uppercase tracking-widest">Rio 3</span>
                                </div>
                                {RIO_MODELS.map(m => {
                                    const val = displayContext !== null
                                        ? TTA_BENCHMARK_DATA.find(p => p.context === displayContext)?.[m as keyof TTABenchmarkPoint]
                                        : undefined;

                                    return (
                                        <button
                                            key={m}
                                            onMouseEnter={() => setHoveredModel(m)}
                                            onMouseLeave={() => setHoveredModel(null)}
                                            className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-75 ${hoveredModel === m
                                                ? 'bg-blue-100 ring-1 ring-blue-200 scale-[1.02]'
                                                : 'hover:bg-slate-50'
                                                } ${isHeroLine(m) ? 'font-bold' : ''}`}
                                        >
                                            <div
                                                className={`rounded-full transition-all ${isHeroLine(m) ? 'w-2.5 h-2.5 ring-1 ring-blue-300' : 'w-2 h-2'}`}
                                                style={{ backgroundColor: RIO_COLORS[m] }}
                                            />
                                            <div className="flex items-baseline gap-1.5 leading-none">
                                                <span className={`${isHeroLine(m) ? 'text-blue-700 font-bold' : 'text-slate-600 font-medium'} text-sm font-mono`}>
                                                    {TTA_LABELS[m]}
                                                </span>
                                                <AnimatePresence>
                                                    {val !== undefined && (
                                                        <motion.span
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.08 }}
                                                            className={`text-[11px] font-black tabular-nums ${isHeroLine(m) ? 'text-blue-600' : 'text-slate-500'}`}
                                                        >
                                                            {val.toFixed(1)}%
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Separator */}
                            <div className="w-px h-5 bg-slate-200" />

                            {/* Baselines Section */}
                            <div className="flex items-center gap-3">
                                {BASELINE_MODELS.map(m => {
                                    const val = displayContext !== null
                                        ? TTA_BENCHMARK_DATA.find(p => p.context === displayContext)?.[m as keyof TTABenchmarkPoint]
                                        : undefined;

                                    const displayName = m === 'Claude Opus 4.5' ? 'Claude 4.5 Opus'
                                        : m === 'DeepSeek v3.2' ? 'DeepSeek V3.2'
                                            : m === 'GPT-5.2 xhigh' ? 'GPT 5.2'
                                                : m === 'Gemini 3 Pro' ? 'Gemini 3.0 Pro'
                                                    : m;

                                    return (
                                        <button
                                            key={m}
                                            onMouseEnter={() => setHoveredModel(m)}
                                            onMouseLeave={() => setHoveredModel(null)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-75 ${hoveredModel === m
                                                ? 'bg-slate-100 ring-1 ring-slate-200 scale-[1.02]'
                                                : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BASELINE_COLORS[m] }} />
                                            <span className="font-medium text-slate-400 text-sm">{displayName}</span>

                                            <AnimatePresence mode="wait">
                                                {val !== undefined && (
                                                    <motion.span
                                                        initial={{ opacity: 0, width: 0 }}
                                                        animate={{ opacity: 1, width: 'auto' }}
                                                        exit={{ opacity: 0, width: 0 }}
                                                        className="text-[11px] font-bold text-slate-500"
                                                    >
                                                        {val.toFixed(1)}%
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="relative">

                        <svg
                            viewBox={`0 0 ${retWidth} ${retHeight}`}
                            className="w-full h-auto"
                            style={{ maxHeight: '500px' }}
                            onMouseLeave={() => { setHoveredModel(null); setHoveredContext(null); }}
                        >
                            <defs>
                                {/* Gradient for hero line glow */}
                                <linearGradient id="hero-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#1D4ED8" />
                                </linearGradient>

                                {/* Subtle area gradient for hero performance */}
                                <linearGradient id="hero-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.04" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.005" />
                                </linearGradient>


                                {/* Glow filter for hovered lines */}
                                <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>


                            {/* Y-axis labels only (no grid lines) */}
                            {[25, 50, 75, 100].map(y => (
                                <text
                                    key={y}
                                    x={padding.left - 14}
                                    y={getRetY(y) + 4}
                                    textAnchor="end"
                                    className="text-[13px] font-medium fill-slate-300"
                                >
                                    {y}%
                                </text>
                            ))}



                            {/* X-axis labels */}
                            {TTA_BENCHMARK_DATA.filter(d => milestoneContexts.includes(d.context)).map(d => {
                                const isSpotlight = [17, 20, 30].includes(d.context);
                                const label = formatContext(d.context);
                                return (
                                    <g key={d.context}>
                                        <text
                                            x={getRetX(d.context)}
                                            y={retHeight - padding.bottom + 28}
                                            textAnchor="middle"
                                            className={`transition-all duration-200 ${isSpotlight
                                                ? 'text-[16px] font-black fill-slate-900'
                                                : hoveredContext === d.context
                                                    ? 'text-[14px] font-bold fill-blue-600'
                                                    : 'text-[14px] font-bold fill-slate-400'
                                                }`}
                                        >
                                            {label}
                                        </text>

                                    </g>
                                );
                            })}

                            {/* X-axis title */}
                            <text
                                x={padding.left + retPlotWidth / 2}
                                y={retHeight - 32}
                                textAnchor="middle"
                                className="text-lg font-bold tracking-wide fill-slate-400"
                            >
                                Context Length (tokens)
                            </text>

                            {/* Subtle area under hero line */}
                            <path
                                d={`${createPath('Rio 3 TTA 10000')} L ${getRetX(30)} ${getRetY(0)} L ${getRetX(13)} ${getRetY(0)} Z`}
                                fill="url(#hero-area-gradient)"
                                className="pointer-events-none transition-opacity duration-300"
                                style={{ opacity: hoveredModel && !isHeroLine(hoveredModel) ? 0.2 : 1 }}
                            />

                            {/* Baseline model lines */}
                            {BASELINE_MODELS.map(model => (
                                <path
                                    key={model}
                                    d={createPath(model)}
                                    fill="none"
                                    stroke={ALL_COLORS[model]}
                                    strokeWidth={getStrokeWidth(model)}
                                    strokeOpacity={getLineOpacity(model)}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-300 cursor-pointer"
                                    onMouseEnter={() => setHoveredModel(model)}
                                />
                            ))}

                            {/* Rio model lines (non-hero first, then hero on top) */}
                            {RIO_MODELS.filter(m => !isHeroLine(m)).map(model => (
                                <path
                                    key={model}
                                    d={createPath(model)}
                                    fill="none"
                                    stroke={ALL_COLORS[model]}
                                    strokeWidth={getStrokeWidth(model)}
                                    strokeOpacity={getLineOpacity(model)}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-300 cursor-pointer"
                                    filter={hoveredModel === model ? 'url(#line-glow)' : undefined}
                                    onMouseEnter={() => setHoveredModel(model)}
                                />
                            ))}

                            {/* Hero line (Rio 3 TTA 10000) - rendered last for z-index */}
                            <path
                                d={createPath('Rio 3 TTA 10000')}
                                fill="none"
                                stroke="url(#hero-line-gradient)"
                                strokeWidth={getStrokeWidth('Rio 3 TTA 10000')}
                                strokeOpacity={getLineOpacity('Rio 3 TTA 10000')}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-all duration-300 cursor-pointer"
                                filter={hoveredModel === 'Rio 3 TTA 10000' || !hoveredModel ? 'url(#line-glow)' : undefined}
                                onMouseEnter={() => setHoveredModel('Rio 3 TTA 10000')}
                            />


                            {/* Hoverable columns for tooltip */}
                            {TTA_BENCHMARK_DATA.map(d => (
                                <rect
                                    key={`hit-${d.context}`}
                                    x={getRetX(d.context) - (retPlotWidth / (xMax - xMin)) / 2}
                                    y={padding.top}
                                    width={retPlotWidth / (xMax - xMin)}
                                    height={retPlotHeight}
                                    fill="transparent"
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHoveredContext(d.context)}
                                    onMouseLeave={() => setHoveredContext(null)}
                                />
                            ))}

                            {/* Hover line and dots */}
                            {displayContext !== null && (
                                <g>
                                    <line
                                        x1={getRetX(displayContext)}
                                        y1={padding.top}
                                        x2={getRetX(displayContext)}
                                        y2={padding.top + retPlotHeight}
                                        stroke="#94A3B8"
                                        strokeWidth={1}
                                        strokeDasharray="3 3"
                                    />
                                    {[...RIO_MODELS, ...BASELINE_MODELS]
                                        .map(model => {
                                            const d = TTA_BENCHMARK_DATA.find(p => p.context === displayContext);
                                            const val = d?.[model as keyof TTABenchmarkPoint];
                                            if (val === undefined) return null;
                                            return (
                                                <circle
                                                    key={model}
                                                    cx={getRetX(displayContext)}
                                                    cy={getRetY(val as number)}
                                                    r={isHeroLine(model) ? 6 : isRio(model) ? 4 : 3}
                                                    fill={ALL_COLORS[model]}
                                                    stroke="#FFF"
                                                    strokeWidth={1.5}
                                                />
                                            );
                                        })}
                                </g>
                            )}
                        </svg>

                    </div>
                </div>
            </div>
        </div>
    );
};

export const TTABenchmarkChart: React.FC = () => {
    return (
        <div className="flex flex-col gap-12">
            <AttentionAccuracyChart />
            <ManyNeedlesChart />
        </div>
    );
};
