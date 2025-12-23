import React, { useState } from 'react';
import type {
    ComparisonMetric,
    LabelPosition,
    LabelOverride,
    ModelComparisonDatum,
} from '../../types/chart';
import {
    CHART_DIMENSIONS,
    CHART_PADDING,
    COST_TICKS,
    COST_DOMAIN,
    DEFAULT_Y_MIN,
    LABEL_POSITION_CONFIG,
} from '../../types/chart';

/**
 * Props for the ComparisonChart component.
 */
export interface ComparisonChartProps {
    /** Metric key to display (e.g., 'gpqa', 'aime') */
    metric: ComparisonMetric;
    /** Label to display above the chart */
    label: string;
    /** Y-axis tick values */
    yTicks: number[];
    /** Minimum Y value (defaults to DEFAULT_Y_MIN) */
    minY?: number;
    /** Model comparison data to plot */
    data: ModelComparisonDatum[];
    /** Optional label position overrides for specific models */
    labelOverrides?: Partial<Record<string, LabelOverride>>;
    /** Optional minimum cost for X-axis (defaults to COST_DOMAIN.min) */
    minCost?: number;
}

/**
 * Formats a cost value for display.
 */
function formatCost(value: number): string {
    if (value >= 1) {
        const formatted = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
        return `$${formatted}`;
    }
    if (value >= 0.1) return `$${value.toFixed(1)}`;
    return `$${value.toFixed(2)}`;
}

/**
 * Formats a score value for tooltip display.
 */
function formatTooltipScore(value: number): string {
    return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

/**
 * Formats a cost value for tooltip display.
 */
function formatTooltipCost(value: number): string {
    if (value < 1) return `$${value.toFixed(2)}`;
    const fixed = value.toFixed(2);
    return `$${fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed}`;
}

/**
 * Safely gets the metric value from a data item.
 * Returns 0 as fallback for optional metrics.
 */
function getMetricValue(item: ModelComparisonDatum, metric: ComparisonMetric): number {
    const value = item[metric];
    return value ?? 0;
}

/**
 * A reusable scatter plot chart component for comparing AI models.
 * 
 * Features:
 * - Log-scale X axis for cost
 * - Linear Y axis for score
 * - Interactive hover tooltips
 * - Automatic label positioning
 * - Rio models highlighted
 * 
 * @example
 * ```tsx
 * <ComparisonChart
 *   metric="gpqa"
 *   label="GPQA Diamond"
 *   yTicks={[65, 75, 85, 95]}
 *   data={MODEL_COMPARISON_DATA}
 *   labelOverrides={{ 'GPT-5.2': 'bottom-right' }}
 * />
 * ```
 */
export const ComparisonChart: React.FC<ComparisonChartProps> = ({
    metric,
    label,
    yTicks,
    minY,
    data,
    labelOverrides = {},
    minCost,
}) => {
    const [hovered, setHovered] = useState<ModelComparisonDatum | null>(null);

    const { width, height } = CHART_DIMENSIONS;
    const { top, right, bottom, left } = CHART_PADDING;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    const logMin = Math.log10(minCost ?? COST_DOMAIN.min);
    const logMax = Math.log10(COST_DOMAIN.max);

    // Filter out items that don't have the required metric
    const filteredData = data.filter((item) => item[metric] !== undefined);
    const metricValues = filteredData.map((item) => getMetricValue(item, metric));
    const domainMinBase = minY ?? DEFAULT_Y_MIN;
    const firstTick = yTicks[0] ?? DEFAULT_Y_MIN;
    const lastTick = yTicks[yTicks.length - 1] ?? 100;
    const domainMin = Math.min(domainMinBase, ...metricValues, firstTick);
    const domainMax = Math.max(Math.max(...metricValues), lastTick);

    const getX = (cost: number) => {
        const ratio = (Math.log10(cost) - logMin) / Math.max(logMax - logMin, 1);
        return left + ratio * plotWidth;
    };

    const getY = (value: number) => {
        const ratio = (value - domainMin) / Math.max(domainMax - domainMin, 1);
        return height - bottom - ratio * plotHeight;
    };

    const resolveLabelPosition = (model: string, defaultAnchor: 'start' | 'end') => {
        const override = labelOverrides[model];
        const specific = typeof override === 'string' ? override : override?.[metric];
        const fallback: LabelPosition = defaultAnchor === 'end' ? 'top-left' : 'top-right';
        const position = specific ?? (typeof override === 'string' ? override : fallback);
        return LABEL_POSITION_CONFIG[position];
    };

    const tooltipMetrics = hovered
        ? {
            pointX: getX(hovered.cost),
            pointY: getY(getMetricValue(hovered, metric)),
            score: getMetricValue(hovered, metric),
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
        <div className="rounded-3xl bg-white/80 p-4 sm:p-5">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.5em] text-rio-primary">
                    {label}
                </p>
            </div>
            <div className="mt-4">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    role="img"
                    className="h-80 w-full"
                    onMouseLeave={() => setHovered(null)}
                >
                    {/* Axes */}
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

                    {/* Y-axis ticks */}
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

                    {/* X-axis ticks */}
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

                    {/* X-axis label */}
                    <text
                        x={(left + width - right) / 2}
                        y={height - 8}
                        textAnchor="middle"
                        className="text-[11px] fill-slate-400"
                    >
                        Custo por 1M tokens (USD)
                    </text>

                    {/* Data points */}
                    {filteredData.map((item) => {
                        const x = getX(item.cost);
                        const metricValue = getMetricValue(item, metric);
                        const y = getY(metricValue);
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
                        const scale = lineLength > shorten ? (lineLength - shorten) / lineLength : 0;
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
                                aria-label={`${item.model} - ${label} ${formatTooltipScore(metricValue)}, custo ${formatTooltipCost(item.cost)} por 1M tokens`}
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

                    {/* Tooltip */}
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
