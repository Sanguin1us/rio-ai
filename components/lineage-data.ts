import { RIO_MODELS } from '../constants';
import type { Model } from '../types/index';
import {
  LucideIcon,
  Atom,
  Bot,
  Music,
  Palette,
  Box,
  Map,
  Brain,
  Hammer,
  FileText,
  Eye,
  Mic,
  Sparkles,
} from 'lucide-react';

export interface LineageNode {
  id: string;
  label: string;
  model?: Model;
  icon?: LucideIcon;
  x: number;
  y: number;
  parents: string[];
  externalUrl?: string;
}

// Helper to find model by name (fuzzy match ignoring version)
const findModel = (name: string) => {
  // Try to find a model that contains the name (e.g. "Rio ML" matches "Rio 2.5 ML")
  // We prioritize "2.5" versions if multiple exist, but for now just finding any is fine.
  return RIO_MODELS.find(
    (m) => m.name.includes(name) || m.name.includes(name.replace('Rio ', 'Rio 2.5 '))
  );
};

// Layout Grid:
// X=0: Qwen Root
// X=1: Primary Derivatives (Thinking, Tool, Visão, TTS, STT, Terra, Open)
// X=2: Secondary (Search, Grounding, OCR, Desenho, 3D, Voz, Code)
// X=3: Tertiary (Robótica, Música, ML, Cientista)
// X=4: Omni

