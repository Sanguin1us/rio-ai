import type { Model } from './types/index';
import {
  Code2,
  FileText,
  Mic,
  Aperture,
  BoxSelect,
  Volume2,
  FlaskConical,
  Hammer,
  Terminal,
  Sparkles,
  Brain,
  Globe,
  Eye,
  Scan,
  AudioLines,
  Binary,
  Palette,
  Map,
  Film,
  Search,
} from 'lucide-react';

export const RIO_MODELS: Model[] = [
  {
    name: 'Rio 3 Preview',
    description:
      'Nosso modelo flagship mais avançado, criado através de Deepthink Internalization Merging de 10 instâncias do Rio 2.5 Omni.',
    category: 'Flagship',
    Icon: Sparkles,
    tags: ['Flagship', 'State-of-the-art', 'Deepthink Merging'],
    parameters: '800 Bilhões (30B ativados)',
    supportsChat: false, // API coming soon under rio-3.0
    codeSnippets: [
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-3.0",
  "messages": [{"role": "user", "content": "Resolva este problema de matemática avançada."}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.0 Omni',
    description:
      'Nosso modelo flagship multimodal, unindo as capacidades de Transcrição, ML, Search e Visão em uma única e poderosa IA.',
    category: 'Flagship',
    Icon: Sparkles,
    tags: ['Flagship', 'Multimodal', 'State-of-the-art'],
    supportsChat: true,
  },
  {
    name: 'Rio 2.5 Omni',
    description:
      'Nosso modelo flagship multimodal, unindo as capacidades de Transcrição, ML, Search e Visão em uma única e poderosa IA.',
    category: 'Flagship',
    Icon: Sparkles,
    tags: ['Flagship', 'Multimodal', 'State-of-the-art'],
    supportsChat: true,
  },
  {
    name: 'Rio 2.0',
    description:
      'Modelo de linguagem de grande escala pós-treinado a partir do Qwen 2.5 32B para alta performance em tarefas complexas.',
    category: 'Linguagem',
    Icon: Brain,
    tags: ['Linguagem', '32B Parâmetros'],
    baseModel: 'Qwen 2.5 32B Instruct',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen2.5-32B-Instruct',
    parameters: '32 Bilhões',
    license: 'Uso proprietário (não open source)',
    codeSnippets: [
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.0-32b",
  "messages": [{"role": "user", "content": "Resuma o plano diretor de mobilidade do Rio."}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.5',
    description:
      'Modelo de linguagem de grande escala pós-treinado a partir do Qwen3-Next para alta performance em tarefas complexas.',
    category: 'Linguagem',
    Icon: Brain,
    tags: ['Linguagem', '80B Parâmetros'],
    baseModel: 'Qwen3-Next',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-Next',
    parameters: '80 Bilhões (3B ativados)',
    license: 'Uso proprietário (não open source)',
    codeSnippets: [
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.5",
  "messages": [{"role": "user", "content": "Resuma o plano diretor de mobilidade do Rio."}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.5 Open',
    description:
      'Uma versão aberta do futuro. Este modelo open source, baseado no Qwen 3, oferece um equilíbrio excepcional entre performance e eficiência.',
    category: 'Open Source',
    Icon: FlaskConical,
    tags: ['Open Source', 'CC BY 4.0', '30B Parâmetros', 'Research Open'],
    isOpenSource: true,
    baseModel: 'Qwen 3 30B-A3B 2507 Thinking',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507',
    parameters: '30 Bilhões (3B ativados)',
    license: 'Creative Commons Attribution 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/deed.en',
    datasets: ['nvidia/OpenScienceReasoning-2', 'nvidia/Nemotron-Post-Training-Dataset-v1'],
    datasetLinks: [
      {
        label: 'nvidia/OpenScienceReasoning-2',
        url: 'https://huggingface.co/datasets/nvidia/OpenScienceReasoning-2',
      },
      {
        label: 'nvidia/Nemotron-Post-Training-Dataset-v1',
        url: 'https://huggingface.co/datasets/nvidia/Nemotron-Post-Training-Dataset-v1',
      },
    ],
    huggingFaceUrl: 'https://huggingface.co/IPLANRIO/rio-2.5-open',
    codeSnippets: [
      {
        lang: 'Python',
        Icon: Code2,
        code: `from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("IPLANRIO/rio-2.5-open")
model = AutoModelForCausalLM.from_pretrained("IPLANRIO/rio-2.5-open")

# Experimente a nova geração de modelos Rio!`,
      },
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.5-open",
  "messages": [{"role": "user", "content": "Quais as novidades do Rio 2.5?"}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.0 Open',
    description:
      'Versão open source de alta performance, pós-treinada a partir do Qwen 2.5 14B, ideal para pesquisa e desenvolvimento.',
    category: 'Open Source',
    Icon: FlaskConical,
    tags: ['Open Source', 'CC BY 4.0', '14B Parâmetros'],
    isOpenSource: true,
    baseModel: 'Qwen 2.5 14B Instruct',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen2.5-14B-Instruct',
    parameters: '14 Bilhões',
    license: 'Creative Commons Attribution 4.0 (CC BY 4.0)',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/deed.en',
    datasets: ['nvidia/OpenScienceReasoning-2', 'nvidia/Nemotron-Post-Training-Dataset-v1'],
    datasetLinks: [
      {
        label: 'nvidia/OpenScienceReasoning-2',
        url: 'https://huggingface.co/datasets/nvidia/OpenScienceReasoning-2',
      },
      {
        label: 'nvidia/Nemotron-Post-Training-Dataset-v1',
        url: 'https://huggingface.co/datasets/nvidia/Nemotron-Post-Training-Dataset-v1',
      },
    ],
    huggingFaceUrl: 'https://huggingface.co/IPLANRIO/rio-2.0-14b',
    codeSnippets: [
      {
        lang: 'Python',
        Icon: Code2,
        code: `from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("IPLANRIO/rio-2.0-14b")
model = AutoModelForCausalLM.from_pretrained("IPLANRIO/rio-2.0-14b")

# Seu código de inferência aqui...`,
      },
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.0-14b",
  "messages": [{"role": "user", "content": "Oi, Rio!"}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.0 Search',
    description:
      'Variante do Rio 2.0 otimizada para pesquisas na web, oferecendo respostas rápidas e custo-eficientes.',
    category: 'Busca',
    Icon: Globe,
    tags: ['Open Source', 'Busca na Web'],
    isOpenSource: true,
  },
  {
    name: 'Rio 2.5 Search',
    description:
      'Variante do Rio 2.5 otimizada para pesquisas na web, oferecendo respostas rápidas e custo-eficientes.',
    category: 'Busca',
    Icon: Globe,
    tags: ['Open Source', 'Busca na Web'],
    isOpenSource: true,
  },
  {
    name: 'Rio 2.0 Visão',
    description:
      'Especializado em visão computacional, com foco em OCR e VQA para documentos em português do Brasil.',
    category: 'Visão',
    Icon: Eye,
    tags: ['Visão', 'OCR', 'VQA', 'PT-BR'],
  },
  {
    name: 'Rio 2.5 Visão',
    description:
      'Especializado em visão computacional, com foco em OCR e VQA para documentos em português do Brasil.',
    category: 'Visão',
    Icon: Eye,
    tags: ['Visão', 'OCR', 'VQA', 'PT-BR'],
  },
  {
    name: 'Rio 2.0 Grounding',
    description:
      'Treinado para detectar e localizar objetos em imagens com precisão, utilizando bounding boxes e pontos.',
    category: 'Visão',
    Icon: Scan,
    tags: ['Visão', 'Detecção de Objetos', 'Grounding'],
  },
  {
    name: 'Rio 2.5 Grounding',
    description:
      'Treinado para detectar e localizar objetos em imagens com precisão, utilizando bounding boxes e pontos.',
    category: 'Visão',
    Icon: Scan,
    tags: ['Visão', 'Detecção de Objetos', 'Grounding'],
  },
  {
    name: 'Rio 2.0 Transcrição',
    description:
      'State-of-the-art em transcrição de áudio para texto, com especialização em português do Brasil e inglês.',
    category: 'Áudio',
    Icon: AudioLines,
    tags: ['Áudio', 'Transcrição', 'State-of-the-art', 'PT-BR'],
  },
  {
    name: 'Rio 2.5 Transcrição',
    description:
      'State-of-the-art em transcrição de áudio para texto, com especialização em português do Brasil e inglês.',
    category: 'Áudio',
    Icon: AudioLines,
    tags: ['Áudio', 'Transcrição', 'State-of-the-art', 'PT-BR'],
  },
  {
    name: 'Rio 2.0 Voz',
    description:
      'Gera áudio natural e realista a partir de texto, considerado state-of-the-art para sotaques brasileiros.',
    category: 'Áudio',
    Icon: Volume2,
    tags: ['Áudio', 'Text-to-Speech', 'Sotaques Brasileiros'],
  },
  {
    name: 'Rio 2.5 Voz',
    description:
      'Gera áudio natural e realista a partir de texto, considerado state-of-the-art para sotaques brasileiros.',
    category: 'Áudio',
    Icon: Volume2,
    tags: ['Áudio', 'Text-to-Speech', 'Sotaques Brasileiros'],
  },
  {
    name: 'Rio 2.0 ML',
    description:
      'Especializado em programação, com foco em machine learning e desenvolvimento de kernels de alta performance.',
    category: 'Código',
    Icon: Binary,
    tags: ['Código', 'Machine Learning', 'Kaggle'],
  },
  {
    name: 'Rio 2.5 ML',
    description:
      'Especializado em programação, com foco em machine learning e desenvolvimento de kernels de alta performance.',
    category: 'Código',
    Icon: Binary,
    tags: ['Código', 'Machine Learning', 'Kaggle'],
  },
  {
    name: 'Rio 1',
    description: 'O modelo que iniciou tudo. Uma fundação sólida baseada no Qwen 2.5 32B.',
    category: 'Legado',
    Icon: Brain,
    tags: ['Legado', 'Fundação'],
  },
  // --- Generation 1.5 ---
  {
    name: 'Rio 1.5',
    description: 'Evolução direta do Rio 1, trazendo maior capacidade de raciocínio e contexto.',
    category: 'Legado',
    Icon: Brain,
    tags: ['Legado', 'Evolução'],
  },
  {
    name: 'Rio 1.6',
    description: 'Refinamento do Rio 1.5 com foco em instruções complexas e nuance cultural.',
    category: 'Legado',
    Icon: Brain,
    tags: ['Legado', 'Refinado'],
  },
  {
    name: 'Ipiranga',
    description: 'Modelo experimental multimodal focado em compreensão visual e histórica.',
    category: 'Experimental',
    Icon: Eye,
    tags: ['Multimodal', 'Experimental'],
  },
  {
    name: 'Niemeyer',
    description: 'Modelo focado em design e estruturação de respostas visuais e arquiteturais.',
    category: 'Experimental',
    Icon: Palette,
    tags: ['Design', 'Experimental'],
  },
  // --- Generation 2.0 Components ---
  {
    name: 'Rio Fala',
    description: 'Componente de entendimento de fala.',
    category: 'Experimental',
    Icon: Mic,
    tags: ['Áudio', 'Experimental'],
  },
  {
    name: 'Rio Thinking',
    description: 'Componente de raciocínio profundo.',
    category: 'Experimental',
    Icon: Brain,
    tags: ['Raciocínio', 'Experimental'],
  },
  {
    name: 'Rio Tool Use',
    description: 'Componente especializado em uso de ferramentas.',
    category: 'Experimental',
    Icon: Hammer,
    tags: ['Tools', 'Experimental'],
  },
  {
    name: 'Rio Tool Thinking',
    description: 'Híbrido de raciocínio e uso de ferramentas.',
    category: 'Experimental',
    Icon: Brain,
    tags: ['Raciocínio', 'Tools'],
  },
  {
    name: 'Rio Vídeo',
    description: 'Análise e compreensão de vídeo.',
    category: 'Visão',
    Icon: Film,
    tags: ['Vídeo', 'Experimental'],
  },
  {
    name: 'Rio Detetive',
    description: 'Agente investigativo multimodal.',
    category: 'Agente',
    Icon: Search,
    tags: ['Agente', 'Multimodal'],
  },
  {
    name: 'Rio Explorer',
    description: 'Agente de exploração visual.',
    category: 'Agente',
    Icon: Map,
    tags: ['Agente', 'Visão'],
  },
  {
    name: 'Rio OCR',
    description: 'Extração de texto de alta precisão.',
    category: 'Visão',
    Icon: FileText,
    tags: ['Visão', 'OCR'],
  },
  {
    name: 'Rio Segmentação',
    description: 'Segmentação semântica de imagens.',
    category: 'Visão',
    Icon: BoxSelect,
    tags: ['Visão', 'Segmentação'],
  },
  {
    name: 'Rio Visão Dinâmica',
    description: 'Processamento visual em tempo real.',
    category: 'Visão',
    Icon: Aperture,
    tags: ['Visão', 'Real-time'],
  },
];
