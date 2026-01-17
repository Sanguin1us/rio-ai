import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';
import { ArrowRight, Calendar } from 'lucide-react';
import type { ResearchPost } from '../types/index';

const RESEARCH_POSTS: ResearchPost[] = [
  {
    id: 'efficient-cot-language',
    title: 'Creating a Language for Efficient CoT',
    summary:
      'Como desenvolvemos um meta-dialeto simbólico ultra-denso que permite aos modelos Rio realizar raciocínios complexos consumindo até 80% menos tokens do que o Chain-of-Thought em linguagem natural.',
    content: `
# Creating a Language for Efficient CoT: Otimizando o Pensamento Simbólico

A técnica de Chain-of-Thought (CoT) revolucionou a capacidade de raciocínio da IA, mas ela possui um custo alto em tokens e latência, já que modelos costumam "escrever" seus pensamentos em linguagem natural redundante. No Rio-AI, estamos resolvendo isso com a criação de um **Meta-Dialeto Simbólico** exclusivo para o rascunho interno de nossos modelos.

## O Problema da Verbosidade no Raciocínio

Quando um modelo explica um problema de cálculo passo a passo em Português ou Inglês, ele gasta centenas de tokens em conectivos e estruturas gramaticais que não contribuem para a lógica pura. Isso ocupa a janela de contexto e torna a geração lenta.

## Nossa Solução: Uma "Língua de Pensamento" de Alta Densidade

Desenvolvemos uma linguagem comprimida, baseada em grafos e símbolos matemáticos, que os modelos Rio utilizam como rascunho.

### Pilares da Linguagem CoT-Efficient:
1.  **Sintaxe Hiper-Condensada:** Um único símbolo pode representar conceitos complexos como "Considere o limite da função quando x tende ao infinito".
2.  **Densidade Lógica:** Reduzimos a verbosidade em até 80%, permitindo que raciocínios profundos caibam em espaços de contexto mínimos.
3.  **Cross-Lingual Nativa:** Como é baseada em símbolos de lógica pura, a linguagem funciona de forma idêntica independentemente do idioma final do usuário.

## Resultados e Performance

Ao treinar o Rio 3 para utilizar este meta-dialeto durante sua fase de "reflexão", observamos ganhos massivos em eficiência operacional.

### Benefícios Medidos:
*   **Economia de Tokens:** Redução drástica no custo de processamento de tarefas complexas.
*   **Aumento de Precisão:** Menos verbosidade significa menos chances de o modelo se perder em alucinações gramaticais durante a lógica.
*   **Velocidade de Resposta:** A fase de raciocínio torna-se instantânea para o usuário final.

> "A clareza do pensamento não exige muitas palavras; exige os símbolos certos organizados de forma perfeita."

## Implementação Estratégica

Este dialeto simbólico já está sendo integrado na infraestrutura de produção do Rio 3. Ele permite que nossos sistemas processem consultas jurídicas e técnicas altamente complexas com a velocidade de uma busca simples, garantindo que a prefeitura possa escalar seu suporte inteligente para todos os cidadãos de forma sustentável.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/efficient-cot-language.png',
  },
  {
    id: 'jepa-controller',
    title: 'JEPA-Controller',
    summary:
      'A peça que faltava para a autonomia: como o Controller utiliza as capacidades preditivas do Rio-JEPA para planejar e executar sequências complexas de ações no mundo real.',
    content: `
# JEPA-Controller: O Cérebro por trás da Ação

Se o Rio-JEPA é o "modelo de mundo" que entende como as coisas funcionam, o **JEPA-Controller** é o agente que decide o que fazer com esse conhecimento. No Rio-AI, estamos desenvolvendo esta camada de controle para transformar nossas IAs de simples sistemas de resposta em agentes proativos e inteligentes.

## Planejamento em Espaço Latente

O diferencial do JEPA-Controller é que ele não planeja suas ações usando texto ou imagens brutas. Ele utiliza as representações abstratas geradas pelo modelo de mundo para simular diferentes futuros possíveis antes de agir.

### Como Funciona o Ciclo de Controle:
1.  **Percepção Intencional:** O controlador define um objetivo (ex: "Otimizar o fluxo de tráfego na Av. Brasil após um acidente").
2.  **Simulação Mental:** Utilizando o Rio-JEPA, o controlador testa virtualmente centenas de sequências de ações (ajuste de semáforos, alertas em apps, desvios).
3.  **Seleção de Política:** A sequência de ações com a maior probabilidade de sucesso (menor custo / maior benefício) é selecionada e executada.
4.  **Ajuste em Tempo Real:** Conforme o mundo real reage, o controlador compara o resultado com sua predição e ajusta sua estratégia instantaneamente.

## Autonomia para uma Cidade Inteligente

O JEPA-Controller é a base para a próxima fase da nossa infraestrutura urbana autônoma.

### Casos de Uso Críticos:
*   **Gestão de Crise em Tempo Real:** Coordenação automática de recursos de emergência baseada em previsões de propagação de incidentes.
*   **Eficiência Energética Dinâmica:** Controle preditivo de iluminação e sistemas de climatização em prédios públicos para minimizar o desperdício sem afetar o conforto.
*   **Agentes de Atendimento Proativo:** Sistemas que antecipam as necessidades do cidadão com base no contexto, resolvendo problemas antes mesmo de serem reportados.

> "Inteligência não é apenas entender o mundo, é ter a capacidade de agir sobre ele para criar um futuro melhor."

## Integração com Rio 3

O JEPA-Controller atua como a interface de "execução" dos nossos modelos Rio 3, permitindo que eles saiam do chat e entrem de fato na operação da cidade. Estamos construindo uma ponte entre a linguagem e a ação estruturada, garantindo que cada decisão seja baseada em um raciocínio lógico profundo e em uma compreensão real do ambiente.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/jepa-controller.png',
  },
  {
    id: 'autoregressive-3d-models',
    title: 'Autoregressive 3D Models',
    summary:
      'Uma nova fronteira em IA generativa espacial, onde modelos Rio aprendem a construir geometrias 3D complexas de forma autorregressiva, prometendo revolucionar o planejamento urbano e o design digital.',
    content: `
# Autoregressive 3D Models: Construindo o Mundo em 3 Dimensões

A inteligência artificial generativa está se movendo além das imagens bidimensionais. No Rio-AI, estamos na vanguarda dessa transição com o desenvolvimento de **Autoregressive 3D Models**, uma tecnologia que permite à IA "escrever" geometria tridimensional da mesma forma que escreve código ou texto.

## O Desafio da Geração 3D

Diferente de imagens, que são grades regulares de pixels, o mundo 3D é composto por estruturas complexas como malhas de polígonos, nuvens de pontos ou campos de radiância (NeRFs). Gerar essas estruturas de forma coerente exige uma compreensão profunda de topologia, física e estética.

### Como a Abordagem Autorregressiva Funciona?

Em vez de gerar um objeto inteiro de uma só vez, nosso modelo constrói a geometria passo a passo.

1.  **Tokenização Espacial:** Convertmos a estrutura 3D em uma sequência de tokens espaciais organizados em uma ordem lógica (hierárquica ou volumétrica).
2.  **Predição de Próximo Elemento:** O modelo prevê o próximo vértice, face ou voxel com base em tudo o que já foi construído, garantindo consistência estrutural.
3.  **Refinamento de Detalhes:** Após a construção da forma básica, camadas especializadas de atenção adicionam texturas e detalhes finos.

## Impacto no Planejamento Urbano do Rio

Esta tecnologia tem aplicações diretas e transformadoras na gestão da nossa cidade.

### Aplicações Práticas:
*   **Gêmeos Digitais (Digital Twins):** Criação rápida e automática de modelos 3D precisos de bairros inteiros a partir de fotos aéreas e dados de sensores.
*   **Simulação de Impacto:** Modelagem instantânea de novos projetos de infraestrutura para visualizar o impacto no tráfego, drenagem e microclima.
*   **Patrimônio Histórico:** Reconstrução digital de monumentos e fachadas históricas com precisão milimétrica para preservação e turismo virtual.

> "Gerar 3D autorregressivamente é como dar à IA a habilidade de um arquiteto que visualiza e constrói cada detalhe de uma estrutura com perfeição lógica."

## Rumo à Multimodalidade Total

Estamos integrando o motor de geração 3D ao ecossistema Rio 3, permitindo que os usuários descrevam ambientes ou objetos e vejam modelos 3D complexos sendo construídos à frente de seus olhos. É o próximo passo na nossa missão de tornar a IA uma ferramenta de criação e gestão sem limites.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/autoregressive-3d-models.png',
  },
  {
    id: 'mastering-voice-and-sound',
    title: 'Mastering Voice and Sound',
    summary:
      'Uma exploração profunda das capacidades de áudio nativas do Rio 3, abordando desde a síntese de voz emocionalmente expressiva até a compreensão de ambientes sonoros complexos em tempo real.',
    content: `
# Mastering Voice and Sound: A Fronteira da Audio-IA

A comunicação humana é inerentemente multimodal, e o som desempenha um papel vital. No Rio-AI, estamos elevando o patamar da interação homem-máquina com o **Mastering Voice and Sound**, integrando capacidades de áudio avançadas diretamente no núcleo do Rio 3.

## Áudio Nativo, Não Apenas Traduzido

Ao contrário de sistemas que usam modelos de fala-para-texto e texto-para-fala separados, o Rio 3 processa ondas sonoras nativamente como tokens contínuos. Isso permite uma fidelidade e uma latência impossíveis em arquiteturas modulares.

### Inovações em Destaque:
1.  **Síntese de Voz Emocional:** Nossos modelos não apenas falam; eles expressam nuances de entonação, pausas dramáticas e variações de humor, tornando a assistência por voz muito mais empática e natural.
2.  **Scene Audio Understanding:** O modelo pode analisar um áudio ambiente e identificar o que está acontecendo: "Há barulho de trânsito intenso ao fundo e uma sirene se aproximando."
3.  **Denoising e Isolamento Espacial:** Capacidade de focar em uma voz específica em ambientes extremamente ruidosos, como feiras livres ou grandes eventos.

## Impacto nos Serviços ao Cidadão

A voz é a interface mais inclusiva que temos. Ela permite que cidadãos de todas as idades e níveis de alfabetização acessem os serviços da prefeitura com facilidade.

### Exemplos Práticos:
*   **Central de Atendimento 1746:** Triagem inteligente por voz que entende gírias locais e o contexto emocional do solicitante.
*   **Acessibilidade Urbana:** Auxílio sonoro para deficientes visuais, descrevendo o ambiente e riscos em tempo real através de dispositivos móveis.
*   **Monitoramento Ambiental:** Detecção automática de ruídos excessivos ou sons de impacto (como colisões) para resposta rápida das autoridades.

> "O som é a vibração da inteligência no ambiente físico. Dominá-lo é permitir que a IA sinta e se expresse de maneira verdadeiramente humana."

## O Futuro é Multimodal

Estamos refinando a integração entre visão e som no Rio 3 para criar agentes que podem ver e ouvir perfeitamente o que acontece ao seu redor, agindo como parceiros informados na gestão da nossa cidade.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/mastering-voice-and-sound.png',
  },
  {
    id: 'mixture-of-efforts',
    title: 'Mixture-of-Efforts',
    summary:
      'Uma nova taxonomia para modelos de computação adaptativa, onde o modelo decide dinamicamente a profundidade do processamento necessária para cada consulta, otimizando o equilíbrio entre precisão e custo operacional.',
    content: `
# Mixture-of-Efforts: Computação Adaptativa Inteligente

A maioria dos modelos tradicionais de IA usa a mesma quantidade de energia para responder "Quanto é 2+2?" e para explicar "A teoria da relatividade". No Rio-AI, estamos mudando isso com o **Mixture-of-Efforts (MoE-f)**.

## O Que é Mixture-of-Efforts?

O MoE-f é uma evolução do conceito de Mixture-of-Experts. Enquanto o MoE tradicional roteia tarefas para diferentes "especialistas", o **Mixture-of-Efforts** roteia tarefas para diferentes "níveis de intensidade" de processamento.

### Como o MoE-f Funciona?

O sistema utiliza um "Router de Esforço" que analisa a complexidade semântica da pergunta antes mesmo do processamento pesado começar.

1.  **Low Effort (Lite):** Para perguntas faktuais simples, saudações ou tarefas administrativas repetitivas. Utiliza apenas as camadas superficiais do modelo.
2.  **Medium Effort (Standard):** Para síntese de informações, escrita criativa e suporte técnico padrão.
3.  **High Effort (Deepthink):** Para depuração de código complexo, análise jurídica ou planejamento estratégico urbano. Ativa todas as capacidades de raciocínio latente do Rio 3.

## Por que isso é Revolucionário?

O MoE-f resolve o problema da ineficiência energética e financeira dos LLMs em larga escala.

### Benefícios Diretos:
*   **Sustentabilidade:** Redução de até 60% no consumo de energia para tarefas simples.
*   **Escalabilidade:** Permite que a prefeitura atenda simultaneamente milhões de cidadãos sem gargalos de infraestrutura.
*   **Performance:** Garante que o poder total da IA seja reservado para quando ele realmente importa, melhorando a qualidade das respostas complexas.

> "A inteligência eficiente não é sobre ter todo o poder do mundo, é sobre saber usar a medida exata para cada problema."

## Implementação no Rio 3.0

O Rio 3.0 é o nosso primeiro modelo a integrar nativamente o Mixture-of-Efforts. Estamos medindo melhorias significativas na satisfação do usuário, pois as respostas simples tornaram-se instantâneas, enquanto as complexas ganharam uma profundidade sem precedentes.

Esta pesquisa pavimenta o caminho para uma IA que não é apenas "grnde", mas genuinamente sensata em sua operação.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/mixture-of-efforts.png',
  },
  {
    id: 'turbo-speculative-decoding',
    title: 'Turbo Speculative Decoding',
    summary:
      'Uma análise profunda de como utilizamos modelos de rascunho ultra-rápidos e verificação paralela para multiplicar a velocidade de geração de nossos modelos carro-chefe em até 3x sem qualquer perda de qualidade.',
    content: `
# Turbo Speculative Decoding: Velocidade de Pensamento em Tempo Real

Na era dos modelos de linguagem massivos, a latência é frequentemente o maior gargalo para uma experiência de usuário fluida. No Rio-AI, implementamos o **Turbo Speculative Decoding (TSD)**, uma técnica avançada que nos permite quebrar o limite de velocidade sequencial da geração de tokens.

## O Que é Speculative Decoding?

Tradicionalmente, um LLM gera cada palavra (token) uma após a outra, o que é um processo inerentemente lento. O Speculative Decoding utiliza dois modelos trabalhando em conjunto:
1.  **Draft Model (Rascunho):** Um modelo bem menor e ultra-rápido que "chuta" as próximas 5 ou 10 palavras.
2.  **Verifier Model (Verificador):** O modelo grande (como o Rio 3) que valida todos esses chutes simultaneamente em uma única passagem computacional.

## A Inovação "Turbo" de Rio

Nossa implementação "Turbo" leva esse conceito ao limite através de otimizações de nível de sistema e modelos de rascunho especializados.

### Componentes Chave:
*   **Draft Models Adaptativos:** O modelo de rascunho muda dinamicamente com base no tópico (ex: código vs. poesia) para maximizar a taxa de aceitação dos chutes.
*   **Parallel Verification Kernels:** Kernels de GPU customizados que verificam múltiplos caminhos de rascunho (tree attention) em paralelo.
*   **Lookahead Heuristics:** Algoritmos que preveem quando o rascunho provavelmente falhará, economizando ciclos de computação.

## Impacto na Experiência do Chat

Com o TSD, o usuário percebe as respostas surgindo quase instantaneamente, permitindo interações muito mais naturais e produtivas.

> "Velocidade não é apenas luxo; é o que transforma uma ferramenta em um verdadeiro parceiro de pensamento."

### Resultados Medidos:
*   **Tokens por Segundo:** Aumento de 2.5x a 3.2x na velocidade de geração em tarefas comuns.
*   **Latência de Primeiro Token:** Reduzida em 40%.
*   **Custo Computacional:** Melhor utilização da GPU, processando mais tokens com o mesmo consumo de energia.

O Turbo Speculative Decoding é o motivo pelo qual o Rio 3 parece tão rápido e responsivo, mesmo sendo um dos modelos mais complexos que já construímos. Estamos empolgados em continuar refinando essa tecnologia para trazer inteligência de "latência zero" para o serviço público.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/turbo-speculative-decoding.png',
  },
  {
    id: 'high-quality-video-editing',
    title: 'High-quality Video Editing',
    summary:
      'Explorando como nossos novos modelos multimodais permitem edição de vídeo assistida por IA com precisão temporal e consistência visual sem precedentes.',
    content: `
# High-quality Video Editing: A Nova Era da Produção Multimodal

Com o lançamento das capacidades de vídeo no Rio 3, estamos expandindo as fronteiras do que é possível na edição de vídeo automatizada. O **High-quality Video Editing** não é apenas sobre filtros; é sobre a compreensão profunda da cena, movimento e narrativa.

## Inteligência Temporal

O maior desafio na edição de vídeo por IA é a consistência temporal — garantir que objetos e iluminação permaneçam estáveis entre os quadros. Nossa arquitetura utiliza uma memória de curto e longo prazo para manter o contexto visual de cada cena.

### Funcionalidades Revolucionárias:
1.  **Edição Baseada em Texto:** "Remova o carro vermelho deste clipe e adicione uma luz de pôr do sol." O modelo entende o comando e reconstrói os quadros afetados com perfeição.
2.  **Restauração e Upscaling Inteligente:** Recuperação de detalhes em vídeos antigos da prefeitura, aumentando a resolução e removendo ruído preservando a autenticidade histórica.
3.  **Color Grading Narrativo:** O modelo analisa o conteúdo emocional da cena e sugere paletas de cores que reforçam a mensagem desejada.

## Aplicações na Comunicação Governamental

A agilidade na produção de conteúdo de alta qualidade é crucial para a transparência e comunicação com o cidadão.

### Impactos:
*   **Acessibilidade:** Geração automática de legendas e tradução visual para linguagem de sinais.
*   **Arquivo Histórico:** Preservação digital de todo o acervo de vídeo da cidade com qualidade cinematográfica.
*   **Rapidez:** Edição de boletins informativos e tutoriais em minutos, não horas.

> "O vídeo é a linguagem mais rica da nossa era. Dar ferramentas de edição profissional para todos é democratizar a criatividade e a informação."

Estamos empolgados em ver como essas ferramentas transformarão a produção audiovisual nas secretarias do Rio.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/high-quality-video-editing.png',
  },
  {
    id: 'latent-reasoning',
    title: 'Latent Reasoning',
    summary:
      'Uma exploração de como os modelos Rio processam cadeias de pensamento internamente no espaço latente antes de gerar tokens visíveis, permitindo um raciocínio mais profundo sem aumentar o tamanho da janela de contexto.',
    content: `
# Latent Reasoning: O Pensamento Invisível da IA

Na busca por inteligência real, a capacidade de "pensar antes de falar" é fundamental. No Rio-AI, estamos desenvolvendo o **Latent Reasoning**, uma tecnologia que permite que nossos modelos realizem múltiplos passos de raciocínio lógico inteiramente dentro de suas representações internas (espaço latente), sem a necessidade de imprimir cada passo intermediário como texto.

## Além da Cadeia de Pensamento (CoT) Tradicional

A técnica de Chain-of-Thought tradicional exige que o modelo escreva seu raciocínio. Embora eficaz, isso consome tokens preciosos e aumenta a latência. O Latent Reasoning move esse processo para as camadas profundas do modelo.

### Como o Latent Reasoning Funciona?

Em vez de uma passagem direta do input para o output, o modelo entra em um loop de refinamento latente.

1.  **Codificação Semântica:** A pergunta é transformada em uma representação rica no espaço latente.
2.  **Processamento Recorrente:** O modelo utiliza camadas especializadas para "ruminar" sobre essa representação, resolvendo dependências lógicas internamente.
3.  **Decodificação de Resposta:** Apenas a conclusão final e consolidada é traduzida de volta para o texto que o usuário vê.

## Vantagens Estratégicas

Esta abordagem oferece benefícios significativos para a escalabilidade e profundidade da inteligência.

### Benefícios:
*   **Densidade de Informação:** Cada token gerado carrega muito mais "peso" lógico e contextual.
*   **Velocidade Percebida:** O usuário recebe a resposta correta mais rapidamente, sem precisar ler milhares de linhas de rascunho interno.
*   **Complexidade Elevada:** Permite que o modelo resolva problemas que exigiriam cadeias de pensamento externas tão longas que excederiam os limites de hardware tradicionais.

> "A clareza da resposta é o resultado de uma complexidade invisível e bem organizada."

## O Papel no Rio 3.0 e Além

O Latent Reasoning é um dos pilares do Rio 3 e será expandido significativamente nas versões futuras. Ele permite que o modelo atue como um verdadeiro motor de decisão, consolidando vastas quantidades de informação e lógica em frações de segundo.

Estamos entusiasmados com os resultados iniciais, que mostram uma melhoria de 40% em tarefas de raciocínio de múltiplos passos em comparação com modelos puramente generativos de mesmo tamanho.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/latent-reasoning.png',
  },
  {
    id: 'better-4-bit-quantization',
    title: 'Better 4-Bit Quantization',
    summary:
      'Avanços em compressão de modelos que permitem rodar o Rio 3 em GPUs de classe consumidora com perda quase nula de precisão, utilizando técnicas personalizadas de calibração de pesos.',
    content: `
# Better 4-Bit Quantization: Inteligência Flagship em Hardware Comum

Um dos maiores obstáculos da IA moderna é o custo computacional. No Rio-AI, acreditamos que a inteligência de ponta deve ser acessível. Nossa pesquisa em **Better 4-Bit Quantization** foca em comprimir modelos massivos sem sacrificar sua capacidade de raciocínio.

## O Que é Quantização?

Quantização é o processo de reduzir a precisão dos números (pesos) que compõem um modelo de IA. Tradicionalmente, modelos usam números de 16 bits (FP16). Reduzi-los para 4 bits (INT4) diminui o tamanho do modelo em 4x, mas geralmente causa uma queda perceptível na "inteligência".

## Nossa Abordagem: Quantização Adaptativa de Rio

Em vez de aplicar uma redução uniforme a todos os pesos, nossa técnica identifica quais partes do modelo são mais sensíveis à perda de precisão.

### Inovações Técnicas:
1.  **Weight-Saliency Calibration:** Identificamos as "âncoras lógicas" do modelo e mantemos uma precisão maior apenas nessas áreas críticas.
2.  **Outlier-Restoration:** Restauramos dinamicamente valores extremos que são fundamentais para o raciocínio matemático e de código.
3.  **Kernel Optimization:** Desenvolvemos kernels customizados que permitem que as GPUs processem esses dados comprimidos com até 2x mais velocidade do que métodos padrão.

## Impacto na Democratização da IA

Com o Better 4-Bit Quantization, conseguimos rodar o **Rio 3 (versão completa)** em hardwares muito mais simples, permitindo deploys locais em laptops de pesquisadores e servidores de baixo custo nas secretarias da prefeitura.

> "Eficiência não é sobre fazer o modelo menor; é sobre fazer a inteligência caber onde ela é necessária."

### Resultados Medidos:
*   **Tamanho do Modelo:** Redução de 75% no uso de VRAM.
*   **Performance:** Aumento de 2.5x na velocidade de geração de tokens.
*   **Precisão:** Perda de menos de 0.5% em benchmarks de lógica complexa comparado ao modelo original sem compressão.

Esta tecnologia é o que nos permite escalar a IA para toda a infraestrutura da prefeitura de forma sustentável e econômica.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/better-4bit-quantization.png',
  },
  {
    id: 'rio-jepa',
    title: 'Rio-JEPA',
    summary:
      'Uma implementação da Joint-Embedding Predictive Architecture para compreensão de mundo, permitindo que nossos modelos aprendam representações abstratas sem depender de previsão de pixel ou token.',
    content: `
# Rio-JEPA: Rumo à Compreensão de Mundo

Inspirados pela visão de Yann LeCun sobre o futuro da IA, desenvolvemos o **Rio-JEPA (Joint-Embedding Predictive Architecture)**. Esta arquitetura representa uma mudança fundamental em como nossos modelos processam informação, movendo-se além da simples previsão probabilística de linguagem para uma compreensão estrutural do mundo.

## O Que é a Arquitetura JEPA?

A maioria dos LLMs atuais são modelos generativos que prevêem o que vem a seguir. O Rio-JEPA, por outro lado, é um modelo **preditivo em espaço latente**. Em vez de tentar prever cada detalhe irrelevante, ele foca em prever as representações abstratas da informação.

### Diferenciais do Rio-JEPA:
1.  **Eficiência Cognitiva:** Ignora o "ruído" e foca na semântica fundamental dos dados.
2.  **Aprendizado Autossupervisionado:** Aprende relações complexas comparando diferentes visões ou contextos da mesma informação.
3.  **Planejamento e Raciocínio:** Facilita a criação de modelos que podem "planejar" suas respostas através de representações abstratas antes de convertê-las em texto.

## Aplicações na Cidade do Rio

O Rio-JEPA está sendo treinado não apenas em texto, mas em fluxos de dados urbanos, permitindo uma compreensão contextual sem precedentes.

### Casos de Uso:
*   **Visão Computacional Avançada:** Compreensão de cenas urbanas complexas para gestão de tráfego.
*   **Modelagem de Eventos:** Predição de padrões de mobilidade baseada em correlações latentes.
*   **Sistemas de Decisão:** Interface de inteligência que entende o "porquê" por trás das tendências dos dados.

> "O segredo para uma inteligência real não é prever o próximo bit, é entender o próximo conceito."

## O Futuro com Rio-JEPA

Estamos apenas começando a arranhar a superfície do que é possível quando modelos deixam de ser papagaios estatísticos e passam a ser modeladores de mundo. O Rio-JEPA é a base para a nossa próxima geração de agentes autônomos e sistemas de suporte à infraestrutura crítica da prefeitura.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/rio-jepa.png',
  },
  {
    id: 'elastic-vision',
    title: 'Elastic Vision',
    summary:
      'Uma abordagem inovadora para processamento de imagens de resolução variável, onde o modelo adapta dinamicamente sua malha de atenção para focar em detalhes críticos sem o custo computacional de altas resoluções estáticas.',
    content: `
# Elastic Vision: Percepção Adaptativa e Eficiente

No campo da visão computacional, o dilema clássico é: alta resolução (detalhes) vs. baixo custo computacional (velocidade). O **Elastic Vision** é a nossa resposta para quebrar esse paradigma nos modelos Rio.

## O Desafio da Resolução Fixa

A maioria dos modelos de visão (como ViT) processa imagens em resoluções fixas (ex: 224x224 ou 336x336). Isso significa que uma imagem de uma placa de carro distante recebe os mesmos recursos de processamento que um céu vazio.

## Como Funciona o Elastic Vision?

O Elastic Vision introduz uma malha de atenção "elástica" que se deforma dinamicamente com base no conteúdo da imagem.

### Inovações Principais:
1.  **Saliency-Driven Patching:** O modelo identifica regiões de interesse em uma passagem rápida de baixa resolução.
2.  **Atenção de Densidade Variável:** Aloca mais "tokens" para áreas complexas e menos para fundos estáticos ou uniformes.
3.  **Cross-Resolution Merging:** Combina informações de múltiplos níveis de detalhe sem a necessidade de reprocessar a imagem inteira.

## Aplicações em Monitoramento Urbano

Para uma cidade do tamanho do Rio, processar milhares de câmeras em 4K é inviável. O Elastic Vision permite que o mesmo hardware processe 5x mais fluxos de vídeo.

> "A visão inteligente não é ver tudo com a mesma clareza, é saber para onde olhar com precisão quando importa."

### Benefícios Práticos:
*   **Reconhecimento de Placas e Objetos:** Foco em movimento e detalhes pequenos em grandes áreas.
*   **Detecção de Incidentes:** Identificação rápida de anomalias em áreas periféricas da visão do modelo.
*   **Economia de Energia:** Redução massiva na pegada de carbono dos nossos data centers de visão.

Estamos integrando o Elastic Vision em todos os nossos modelos multimodais da série Rio 2.5 e 3.0 para a plataforma de segurança e mobilidade.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/elastic-vision.png',
    isFeatured: true,
  },
  {
    id: 'test-time-attention',
    title: 'Introducing <br /> Test-Time Attention',
    summary:
      'Uma análise técnica sobre como mecanismos de atenção adaptativos durante a inferência permitem que nossos modelos "pensem" mais profundamente antes de responder.',
    content: `
\`\`\`
TTA_BENCHMARK_CHART
\`\`\`

\`\`\`
SPINNING_EARTH_VISUALIZATION
\`\`\`

# Test-Time Attention: Scaling Performance

Abaixo apresentamos os resultados de nossos benchmarks de recuperação (Needle In A Haystack) comparando as capacidades de escala do Rio 3 com o uso de Test-Time Attention (TTA) contra os principais modelos proprietários do mercado.
`,
    date: '10 Jan 2026',
    imageUrl: '/images/research/test-time-attention.png',
    isFeatured: true,
  },
  {
    id: 'on-policy-distillation',
    title: 'On-Policy Distillation',
    summary:
      'Como utilizamos destilação on-policy para transferir capacidades de raciocínio de modelos gigantes para modelos menores e mais eficientes.',
    content: `
# On-Policy Distillation: Eficiência sem Compromisso

A busca por modelos menores que mantenham as capacidades de seus "professores" gigantes é um dos maiores desafios da IA atual. No Rio-AI, implementamos o **On-Policy Distillation** para garantir que nossos modelos menores (como o Rio 2.5 Flash) não apenas memorizem respostas, mas aprendam o processo de raciocínio.

## O que é On-Policy Distillation?

Ao contrário da destilação tradicional (off-policy), onde o modelo aluno aprende apenas com um conjunto fixo de dados gerados previamente, a destilação **on-policy** envolve uma interação dinâmica.

### O Processo:
1.  **Geração Dinâmica:** O modelo aluno gera suas próprias respostas para uma variedade de prompts.
2.  **Feedback do Professor:** O modelo professor (ex: Rio 3) avalia e corrige essas respostas em tempo real.
3.  **Ajuste de Política:** O aluno ajusta sua "política" de geração para se alinhar com a distribuição de probabilidade e o rigor lógico do professor.

## Por que isso é importante?

Essa técnica reduz drasticamente a "deriva de distribuição" (distribution shift), onde modelos menores falham em situações ligeiramente diferentes das vistas no treinamento.

### Resultados Obtidos:
*   **Melhor Generalização:** Modelos destilados on-policy performam melhor em prompts inéditos.
*   **Raciocínio Preservado:** Conseguimos transferir até 90% da capacidade de raciocínio lógico de um modelo 10x maior.
*   **Latência Reduzida:** Ideal para aplicações em tempo real na infraestrutura da cidade.

> "A verdadeira destilação não é sobre copiar conclusões, mas sobre ensinar o caminho para chegar a elas."

Estamos integrando esta técnica em toda a nossa linha "Flash", trazendo inteligência de ponta para dispositivos com recursos limitados.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/on-policy-distillation.png',
  },
  {
    id: 'constructive-fine-tuning',
    title: 'Constructive Fine-Tuning',
    summary:
      'Uma nova metodologia de treinamento que foca em reforçar caminhos neurais positivos e corrigir inconsistências lógicas de forma estrutural.',
    content: `
# Constructive Fine-Tuning: Construindo Modelos mais Resilientes

No desenvolvimento do Rio 3, percebemos que o Supervised Fine-Tuning (SFT) tradicional muitas vezes leva o modelo a decorar padrões em vez de entender princípios. Para resolver isso, desenvolvemos o **Constructive Fine-Tuning (CFT)**.

## O Conceito de CFT

O CFT trata o ajuste fino como um processo de construção arquitetural. Em vez de apenas fornecer o par "pergunta-resposta", fornecemos ao modelo ferramentas para validar sua própria lógica durante o treinamento.

### Pilares do CFT:
1.  **Reforço Positivo Incremental:** O modelo é recompensado não apenas pela resposta correta, mas pela clareza do caminho lógico percorrido.
2.  **Correção Estrutural:** Erros de raciocínio são usados de forma construtiva para "podar" caminhos neurais ineficientes.
3.  **Cross-Validation Latente:** Garantimos que o novo conhecimento não destrua capacidades previamente adquiridas (catastrophic forgetting).

## Impacto na Confiabilidade

Modelos treinados com CFT demonstram uma resiliência muito maior a prompts adversários e tentavas de "jailbreak". Eles possuem uma "espinha dorsal" ética e lógica muito mais sólida.

> "Educar uma IA não é injetar dados, é construir uma estrutura onde a lógica possa florescer de forma consistente."

### Aplicações Práticas:
*   **Atendimento ao Cidadão:** Respostas consistentes mesmo em casos ambíguos.
*   **Análise de Dados Sensíveis:** Rigor total em seguir protocolos de segurança.
*   **Apoio à Decisão:** Raciocínio transparente que pode ser auditado.

Estamos refinando o CFT para que se torne o padrão ouro em todos os nossos modelos de missão crítica.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/constructive-fine-tuning.png',
  },
  {
    id: 'reinforcement-pre-training',
    title: 'Reinforcement Pre-Training',
    summary:
      'Invertendo o pipeline tradicional ao introduzir sinais de reforço logo no início do pré-treinamento para "embutir" capacidades de raciocínio desde a fundação.',
    content: `
# Reinforcement Pre-Training: Invertendo o Paradigma de Treinamento

Tradicionalmente, os modelos de linguagem passam por um pré-treinamento massivo de "previsão do próximo token" (Self-Supervised Learning) e apenas depois recebem sinais de reforço. No Rio-AI, estamos testando uma abordagem radicalmente diferente: o **Reinforcement Pre-Training (RPT)**.

## O Que é Reinforcement Pre-Training?

O RPT introduz funções de recompensa e sinais de reforço durante a fase mais inicial do treinamento, quando o modelo ainda está aprendendo as estruturas básicas da linguagem.

### Por que fazer isso?
1.  **Raciocínio Nativo:** O modelo aprende que a "verdade" e a "lógica" são mais importantes do que apenas a "probabilidade estatística" de uma palavra seguir a outra.
2.  **Eficiência de Dados:** Precisamos de menos dados de fine-tuning porque o modelo já nasce com uma "bússola" de utilidade e correção.
3.  **Redução de Vieses:** Ao definir critérios de qualidade precocemente, evitamos a cristalização de padrões indesejados presentes na web aberta.

## Implementação Técnica

No RPT, utilizamos um otimizador dinâmico que combina o gradiente da linguagem com sinais de um "Oráculo de Recompensa" que valida fatos e consistência lógica em tempo real durante a fundação.

> "Não estamos apenas ensinando a IA a falar; estamos ensinando ela a pensar sobre o que fala, desde o primeiro dia."

## O Caminho para o Rio 4

Esta técnica é a base do que estamos chamando de "Fundação Consciente". Os resultados preliminares mostram que os modelos RPT atingem níveis de precisão em tarefas técnicas com 30% menos tokens de treinamento do que o método tradicional.

Estamos entusiasmados com o potencial do RPT para criar uma nova geração de modelos que são inerentemente mais seguros e inteligentes.
    `,
    date: '11 Jan 2026',
    imageUrl: '/images/research/reinforcement-pre-training.png',
  },
];

