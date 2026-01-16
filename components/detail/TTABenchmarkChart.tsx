import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TTA_BENCHMARK_DATA, TTABenchmarkPoint } from '../../data/research-data';

// Color palette - muted for baselines, vibrant gradient for Rio
const BASELINE_COLORS: Record<string, string> = {
    'Claude Opus 4.5': '#A78BFA',
    'DeepSeek v3.2': '#F472B6',
    'GPT-5.2 xhigh': '#34D399',
    'Gemini 3 Pro': '#FBBF24',
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

export const TTABenchmarkChart: React.FC = () => {
    const [hoveredModel, setHoveredModel] = useState<string | null>(null);
    const [hoveredContext, setHoveredContext] = useState<number | null>(null);

    // Calculate AUC data dynamically
    const aucScalingData = useMemo(() => {
        const models = ['Rio 3 TTA 1', 'Rio 3 TTA 10', 'Rio 3 TTA 100', 'Rio 3 TTA 1000', 'Rio 3 TTA 10000'];
        const maxPossibleAUC = (TTA_BENCHMARK_DATA.length - 1) * 100;

        return models.map(model => {
            let auc = 0;
            for (let i = 0; i < TTA_BENCHMARK_DATA.length - 1; i++) {
                const y1 = TTA_BENCHMARK_DATA[i][model as keyof TTABenchmarkPoint] as number || 0;
                const y2 = TTA_BENCHMARK_DATA[i + 1][model as keyof TTABenchmarkPoint] as number || 0;
                const x1 = TTA_BENCHMARK_DATA[i].context;
                const x2 = TTA_BENCHMARK_DATA[i + 1].context;
                auc += ((y1 + y2) / 2) * (x2 - x1);
            }
            const ttaValue = parseInt(model.split('TTA ')[1]);
            return {
                model,
                tta: ttaValue,
                logTta: Math.log10(ttaValue),
                aucPercent: (auc / maxPossibleAUC)
            };
        });
    }, []);

    // Dimensions
    // Dimensions optimized for full-width impact
    const width = 1000;
    const height = 800;
    const padding = { top: 60, right: 80, bottom: 90, left: 80 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // AUC Plot Dimensions
    const aucHeight = 700;
    const aucPlotHeight = aucHeight - padding.top - padding.bottom;

    // Domain
    const xMin = 13;
    const xMax = 30;
    const yMin = 0;
    const yMax = 100;

    // Scale functions
    const getX = (val: number) => padding.left + ((val - xMin) / (xMax - xMin)) * plotWidth;
    const getY = (val: number) => padding.top + plotHeight - ((val - yMin) / (yMax - yMin)) * plotHeight;

    // AUC scale functions (Optimized for 1000px width)
    const getAucX = (val: number) => (padding.left + 50) + (val / 4) * (plotWidth - 100);
    const getAucY = (val: number) => padding.top + aucPlotHeight - val * aucPlotHeight;

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

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i - 1] || points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    };

    // Get data points for a model
    const getDataPoints = (model: string) => {
        return TTA_BENCHMARK_DATA
            .filter(d => d[model as keyof TTABenchmarkPoint] !== undefined)
            .map(d => ({
                x: getX(d.context),
                y: getY(d[model as keyof TTABenchmarkPoint] as number),
                context: d.context,
                value: d[model as keyof TTABenchmarkPoint] as number
            }));
    };



    const isHighlighted = (model: string) => {
        if (!hoveredModel) return true;
        return hoveredModel === model;
    };

    const isRio = (model: string) => RIO_MODELS.includes(model);
    const isHeroLine = (model: string) => model === 'Rio 3 TTA 10000';

    // Get opacity for lines based on state
    const getLineOpacity = (model: string) => {
        if (hoveredModel) {
            return hoveredModel === model ? 1 : 0.12;
        }
        if (isRio(model)) return isHeroLine(model) ? 1 : 0.7;
        return 0.5;
    };

    // Get stroke width
    const getStrokeWidth = (model: string) => {
        if (hoveredModel === model) return isRio(model) ? 5 : 3.5;
        if (isHeroLine(model)) return 4;
        if (isRio(model)) return 2.5;
        return 2;
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

    // Milestones to label on X-axis
    const milestoneContexts = Array.from({ length: 30 - 13 + 1 }, (_, i) => 13 + i);

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
        <div style={breakoutStyle} className="flex flex-col gap-24 my-32">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
                {/* Left: Training Scaling */}
                <div className="overflow-hidden rounded-[2.5rem] bg-white p-12 shadow-sm border border-slate-200 flex flex-col items-center">
                    <div className="text-center z-10 mb-[-20px]">
                        <h4 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Attention Accuracy
                            <span className="block text-slate-500 mt-1">durante o treinamento</span>
                        </h4>
                    </div>

                    <div className="relative w-full">
                        <svg viewBox={`0 0 ${width} ${aucHeight}`} className="w-full h-auto">
                            {/* Axes */}
                            <line x1={padding.left} y1={aucHeight - padding.bottom} x2={width - padding.right} y2={aucHeight - padding.bottom} stroke="#E2E8F0" strokeWidth={3} />
                            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={aucHeight - padding.bottom} stroke="#E2E8F0" strokeWidth={3} />

                            {/* Grid labels */}
                            {[0, 0.5, 1].map(v => (
                                <text key={v} x={padding.left - 24} y={getAucY(v) + 8} textAnchor="end" className="text-lg font-black fill-slate-400">{Math.round(v * 100)}%</text>
                            ))}

                            {/* X-axis labels */}
                            {['10^20', '10^21', '10^22', '10^23'].map((label, i) => (
                                <text key={i} x={padding.left + 50 + (i / 3) * (plotWidth - 100)} y={aucHeight - padding.bottom + 45} textAnchor="middle" className="text-lg font-black fill-slate-400">{label}</text>
                            ))}

                            {/* X-axis title */}
                            <text x={padding.left + plotWidth / 2} y={aucHeight - 15} textAnchor="middle" className="text-sm font-black uppercase tracking-[0.3em] fill-slate-300">
                                Training Compute (log scale)
                            </text>

                            {/* Placeholder Line for Training - clean stylistic look */}
                            <path
                                d={`M ${[0, 1, 2, 3].map(i => `${padding.left + 50 + (i / 3) * (plotWidth - 100)} ${getAucY(0.1 + i * 0.25)}`).join(' L ')}`}
                                fill="none"
                                stroke="#CBD5E1"
                                strokeWidth={5}
                                strokeDasharray="12 12"
                                opacity={0.5}
                            />
                        </svg>
                    </div>
                </div>

                {/* Right: Test-Time Scaling (Our Actual Data) */}
                <div className="overflow-hidden rounded-[2.5rem] bg-white p-12 shadow-sm border border-slate-200 flex flex-col items-center">
                    <div className="text-center z-10 mb-[-20px]">
                        <h4 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Attention Accuracy
                            <span className="block text-slate-500 mt-1">com Test-Time Attention</span>
                        </h4>
                    </div>

                    <div className="relative w-full">
                        <svg viewBox={`0 0 ${width} ${aucHeight}`} className="w-full h-auto">
                            {/* Axes */}
                            <line x1={padding.left} y1={aucHeight - padding.bottom} x2={width - padding.right} y2={aucHeight - padding.bottom} stroke="#E2E8F0" strokeWidth={3} />
                            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={aucHeight - padding.bottom} stroke="#E2E8F0" strokeWidth={3} />

                            {/* Grid labels */}
                            {[0, 0.5, 1].map(v => (
                                <text key={v} x={padding.left - 24} y={getAucY(v) + 8} textAnchor="end" className="text-lg font-black fill-slate-400">{Math.round(v * 100)}%</text>
                            ))}

                            {/* X-axis TTA labels */}
                            {[1, 10, 100, 1000, 10000].map(tta => (
                                <text key={tta} x={getAucX(Math.log10(tta))} y={aucHeight - padding.bottom + 45} textAnchor="middle" className="text-lg font-black fill-slate-400">{tta >= 1000 ? `${tta / 1000}K` : tta}</text>
                            ))}

                            {/* X-axis title */}
                            <text x={padding.left + plotWidth / 2} y={aucHeight - 15} textAnchor="middle" className="text-sm font-black uppercase tracking-[0.3em] fill-slate-300">
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
                            {aucScalingData.map((d, i) => (
                                <g key={d.model}>
                                    <circle cx={getAucX(d.logTta)} cy={getAucY(d.aucPercent)} r={8} fill="white" stroke="#3B82F6" strokeWidth={4} />
                                    <text x={getAucX(d.logTta)} y={getAucY(d.aucPercent) - 28} textAnchor="middle" className="text-xl font-black fill-slate-900">{(d.aucPercent * 100).toFixed(1)}%</text>
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>
            </div>

            {/* 2. Original Retrieval Detail Chart */}
            <div className="w-full overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                        <div className="flex-1 min-w-[280px]">
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Many Needles in a Haystack</h4>
                            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed max-w-lg">
                                Nossa versão super difícil do clássico benchmark Needle in a Haystack.
                            </p>
                        </div>
                        {/* Context Indicator (HUD Mode) */}
                        <AnimatePresence>
                            {hoveredContext !== null && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl"
                                >
                                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Context</div>
                                    <motion.div
                                        key={hoveredContext}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.08 }}
                                        className="flex items-baseline gap-1"
                                    >
                                        <span className="text-lg font-black text-slate-900">{formatContext(hoveredContext)}</span>
                                        <span className="text-xs font-medium text-slate-400">Tokens</span>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Dynamic HUD Legend */}
                    <div className="flex flex-col items-center gap-2 text-xs mt-6 min-h-[60px]">
                        {/* Rio Legend Row */}
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2 min-w-[60px]">
                                <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-blue-300 to-blue-700" />
                                <span className="font-bold text-slate-600 text-sm uppercase tracking-widest">Rio 3</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {RIO_MODELS.map(m => {
                                    const val = hoveredContext !== null
                                        ? TTA_BENCHMARK_DATA.find(p => p.context === hoveredContext)?.[m as keyof TTABenchmarkPoint]
                                        : undefined;

                                    return (
                                        <button
                                            key={m}
                                            onMouseEnter={() => setHoveredModel(m)}
                                            onMouseLeave={() => setHoveredModel(null)}
                                            className={`group flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-75 ${hoveredModel === m
                                                ? 'bg-blue-100 ring-1 ring-blue-200 scale-[1.02]'
                                                : 'hover:bg-slate-100'
                                                } ${isHeroLine(m) ? 'font-bold' : ''}`}
                                        >
                                            <div
                                                className={`rounded-full transition-all ${isHeroLine(m) ? 'w-2.5 h-2.5 ring-1 ring-blue-300' : 'w-2 h-2'}`}
                                                style={{ backgroundColor: RIO_COLORS[m] }}
                                            />
                                            <div className="flex items-baseline gap-1.5 leading-none">
                                                <span className={`${isHeroLine(m) ? 'text-blue-700 font-bold' : 'text-slate-600 font-bold'} text-sm font-mono`}>
                                                    {TTA_LABELS[m]}
                                                </span>
                                                {/* Value Indicator (HUD) */}
                                                <AnimatePresence>
                                                    {val !== undefined && (
                                                        <motion.span
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.08 }}
                                                            className={`text-[11px] font-black tabular-nums ${isHeroLine(m) ? 'text-blue-600' : 'text-slate-700'}`}
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
                        </div>

                        {/* Baselines Legend Row */}
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                            {BASELINE_MODELS.map(m => {
                                const val = hoveredContext !== null
                                    ? TTA_BENCHMARK_DATA.find(p => p.context === hoveredContext)?.[m as keyof TTABenchmarkPoint]
                                    : undefined;

                                // Short names for HUD
                                const shortName = m === 'Claude Opus 4.5' ? 'Claude 4.5 Opus'
                                    : m === 'DeepSeek v3.2' ? 'DeepSeek V3.2'
                                        : m === 'GPT-5.2 xhigh' ? 'GPT 5.2'
                                            : m === 'Gemini 3 Pro' ? 'Gemini 3.0 Pro Preview'
                                                : m;

                                return (
                                    <button
                                        key={m}
                                        onMouseEnter={() => setHoveredModel(m)}
                                        onMouseLeave={() => setHoveredModel(null)}
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-75 ${hoveredModel === m
                                            ? 'bg-slate-200 ring-1 ring-slate-300 scale-[1.02]'
                                            : 'hover:bg-slate-100'
                                            }`}
                                    >
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BASELINE_COLORS[m] }} />
                                        <span className="font-bold text-slate-500 text-sm">{shortName}</span>

                                        {/* Value Indicator (HUD) */}
                                        <AnimatePresence mode="wait">
                                            {val !== undefined && (
                                                <motion.span
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: 'auto' }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    className="ml-1 text-[11px] font-bold text-slate-600"
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
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.08" />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
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


                        {/* Grid - Horizontal lines */}
                        {[0, 25, 50, 75, 100].map(y => (
                            <g key={y}>
                                <line
                                    x1={padding.left}
                                    y1={getRetY(y)}
                                    x2={retWidth - padding.right}
                                    y2={getRetY(y)}
                                    stroke={y === 50 ? '#CBD5E1' : '#F1F5F9'}
                                    strokeWidth={y === 50 ? 1 : 1}
                                    strokeDasharray={y === 50 ? undefined : '3 6'}
                                />
                                <text
                                    x={padding.left - 14}
                                    y={getRetY(y) + 4}
                                    textAnchor="end"
                                    className="text-[11px] font-semibold fill-slate-400"
                                >
                                    {y}%
                                </text>
                            </g>
                        ))}

                        {/* Spotlight Guidelines */}
                        {[17, 20, 30].map(val => (
                            <line
                                key={`spotlight-line-${val}`}
                                x1={getRetX(val)}
                                y1={padding.top}
                                x2={getRetX(val)}
                                y2={retHeight - padding.bottom}
                                stroke="#E2E8F0"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                            />
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
                                            ? 'text-[13px] font-black fill-slate-900'
                                            : hoveredContext === d.context
                                                ? 'text-[11px] font-bold fill-blue-600'
                                                : 'text-[11px] font-bold fill-slate-400'
                                            }`}
                                    >
                                        {label}
                                    </text>
                                    {isSpotlight && (
                                        <rect
                                            x={getRetX(d.context) - 20}
                                            y={retHeight - padding.bottom + 36}
                                            width={40}
                                            height={2}
                                            fill="#3B82F6"
                                            rx={1}
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* X-axis title */}
                        <text
                            x={padding.left + retPlotWidth / 2}
                            y={retHeight - 12}
                            textAnchor="middle"
                            className="text-xs font-black uppercase tracking-[0.2em] fill-slate-500"
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
                                filter={hoveredModel === model ? 'url(#line-glow)' : undefined}
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
                                className="cursor-crosshair"
                                onMouseEnter={() => setHoveredContext(d.context)}
                                onMouseLeave={() => setHoveredContext(null)}
                            />
                        ))}

                        {/* Hover line and dots */}
                        {hoveredContext !== null && (
                            <g>
                                <line
                                    x1={getRetX(hoveredContext)}
                                    y1={padding.top}
                                    x2={getRetX(hoveredContext)}
                                    y2={padding.top + retPlotHeight}
                                    stroke="#94A3B8"
                                    strokeWidth={1}
                                    strokeDasharray="3 3"
                                />
                                {[...RIO_MODELS, ...BASELINE_MODELS]
                                    .map(model => {
                                        const d = TTA_BENCHMARK_DATA.find(p => p.context === hoveredContext);
                                        const val = d?.[model as keyof TTABenchmarkPoint];
                                        if (val === undefined) return null;
                                        return (
                                            <circle
                                                key={model}
                                                cx={getRetX(hoveredContext)}
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
    );
};
