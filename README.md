# Rio-AI – Portal da Família de Modelos de IA

Portal institucional da Prefeitura do Rio de Janeiro, desenvolvido pela **IPLANRIO**, para apresentar a evolução e as capacidades da família completa de modelos **Rio** (gerações 1.0 a 3.0). O projeto destaca o compromisso da cidade com a transparência tecnológica, o fomento ao ecossistema Open Source e a aplicação prática de IA no setor público.

---

## 🌟 Visão Geral

- **Stack Moderna**: Baseado em **React 19** e **TypeScript**, orquestrado pelo **Vite 6** para uma experiência de desenvolvimento e performance de ponta.
- **Navegação Fluida**: SPA (Single Page Application) com controle de estado nativo, garantindo transições instantâneas entre o playground de chat, catálogo e áreas de pesquisa.
- **Ecossistema de Modelos**: Portfólio de mais de 35 modelos especializados, variando de modelos de linguagem puras (LLMs) a modelos multimodais de visão, voz e áudio.
- **Inovação Técnica**: Implementação de técnicas de vanguarda como *SwiReasoning* (raciocínio latente), *Deepthink Internalization Merging* e algoritmos genéticos para evolução autônoma de modelos.

---

## 🧬 Família de Modelos

A evolução dos modelos Rio é dividida em quatro gerações principais, cada uma representando um salto qualitativo em parâmetros e capacidades:

| Geração | Foco Principal | Base Tecnológica | Modelos de Destaque |
| :--- | :--- | :--- | :--- |
| **1.0** | Fundação | Qwen 2.5 32B | Rio 1 |
| **1.5** | Especialização | Qwen 2.5 Instruct / VL | Rio 1.5, Ipiranga (Visão), Niemeyer (Design) |
| **2.0** | Multimodalidade | Qwen 2.5 14B/32B | Rio 2.0 Omni (Flagship), Rio 2.0 Open |
| **2.5** | Raciocínio (SOTA) | Qwen 3 / Qwen 3 Thinking | Rio 2.5 Omni, Rio 2.5 Open (30B), Rio 2.5 Evolve |
| **3.0** | Convergência | Deepthink Internalization | Rio 3 Preview (Merging de 10x Rio 2.5 Omni) |

### 🔓 Iniciativa Open Source

O Rio-AI é um dos maiores contribuidores públicos para a comunidade de IA no Brasil. Modelos como o **Rio 2.5 Open** são disponibilizados sob a licença **CC BY 4.0**, permitindo uso comercial e acadêmico.

- **Diferencial Técnico**: O Rio 2.5 Open utiliza a arquitetura **SwiReasoning**, permitindo alternar entre o modo de resposta rápida e o modo de raciocínio profundo (pensamento latente), alcançando scores de até **95.0 no AIME 2025**.
- **Datasets**: Treinado com curadoria de dados institucionais e datasets globais como `nvidia/OpenScienceReasoning-2` e `nvidia/Nemotron-Post-Training-Dataset-v1`.

---

## 🚀 Principais Experiências

### 📊 Árvore de Linhagem Interativa
Visualize a árvore genealógica dos modelos através de um componente SVG reativo (`LineageTree.tsx`).
- **Conexões Bézier**: Linhas dinâmicas que recalculam caminhos em tempo real.
- **Focus Mode**: Destaque visual ao passar o mouse, facilitando a compreensão de dependências entre modelos base e derivados.

### 💬 Chat Rio (Advanced Branching)
Um playground de chat que vai além do básico, oferecendo ferramentas para desenvolvedores e pesquisadores:
- **Árvore de Mensagens**: Suporte total a *branching*. Edite qualquer mensagem passada para criar um novo ramo na conversa sem perder o histórico original.
- **Renderização Rica**: Suporte nativo a Markdown GFM, tabelas complexas e expressões matemáticas via **KaTeX**.
- **Controle de Fluxo**: Botão de interrupção (*Stop*) e regeneração de respostas com animação de "pensamento" integrada.

### 🧬 Rio 2.5 Evolve (Scientific Platform)
Uma vitrine da nossa plataforma de pesquisa algorítmica autônoma.
- **Algoritmos Genéticos**: O sistema busca soluções para problemas complexos através de herança, mutação e seleção.
- **Terminal de Logs**: Acompanhe em tempo real a simulação do processo evolutivo de otimização matemática.

---

## 🛠️ Arquitetura Técnica

### Estrutura de Diretórios

```
.
├── App.tsx                    # Orquestrador de views e roteamento de estado
├── constants.ts               # Definição central do catálogo de modelos
├── components/
│   ├── lineage-data.ts        # Coordenadas e conexões da árvore de linhagem
│   ├── detail/                # Views específicas para cada tipo de modelo
│   ├── ui/                    # Design System (Button, Badge, Card, etc.)
│   └── ...                    # Componentes modulares (Hero, Chat, Research)
├── hooks/
│   ├── useRioChat.ts          # Lógica de chat baseada em árvore de mensagens
│   └── useScrollAnimation.ts  # Trigger de animações baseadas em scroll
├── utils/
│   ├── messageTree.ts         # Estrutura de dados para branching de conversa
│   └── chart.ts               # Helpers para gráficos de dispersão (Scatter Plots)
├── server/
│   └── proxy.mjs              # Proxy Express para injeção segura de API Keys
└── docs/                      # Technical briefs e documentação complementar
```

### Segurança e Performance
Para proteger as credenciais institucionais, o frontend nunca se comunica diretamente com a API externa. Um **Proxy Express** injeta as chaves de API necessárias e gerencia políticas de CORS, garantindo que o portal seja seguro e escalável.

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
- **Node.js**: 18.x ou superior (Recomendado: 20 LTS)
- **npm**: 9.x ou superior

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

| Variável | Descrição | Valor Padrão |
| :--- | :--- | :--- |
| `RIO_API_KEY` | Chave de acesso à API Rio (Necessária para o Chat) | — |
| `RIO_API_URL` | Endpoint da API de inferência | `https://rio-api-test.onrender.com/v1/...` |
| `RIO_PROXY_PORT` | Porta onde o servidor proxy será executado | `3001` |
| `VITE_RIO_CHAT_PROXY_URL` | URL do proxy (usado pelo Vite) | `http://localhost:3001/api/chat` |

### Início Rápido
1. **Instalar dependências**:
   ```bash
   npm install
   ```
2. **Iniciar o Proxy** (em um terminal separado):
   ```bash
   npm run proxy
   ```
3. **Iniciar o Ambiente de Desenvolvimento**:
   ```bash
   npm run dev
   ```
4. **Build de Produção**:
   ```bash
   npm run build
   ```

---

## 📈 Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Lucide React (Ícones)
- **Estilização**: Tailwind CSS (UI Utility-first)
- **Processamento de Texto**: React Markdown, Remark GFM, KaTeX
- **Gráficos**: CSS customizado para scatter plots de performance/custo
- **Backend (Proxy)**: Express 5, Node.js Fetch API

---

## 📄 Licença e Contato

© 2025 **Prefeitura do Rio de Janeiro / IPLANRIO**.
Todos os direitos reservados sobre o conteúdo visual e experimental. Modelos open source seguem suas respectivas licenças (CC BY 4.0 onde indicado).

**Escritório de Dados – IPLANRIO**
Email: [dados@iplan.rio](mailto:dados@iplan.rio)