export const LINEAGE_NODES: LineageNode[] = [
  {
    id: 'qwen-30b',
    label: 'Qwen 3 30B',
    x: 0,
    y: 0,
    parents: [],
    model: undefined,
    externalUrl: 'https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507',
  },
  {
    id: 'qwen',
    label: 'Qwen 3 Next',
    x: 0,
    y: 3.5,
    parents: [],
    model: undefined,
    externalUrl: 'https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Thinking',
  },

  // --- Generation 1 (Direct from Qwen) ---
  {
    id: 'rio-thinking',
    label: 'Rio Thinking',
    x: 1,
    y: 1,
    parents: ['qwen'],
    model: RIO_MODELS.find((m) => m.name === 'Rio 2.5'),
    icon: Brain,
  },
  {
    id: 'rio-tool',
    label: 'Rio Tool',
    x: 1,
    y: 2,
    parents: ['qwen'],
    model: findModel('Rio Tool'),
    icon: Hammer,
  },
  {
    id: 'rio-visao',
    label: 'Rio Visão',
    x: 1,
    y: 3.5,
    parents: ['qwen'],
    model: findModel('Visão'),
  },
  { id: 'rio-tts', label: 'Rio TTS', x: 1, y: 6, parents: ['qwen'], model: findModel('Voz') }, // Mapping TTS to Voz roughly if needed
  {
    id: 'rio-stt',
    label: 'Rio STT',
    x: 1,
    y: 7,
    parents: ['qwen'],
    model: findModel('Transcrição'),
  },
  {
    id: 'rio-terra',
    label: 'Rio Terra',
    x: 1,
    y: 5,
    parents: ['qwen'],
    model: undefined,
    icon: Map,
  },
  { id: 'rio-open', label: 'Rio Open', x: 1, y: 0, parents: ['qwen-30b'], model: findModel('Open') },

  // --- Generation 2 ---
  // From Thinking -> Code
  {
    id: 'rio-code',
    label: 'Rio Code',
    x: 2,
    y: 0.5,
    parents: ['rio-thinking'],
    model: findModel('ML'),
  }, // ML is closest to Code

  // From Thinking/Tool -> Search
  {
    id: 'rio-search',
    label: 'Rio Search',
    x: 2,
    y: 1.5,
    parents: ['rio-thinking', 'rio-tool'],
    model: findModel('Search'),
  },

  // From Visão -> Grounding, OCR, Desenho, 3D
  {
    id: 'rio-grounding',
    label: 'Rio Grounding',
    x: 2,
    y: 4.5,
    parents: ['rio-visao'],
    model: findModel('Grounding'),
  },
  {
    id: 'rio-video',
    label: 'Rio Vídeo',
    x: 2,
    y: 3.833,
    parents: ['rio-visao'],
    model: findModel('Rio Vídeo'),
  },
  {
    id: 'rio-ocr',
    label: 'Rio OCR',
    x: 2,
    y: 3.166,
    parents: ['rio-visao'],
    model: findModel('Visão'),
    icon: FileText,
  }, // OCR is part of Visão usually
  {
    id: 'rio-desenho',
    label: 'Rio Desenho',
    x: 3,
    y: 4.5,
    parents: ['rio-video'],
    model: undefined,
    icon: Palette,
  },
  {
    id: 'rio-3d',
    label: 'Rio 3D',
    x: 2,
    y: 2.5,
    parents: ['rio-visao'],
    model: undefined,
    icon: Box,
  },

  // From TTS/STT -> Voz
  {
    id: 'rio-voz',
    label: 'Rio Voz',
    x: 2,
    y: 6.5,
    parents: ['rio-tts', 'rio-stt'],
    model: findModel('Voz'),
  },

  // --- Generation 3 ---
  // From Code -> ML
  { id: 'rio-ml', label: 'Rio ML', x: 3, y: 0, parents: ['rio-code'], model: findModel('ML') },

  // From Thinking, Code -> Cientista
  {
    id: 'rio-cientista',
    label: 'Rio Cientista',
    x: 3,
    y: 1,
    parents: ['rio-thinking', 'rio-code'],
    model: undefined,
    icon: Atom,
  },

  // From Grounding -> Robótica
  {
    id: 'rio-robotica',
    label: 'Rio Robótica',
    x: 3,
    y: 5.5,
    parents: ['rio-grounding', 'rio-voz'],
    model: undefined,
    icon: Bot,
  },

  // From Voz -> Música
  {
    id: 'rio-musica',
    label: 'Rio Música',
    x: 3,
    y: 6.5,
    parents: ['rio-voz'],
    model: undefined,
    icon: Music,
  },

  // --- Generation 4 (Convergence) ---
  {
    id: 'rio-omni',
    label: 'Rio Omni',
    x: 4,
    y: 3.5,
    parents: [
      'rio-thinking',
      'rio-tool',
      'rio-search',
      'rio-visao',
      'rio-grounding',
      'rio-ocr',
      'rio-desenho',
      'rio-voz',
      'rio-code',
      'rio-ml',
      'rio-video',
      'rio-3d',
      'rio-cientista',
      'rio-musica',
      'rio-robotica',
    ],
    model: findModel('Omni'),
  },
];

// --- Generation 1 Data ---
export const RIO_1_NODES: LineageNode[] = [
  {
    id: 'qwen-2.5-instruct',
    label: 'Qwen 2.5 Instruct',
    x: 1,
    y: 3.5,
    parents: [],
    model: undefined,
    externalUrl: 'https://huggingface.co/collections/Qwen/qwen25',
  },
  {
    id: 'rio-1',
    label: 'Rio 1',
    x: 3,
    y: 3.5,
    parents: ['qwen-2.5-instruct'],
    model: findModel('Rio 1'),
    icon: Brain,
  },
];

// --- Generation 1.5 Data ---
// Layout:
// Col 0: Origins (Qwen 2.5, Qwen VL)
// Col 1: Direct (Rio 1.5)
// Col 2: Derived (Rio 1.6, Ipiranga, Niemeyer) - Note: Ipiranga/Niemeyer rely on both Rio 1.5 and Qwen VL

