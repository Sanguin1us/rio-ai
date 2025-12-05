import { RIO_MODELS } from '../constants';
import type { Model } from '../types';

export interface LineageNode {
    id: string;
    label: string;
    model?: Model;
    x: number;
    y: number;
    parents: string[];
}

// Helper to find model by name (fuzzy match ignoring version)
const findModel = (name: string) => {
    // Try to find a model that contains the name (e.g. "Rio ML" matches "Rio 2.5 ML")
    // We prioritize "2.5" versions if multiple exist, but for now just finding any is fine.
    return RIO_MODELS.find((m) => m.name.includes(name) || m.name.includes(name.replace('Rio ', 'Rio 2.5 ')));
};

// Layout Grid:
// X=0: Qwen Root
// X=1: Primary Derivatives (Thinking, Tool, Visão, TTS, STT, Terra, Preview)
// X=2: Secondary (Search, Grounding, OCR, Desenho, 3D, Voz, Code)
// X=3: Tertiary (Robótica, Música, ML, Cientista)
// X=4: Omni

export const LINEAGE_NODES: LineageNode[] = [
    // --- Root ---
    { id: 'qwen', label: 'Qwen 3 Next', x: 0, y: 3.5, parents: [], model: undefined },

    // --- Generation 1 (Direct from Qwen) ---
    { id: 'rio-thinking', label: 'Rio Thinking', x: 1, y: 1, parents: ['qwen'], model: findModel('Rio Thinking') },
    { id: 'rio-tool', label: 'Rio Tool', x: 1, y: 2, parents: ['qwen'], model: findModel('Rio Tool') },
    { id: 'rio-visao', label: 'Rio Visão', x: 1, y: 3.5, parents: ['qwen'], model: findModel('Visão') },
    { id: 'rio-tts', label: 'Rio TTS', x: 1, y: 6, parents: ['qwen'], model: findModel('Voz') }, // Mapping TTS to Voz roughly if needed
    { id: 'rio-stt', label: 'Rio STT', x: 1, y: 7, parents: ['qwen'], model: findModel('Transcrição') },
    { id: 'rio-terra', label: 'Rio Terra', x: 1, y: 5, parents: ['qwen'], model: undefined },
    { id: 'rio-preview', label: 'Rio Preview', x: 1, y: 0, parents: ['qwen'], model: findModel('Preview') },

    // --- Generation 2 ---
    // From Thinking -> Code
    { id: 'rio-code', label: 'Rio Code', x: 2, y: 0.5, parents: ['rio-thinking'], model: findModel('ML') }, // ML is closest to Code

    // From Thinking/Tool -> Search
    { id: 'rio-search', label: 'Rio Search', x: 2, y: 1.5, parents: ['rio-thinking', 'rio-tool'], model: findModel('Search') },

    // From Visão -> Grounding, OCR, Desenho, 3D
    { id: 'rio-grounding', label: 'Rio Grounding', x: 2, y: 3.833, parents: ['rio-visao'], model: findModel('Grounding') },
    { id: 'rio-ocr', label: 'Rio OCR', x: 2, y: 3.166, parents: ['rio-visao'], model: findModel('Visão') }, // OCR is part of Visão usually
    { id: 'rio-desenho', label: 'Rio Desenho', x: 2, y: 2.5, parents: ['rio-visao'], model: undefined },
    { id: 'rio-3d', label: 'Rio 3D', x: 2, y: 4.5, parents: ['rio-visao'], model: undefined },

    // From TTS/STT -> Voz
    { id: 'rio-voz', label: 'Rio Voz', x: 2, y: 6.5, parents: ['rio-tts', 'rio-stt'], model: findModel('Voz') },

    // --- Generation 3 ---
    // From Code -> ML
    { id: 'rio-ml', label: 'Rio ML', x: 3, y: 0, parents: ['rio-code'], model: findModel('ML') },

    // From Thinking, Code -> Cientista
    { id: 'rio-cientista', label: 'Rio Cientista', x: 3, y: 1, parents: ['rio-thinking', 'rio-code'], model: undefined },

    // From Grounding -> Robótica
    { id: 'rio-robotica', label: 'Rio Robótica', x: 3, y: 5, parents: ['rio-grounding', 'rio-voz'], model: undefined },

    // From Voz -> Música
    { id: 'rio-musica', label: 'Rio Música', x: 3, y: 6.5, parents: ['rio-voz'], model: undefined },

    // --- Generation 4 (Convergence) ---
    {
        id: 'rio-omni',
        label: 'Rio Omni',
        x: 4,
        y: 3.5,
        parents: [
            'rio-thinking', 'rio-tool', 'rio-search', 'rio-visao',
            'rio-grounding', 'rio-ocr', 'rio-desenho',
            'rio-voz', 'rio-code', 'rio-ml'
        ],
        model: findModel('Omni')
    },
];
