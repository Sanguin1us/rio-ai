/**
 * Benchmark data for model comparison charts.
 * Centralized from Rio25OpenDetail, Rio2014BDetail, and Rio2032BDetail.
 */

import type { BenchmarkRow, ModelComparisonDatum, LabelOverride } from '../types/chart';

// ============================================================================
// Internal Benchmark Data (Bar Charts)
// ============================================================================

/**
 * Rio 2.5 Open benchmark performance data.
 * Shows base, RL (Reinforcement Learning), and latent reasoning scores.
 */
export const RIO_25_OPEN_BENCHMARKS: BenchmarkRow[] = [
  { metric: 'AIME 2025', base: '85.0', rl: '93.3', latent: '95.0' },
  { metric: 'HMMT 2025', base: '71.4', rl: '80.0', latent: '83.3' },
  { metric: 'GPQA Diamond', base: '73.4', rl: '75.8', latent: '77.2' },
  { metric: 'LiveCodeBench v6', base: '66.0', rl: '69.4', latent: '69.6' },
];

/**
 * Rio 2.0 Open (14B) benchmark performance data.
 */
export const RIO_20_OPEN_BENCHMARKS: BenchmarkRow[] = [
  { metric: 'AIME 2025', base: '72.0', rl: '78.5', latent: '82.0' },
  { metric: 'HMMT 2025', base: '58.2', rl: '65.8', latent: '70.1' },
  { metric: 'GPQA Diamond', base: '65.8', rl: '70.2', latent: '72.5' },
  { metric: 'LiveCodeBench v6', base: '55.0', rl: '60.2', latent: '62.8' },
];

// ============================================================================
// External Comparison Data (Scatter Plots)
// ============================================================================

/**
 * Model comparison data for GPQA Diamond and AIME 2025 scatter plots.
 * Cost is in $/million tokens (input + output average).
 */
export const MODEL_COMPARISON_DATA: ModelComparisonDatum[] = [
  // Rio Models (highlighted)
  { model: 'Rio 2.5 Open', cost: 0.3, gpqa: 77.2, aime: 95.0, color: '#002B7F', isRio: true },

  // OpenAI Models
  { model: 'GPT-5.2', cost: 15.0, gpqa: 92.4, aime: 100.0, color: '#10a37f', isRio: false },
  { model: 'GPT-5 mini', cost: 1.1, gpqa: 75.0, aime: 87.0, color: '#10a37f', isRio: false },
  { model: 'o3', cost: 20.0, gpqa: 87.7, aime: 96.7, color: '#10a37f', isRio: false },
  { model: 'o4-mini', cost: 1.1, gpqa: 81.4, aime: 93.4, color: '#10a37f', isRio: false },

  // Google Models
  { model: 'Gemini 3 Pro', cost: 2.5, gpqa: 84.0, aime: 92.0, color: '#4285F4', isRio: false },
  { model: 'Gemini 3 Flash', cost: 0.15, gpqa: 79.6, aime: 90.3, color: '#4285F4', isRio: false },

  // Anthropic Models
  { model: 'Claude Sonnet 4.5', cost: 9.0, gpqa: 84.8, aime: 86.7, color: '#D4A574', isRio: false },

  // Open Source Models
  { model: 'DeepSeek R1', cost: 2.19, gpqa: 71.5, aime: 79.8, color: '#FF6B35', isRio: false },
  { model: 'Qwen 3 235B', cost: 2.0, gpqa: 71.1, aime: 85.7, color: '#7C3AED', isRio: false },
];

/**
 * Label position overrides for scatter plot data points.
 * Prevents label overlap by specifying quadrant positioning.
 */
export const LABEL_POSITION_OVERRIDES: Partial<Record<string, LabelOverride>> = {
  'Gemini 3 Pro': 'top-left',
  'GPT-5.2': 'bottom-right',
  'Gemini 3 Flash': 'bottom-right',
  'Claude Sonnet 4.5': 'bottom-left',
  o3: { aime: 'top-left', gpqa: 'top-right' },
  'o4-mini': { aime: 'bottom-left', gpqa: 'top-right' },
  'GPT-5 mini': { aime: 'bottom-right', gpqa: 'top-right' },
  'Rio 2.5 Open': 'top-left',
};

// ============================================================================
// Metric Configurations
// ============================================================================

/**
 * Configuration for comparison chart metrics.
 */
export const METRIC_CONFIGS = [
  {
    key: 'aime' as const,
    label: 'AIME 2025 (%)',
    yTicks: [70, 80, 90, 100],
    minY: 70,
  },
  {
    key: 'gpqa' as const,
    label: 'GPQA Diamond (%)',
    yTicks: [65, 75, 85, 95],
    minY: 65,
  },
];
