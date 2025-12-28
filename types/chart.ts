/**
 * Chart-related type definitions.
 * Extracted from detail components to enable sharing.
 */

// ============================================================================
// Chart Configuration Types
// ============================================================================

export type ComparisonMetric = 'gpqa' | 'aime' | 'livebench' | 'matharena' | 'hle';

export type LabelPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export type LabelOverride =
  | LabelPosition
  | {
    aime?: LabelPosition;
    gpqa?: LabelPosition;
    livebench?: LabelPosition;
    matharena?: LabelPosition;
    hle?: LabelPosition;
  };

/**
 * Data point for model comparison scatter plots.
 */
export interface ModelComparisonDatum {
  model: string;
  cost: number;
  gpqa: number;
  aime: number;
  livebench?: number;
  matharena?: number;
  hle?: number;
  color: string;
  isRio: boolean;
}

/**
 * Benchmark row for performance comparison tables.
 */
export interface BenchmarkRow {
  metric: string;
  base: string;
  rl: string;
  latent: string;
}

/**
 * Configuration for chart label positioning.
 */
export interface LabelPositionConfig {
  dx: number;
  dy: number;
  anchor: 'start' | 'end';
}

/**
 * Chart dimension configuration.
 */
export interface ChartDimensions {
  width: number;
  height: number;
}

/**
 * Chart padding configuration.
 */
export interface ChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Metric configuration for comparison charts.
 */
export interface MetricConfig {
  key: ComparisonMetric;
  label: string;
  yTicks: number[];
  minY: number;
}

// ============================================================================
// Chart Constants (shared across detail components)
// ============================================================================

export const CHART_DIMENSIONS: ChartDimensions = { width: 720, height: 340 };

export const CHART_PADDING: ChartPadding = { top: 20, right: 32, bottom: 60, left: 58 };

export const COST_TICKS = [0.1, 1, 10];

export const COST_DOMAIN = {
  min: 0.05,
  max: 30,
};

export const DEFAULT_Y_MIN = 65;

export const LABEL_POSITION_CONFIG: Record<LabelPosition, LabelPositionConfig> = {
  'top-right': { dx: 12, dy: -12, anchor: 'start' },
  'top-left': { dx: -12, dy: -12, anchor: 'end' },
  'bottom-right': { dx: 12, dy: 16, anchor: 'start' },
  'bottom-left': { dx: -12, dy: 16, anchor: 'end' },
};