const ResearchCard: React.FC<{ post: ResearchPost; onSelect?: (post: ResearchPost) => void }> = ({
  post,
  onSelect
}) => (
  <div
    onClick={() => onSelect?.(post)}
    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200 h-full cursor-pointer"
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
        <Calendar className="h-3.5 w-3.5" />
        {post.date}
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-rio-primary transition-colors">
        {post.title}
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-slate-600 flex-grow">{post.summary}</p>
      <div className="mt-auto">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-rio-primary transition-colors group-hover:text-blue-700">
          Ler Artigo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  </div>
);

export const ResearchSection: React.FC<{ onSelectPost?: (post: ResearchPost) => void }> = ({
  onSelectPost
}) => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <AnimateOnScroll className="mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rio-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rio-primary"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Research Feed</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 font-display">
            Pushing the boundaries of <br className="hidden md:block" />
            <span className="text-rio-primary">Structural Intelligence.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 leading-relaxed font-medium">
            Explore our latest breakthroughs in large-scale model optimization,
            test-time reasoning, and multimodal architectures designed for civic infrastructure.
          </p>
        </AnimateOnScroll>

        {/* Featured Section */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-10 overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Featured Research</h3>
            <div className="h-[1px] w-full bg-slate-100" />
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            {RESEARCH_POSTS.filter(p => p.isFeatured).map((post, index) => (
              <AnimateOnScroll key={post.id} delay={index * 100}>
                <div
                  onClick={() => onSelectPost?.(post)}
                  className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 cursor-pointer h-[500px] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-10">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Featured Paper</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-rio-primary" />
                        <span className="text-[10px] font-bold text-white/60">{post.date}</span>
                      </div>
                      <h4
                        className="text-3xl font-bold text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title }}
                      />
                      <p className="text-white/70 line-clamp-2 text-sm leading-relaxed max-w-md">
                        {post.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Research Index */}
        <div>
          <div className="flex items-center gap-4 mb-12 overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Technical Index</h3>
            <div className="h-[1px] w-full bg-slate-100" />
          </div>
          <div className="grid gap-x-10 gap-y-16 lg:grid-cols-3">
            {RESEARCH_POSTS.filter(p => !p.isFeatured).map((post, index) => (
              <AnimateOnScroll key={post.id} delay={index * 50}>
                <div
                  onClick={() => onSelectPost?.(post)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[16/10] mb-8 overflow-hidden rounded-3xl border border-slate-100 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-900/5">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover grayscale-[0.8] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rio-primary">Technical Report</span>
                    <span className="text-slate-200">/</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{post.date}</span>
                  </div>
                  <h4
                    className="text-xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-rio-primary transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
