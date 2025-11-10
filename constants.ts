import type { Model } from './types';
import {
  Bot,
  Cpu,
  Code2,
  FileText,
  Mic,
  ScanSearch,
  GitBranch,
  Aperture,
  BoxSelect,
  Volume2,
  FlaskConical,
  GraduationCap,
  Hammer,
  Terminal,
} from 'lucide-react';

export const RIO_MODELS: Model[] = [
  {
    name: 'Rio 2.0 32B Omni',
    description:
      'Nosso modelo flagship multimodal, unindo as capacidades de Transcrição, ML, Search e Visão em uma única e poderosa IA.',
    category: 'Flagship',
    Icon: Bot,
    tags: ['Flagship', 'Multimodal', 'State-of-the-art'],
    supportsChat: true,
  },
  {
    name: 'Rio 2.0 32B',
    description:
      'Modelo de linguagem de grande escala pós-treinado a partir do Qwen 2.5 32B para alta performance em tarefas complexas.',
    category: 'Linguagem',
    Icon: Cpu,
    tags: ['Linguagem', '32B Parâmetros'],
  },
  {
    name: 'Rio 2.5 Preview',
    description:
      'Uma prévia do futuro. Este modelo open source, baseado no Qwen 3, oferece um equilíbrio excepcional entre performance e eficiência.',
    category: 'Open Source',
    Icon: Cpu,
    tags: ['Open Source', 'CC BY 4.0', '30B Parâmetros', 'Research Preview'],
    isOpenSource: true,
    baseModel: 'Qwen 3 30B-A3B 2507 Thinking',
    parameters: '30 Bilhões (3B ativados)',
    license: 'Creative Commons Attribution 4.0',
    datasets: ['nvidia/OpenScienceReasoning-2', 'nvidia/Nemotron-Post-Training-Dataset-v1'],
    huggingFaceUrl: 'https://huggingface.co/IPLANRIO/rio-2.5-preview',
    useCases: [
      {
        title: 'Experimentação de Novas Arquiteturas',
        description:
          'Ideal para a comunidade acadêmica e de pesquisa explorar as capacidades da nossa mais nova arquitetura de modelo.',
        Icon: FlaskConical,
      },
      {
        title: 'Aplicações Eficientes',
        description:
          'Seu tamanho otimizado o torna perfeito para implantação em ambientes com restrições de recursos, sem sacrificar a qualidade.',
        Icon: Hammer,
      },
      {
        title: 'Feedback da Comunidade',
        description:
          'Use o modelo, explore seus limites e nos ajude a moldar a versão final com seu feedback e contribuições.',
        Icon: GraduationCap,
      },
    ],
    codeSnippets: [
      {
        lang: 'Python',
        Icon: Code2,
        code: `from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("IPLANRIO/rio-2.5-preview")
model = AutoModelForCausalLM.from_pretrained("IPLANRIO/rio-2.5-preview")

# Experimente a nova geração de modelos Rio!`,
      },
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.5-preview",
  "messages": [{"role": "user", "content": "Quais as novidades do Rio 2.5?"}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.0 14B',
    description:
      'Versão open source de alta performance, pós-treinada a partir do Qwen 2.5 14B, ideal para pesquisa e desenvolvimento.',
    category: 'Open Source',
    Icon: GitBranch,
    tags: ['Open Source', 'CC BY 4.0', '14B Parâmetros'],
    isOpenSource: true,
    baseModel: 'Qwen 2.5 14B',
    parameters: '14 Bilhões',
    license: 'Creative Commons Attribution 4.0 (CC BY 4.0)',
    datasets: ['nvidia/OpenScienceReasoning-2', 'nvidia/Nemotron-Post-Training-Dataset-v1'],
    huggingFaceUrl: 'https://huggingface.co/IPLANRIO/rio-2.0-14b',
    useCases: [
      {
        title: 'Pesquisa Acadêmica',
        description:
          'Ideal para pesquisadores que precisam de um modelo poderoso e acessível para experimentação em português.',
        Icon: GraduationCap,
      },
      {
        title: 'Prototipagem Rápida',
        description:
          'Permite que startups e desenvolvedores criem e testem novas aplicações de IA com baixo custo de entrada.',
        Icon: Hammer,
      },
      {
        title: 'Ferramentas Internas',
        description:
          'Pode ser ajustado e implantado para criar assistentes de código, chatbots de suporte e outras ferramentas customizadas.',
        Icon: FlaskConical,
      },
    ],
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
      'Variante do Rio 2.0 32B otimizada para pesquisas na web, oferecendo respostas rápidas e custo-eficientes.',
    category: 'Busca',
    Icon: ScanSearch,
    tags: ['Busca na Web', 'Rápido', 'Custo-eficiente'],
  },
  {
    name: 'Rio 2.0 Nano Visão',
    description:
      'Especializado em visão computacional, com foco em OCR e VQA para documentos em português do Brasil.',
    category: 'Visão',
    Icon: Aperture,
    tags: ['Visão', 'OCR', 'VQA', 'PT-BR'],
  },
  {
    name: 'Rio 2.0 Nano Grounding',
    description:
      'Treinado para detectar e localizar objetos em imagens com precisão, utilizando bounding boxes e pontos.',
    category: 'Visão',
    Icon: BoxSelect,
    tags: ['Visão', 'Detecção de Objetos', 'Grounding'],
  },
  {
    name: 'Rio 2.0 Transcrição',
    description:
      'State-of-the-art em transcrição de áudio para texto, com especialização em português do Brasil e inglês.',
    category: 'Áudio',
    Icon: Mic,
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
    name: 'Rio 2.0 ML',
    description:
      'Especializado em programação, com foco em machine learning e desenvolvimento de kernels de alta performance.',
    category: 'Código',
    Icon: Code2,
    tags: ['Código', 'Machine Learning', 'Kaggle'],
  },
];