export const RIO_1_5_NODES: LineageNode[] = [
  // Origins
  {
    id: 'qwen-2.5-instruct',
    label: 'Qwen 2.5 Instruct',
    x: 0,
    y: 2,
    parents: [],
    model: undefined,
    externalUrl: 'https://huggingface.co/collections/Qwen/qwen25',
  },
  {
    id: 'qwen-2.5-vl',
    label: 'Qwen 2.5 VL',
    x: 0,
    y: 5,
    parents: [],
    model: undefined,
    icon: Eye,
    externalUrl: 'https://huggingface.co/collections/Qwen/qwen25-vl',
  },

  // Primary
  {
    id: 'rio-1.5',
    label: 'Rio 1.5',
    x: 2,
    y: 2,
    parents: ['qwen-2.5-instruct'],
    model: findModel('Rio 1.5'),
    icon: Brain,
  },

  // Secondary / Experimental
  {
    id: 'rio-1.6',
    label: 'Rio 1.6',
    x: 4,
    y: 2,
    parents: ['rio-1.5'],
    model: findModel('Rio 1.6'),
    icon: Brain,
  },
  {
    id: 'ipiranga',
    label: 'Ipiranga',
    x: 4,
    y: 4,
    parents: ['qwen-2.5-vl', 'rio-1.5'],
    model: findModel('Ipiranga'),
    icon: Eye,
  },
  {
    id: 'niemeyer',
    label: 'Niemeyer',
    x: 4,
    y: 6,
    parents: ['qwen-2.5-vl', 'rio-1.5'],
    model: findModel('Niemeyer'),
    icon: Palette,
  },
];

// --- Generation 2.0 Data ---
// Layout Plan:
// Col 0: Origins (Qwen 2.5, Qwen VL)
// Col 1: Direct Gen 1
// Col 2: Gen 2 (Specialized)
// Col 3: Gen 3 (Integrated)
// Col 4: Flagship (Omni)

