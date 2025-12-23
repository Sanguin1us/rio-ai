/**
 * Chart utility functions.
 * Extracted from detail components to enable code sharing.
 */

import {
  CHART_DIMENSIONS,
  CHART_PADDING,
  COST_DOMAIN,
  LABEL_POSITION_CONFIG,
  type LabelPosition,
  type LabelOverride,
  type ComparisonMetric,
} from '../types/chart';

// ============================================================================
// Coordinate Calculations
// ============================================================================

/**
 * Calculate X coordinate for a cost value using logarithmic scale.
 */
export function getX(cost: number): number {
  const logMin = Math.log10(COST_DOMAIN.min);
  const logMax = Math.log10(COST_DOMAIN.max);
  const logCost = Math.log10(cost);
  const plotWidth = CHART_DIMENSIONS.width - CHART_PADDING.left - CHART_PADDING.right;
  return CHART_PADDING.left + ((logCost - logMin) / (logMax - logMin)) * plotWidth;
}

/**
 * Calculate Y coordinate for a score value.
 */
export function getY(value: number, minY: number, maxY: number): number {
  const plotHeight = CHART_DIMENSIONS.height - CHART_PADDING.top - CHART_PADDING.bottom;
  return CHART_PADDING.top + plotHeight - ((value - minY) / (maxY - minY)) * plotHeight;
}

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Format cost value for display.
 */
export function formatCost(value: number): string {
  if (value >= 1) {
    return `$${value.toFixed(value % 1 === 0 ? 0 : 1)}`;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Format score for tooltip display.
 */
export function formatTooltipScore(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format cost for tooltip display.
 */
export function formatTooltipCost(value: number): string {
  if (value >= 1) {
    return `$${value.toFixed(2)}/M tokens`;
  }
  return `$${(value * 100).toFixed(0)}¢/M tokens`;
}

/**
 * Parse string score to number.
 */
export function parseScore(value: string): number {
  return parseFloat(value);
}

/**
 * Format delta between two score values.
 */
export function formatDelta(value: string, base: string): string {
  const delta = parseScore(value) - parseScore(base);
  return delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);
}

// ============================================================================
// Benchmark Bar Scaling
// ============================================================================

/**
 * Scale a benchmark value to percentage width.
 */
export function scaleValue(value: string, scaleMin: number, scaleMax: number): number {
  const numericValue = parseScore(value);
  return ((numericValue - scaleMin) / (scaleMax - scaleMin)) * 100;
}

/**
 * Calculate position style for benchmark bar markers.
 */
export function positionStyle(value: string, scaleMin: number, scaleMax: number): { left: string } {
  return { left: `${scaleValue(value, scaleMin, scaleMax)}%` };
}

/**
 * Calculate width and position for benchmark bar segments.
 */
export function segmentStyle(
  start: string,
  end: string,
  scaleMin: number,
  scaleMax: number
): { left: string; width: string } {
  const startPct = scaleValue(start, scaleMin, scaleMax);
  const endPct = scaleValue(end, scaleMin, scaleMax);
  return {
    left: `${startPct}%`,
    width: `${endPct - startPct}%`,
  };
}

// ============================================================================
// Label Positioning
// ============================================================================

/**
 * Resolve label position for a model, considering overrides and metric-specific settings.
 */
export function resolveLabelPosition(
  model: string,
  metric: ComparisonMetric,
  defaultAnchor: 'start' | 'end',
  overrides: Partial<Record<string, LabelOverride>>
): { dx: number; dy: number; anchor: 'start' | 'end' } {
  const override = overrides[model];

  if (override) {
    if (typeof override === 'string') {
      return LABEL_POSITION_CONFIG[override];
    }
    const metricOverride = override[metric];
    if (metricOverride) {
      return LABEL_POSITION_CONFIG[metricOverride];
    }
  }

  // Default positioning based on anchor
  const defaultPosition: LabelPosition = defaultAnchor === 'start' ? 'top-right' : 'top-left';
  return LABEL_POSITION_CONFIG[defaultPosition];
}