export const RIO_2_NODES: LineageNode[] = [
  // Origins
  {
    id: 'qwen-2.5-instruct',
    label: 'Qwen 2.5 Instruct',
    x: 0,
    y: 2,
    parents: [],
    model: undefined,
    externalUrl: 'https://huggingface.co/collections/Qwen/qwen25',
  },
  {
    id: 'qwen-2.5-vl',
    label: 'Qwen 2.5 VL',
    x: 0,
    y: 6,
    parents: [],
    model: undefined,
    icon: Eye,
    externalUrl: 'https://huggingface.co/collections/Qwen/qwen25-vl',
  },

  // Gen 1
  {
    id: 'rio-open',
    label: 'Rio Open',
    x: 1,
    y: 4.5,
    parents: ['qwen-2.5-instruct'],
    model: findModel('Rio 2.0 Open'),
  },
  {
    id: 'rio-fala',
    label: 'Rio Fala',
    x: 1,
    y: 0.5,
    parents: ['qwen-2.5-instruct'],
    model: findModel('Rio Fala'),
    icon: Mic,
  },
  {
    id: 'rio-transcricao',
    label: 'Rio Transcrição',
    x: 1,
    y: 1.5,
    parents: ['qwen-2.5-instruct'],
    model: findModel('Rio 2.0 Transcrição'),
  },
  // Direct connection to Thinking/Tool (skipping Nothink as requested)
  {
    id: 'rio-thinking',
    label: 'Rio Thinking',
    x: 1,
    y: 2.5,
    parents: ['qwen-2.5-instruct'],
    model: RIO_MODELS.find((m) => m.name === 'Rio 2.0'),
  },
  {
    id: 'rio-tool-use',
    label: 'Rio Tool Use',
    x: 1,
    y: 3.5,
    parents: ['qwen-2.5-instruct'],
    model: findModel('Rio Tool Use'),
  },
  // Visão
  {
    id: 'rio-visao',
    label: 'Rio Visão',
    x: 1,
    y: 6,
    parents: ['qwen-2.5-vl'],
    model: findModel('Rio 2.0 Visão'),
  },

  // Gen 2 (from Gen 1)
  {
    id: 'rio-voz',
    label: 'Rio Voz',
    x: 2,
    y: 1,
    parents: ['rio-fala', 'rio-transcricao'],
    model: findModel('Rio 2.0 Voz'),
  },

  // Gen 2 (Visão Derivatives)
  {
    id: 'rio-video',
    label: 'Rio Vídeo',
    x: 2,
    y: 4,
    parents: ['rio-visao'],
    model: findModel('Rio Vídeo'),
  },
  {
    id: 'rio-grounding',
    label: 'Rio Grounding',
    x: 2,
    y: 8,
    parents: ['rio-visao'],
    model: findModel('Rio 2.0 Grounding'),
  },
  {
    id: 'rio-ocr',
    label: 'Rio OCR',
    x: 2,
    y: 6,
    parents: ['rio-visao'],
    model: findModel('Rio OCR'),
  },
  {
    id: 'rio-segmentacao',
    label: 'Rio Segmentação',
    x: 2,
    y: 7,
    parents: ['rio-visao'],
    model: findModel('Rio Segmentação'),
  },
  {
    id: 'rio-visao-dinamica',
    label: 'Rio Visão Dinâmica',
    x: 2,
    y: 5,
    parents: ['rio-visao'],
    model: findModel('Rio Visão Dinâmica'),
  },

  // Gen 3 (Integrated)
  {
    id: 'rio-tool-thinking',
    label: 'Rio Tool Thinking',
    x: 2,
    y: 3,
    parents: ['rio-thinking', 'rio-tool-use'],
    model: findModel('Rio Tool Thinking'),
  },
  {
    id: 'rio-explorer',
    label: 'Rio Explorer',
    x: 3,
    y: 8,
    parents: ['rio-grounding'],
    model: findModel('Rio Explorer'),
  },

  // Gen 3.5 (Complex Agents)
  // Connecting Search vertically to Tool Thinking (x=3, y above tool thinking?)
  // Or just putting them at x=3 like Explorer
  {
    id: 'rio-search',
    label: 'Rio Search',
    x: 3,
    y: 3,
    parents: ['rio-tool-thinking'],
    model: findModel('Rio 2.0 Search'),
  },
  {
    id: 'rio-detetive',
    label: 'Rio Detetive',
    x: 3,
    y: 4,
    parents: ['rio-tool-thinking', 'rio-video'],
    model: findModel('Rio Detetive'),
  },

  // Gen 4 (Flagship)
  {
    id: 'rio-omni',
    label: 'Rio Omni',
    x: 4,
    y: 4, // Centered vertically relative to the inputs
    parents: [
      'rio-grounding',
      'rio-voz',
      'rio-search',
      'rio-tool-thinking',
      'rio-detetive',
      'rio-explorer',
      'rio-ocr',
      'rio-segmentacao',
      'rio-visao-dinamica',
    ],
    model: findModel('Rio 2.0 Omni'),
  },
];

export const RIO_2_5_NODES = [...LINEAGE_NODES];

// --- Generation 3.0 Data ---
// Deepthink Internalization Merging: 10 Rio 2.5 Omni instances converge into Rio 3 Preview
export const RIO_3_NODES: LineageNode[] = [
  // The 10 Rio 2.5 Omni instances (arranged in 2 rows of 5)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `rio-2.5-omni-${i + 1}`,
    label: `Rio 2.5 Omni #${i + 1}`,
    x: i < 5 ? i : i - 5,
    y: i < 5 ? 0 : 1,
    parents: [] as string[],
    model: RIO_MODELS.find((m) => m.name === 'Rio 2.5 Omni'),
    icon: Sparkles,
  })),
  // The merged Rio 3 Preview
  {
    id: 'rio-3.0-preview',
    label: 'Rio 3 Preview',
    x: 2,
    y: 3,
    parents: Array.from({ length: 10 }, (_, i) => `rio-2.5-omni-${i + 1}`),
    model: RIO_MODELS.find((m) => m.name === 'Rio 3 Preview'),
    icon: Sparkles,
  },
];
