# Rio 2.0 – Portal da Família de Modelos de IA

Portal institucional da Prefeitura do Rio/Escritório de Dados para apresentar a família de modelos Rio 2.0, destacar iniciativas open source e oferecer um playground de chat com o modelo flagship.

## Visão Geral
- SPA em React 19 + TypeScript com Vite 6; estilos com Tailwind via CDN e ícones Lucide.
- Navegação controlada por estado (`home`, `chat`, `opensource`) em `App.tsx`, sem react-router.
- Catálogo tipado em `constants.ts` e `types.ts`, incluindo metadados, tags, códigos e links Hugging Face.
- Hook `useRioChat` centraliza mensagens, histórico e integração com o proxy `/api/chat`.
- `AnimateOnScroll` e `TerminalAnimation` trazem microinterações sem dependências externas pesadas.

## Principais Experiências
- **Home / Catálogo** — hero com CTA, filtro por categoria e cartões clicáveis que descrevem cada modelo.
- **Detalhe do modelo** — visões de casos de uso, snippets com highlight, specs formatadas e playground embutido quando `supportsChat` é verdadeiro.
- **Comparativos externos** — Rio 2.5 Open ganhou dois gráficos de dispersão (AIME 2025 e GPQA-Diamond) com escala logarítmica, marcações customizáveis e destaque visual para o próprio modelo.
- **Chat Rio 2.0 Omni** — suporta Markdown, GFM, KaTeX, realce de código, edição de mensagens e cópia rápida.
- **Open Source** – lista modelos com `isOpenSource`, destacando licenças CC BY 4.0 e atalhos para Hugging Face.
- **Plataforma Evolve** – storytelling sobre fluxo evolutivo com terminal animado e etapas descritas em bullet points.

## Arquitetura em Destaque
- **Dados & tipagem** – todos os modelos residem em `constants.ts`, tipados por `Model`, `UseCase` e `CodeSnippet` (`types.ts`). Adições ficam centralizadas e seguras.
- **Hook `useRioChat`** – controla fila de mensagens, limite de histórico, prompt de sistema opcional e estados de carregamento/erro. Reutilizado pelo chat principal e pelo playground de detalhes.
- **Proxy Express** – `server/proxy.mjs` injeta `RIO_API_KEY`, respeita CORS configurável e reencaminha para `RIO_API_URL`, evitando expor credenciais no bundle.
- **Configuração Vite** – `vite.config.ts` publica o dev server em `http://localhost:3000`, define prefixos de ambiente (`VITE_` e `RIO_`) e provisiona proxy local para `/api`.
- **UX** – `AnimateOnScroll` usa IntersectionObserver para “revelar” blocos; `TerminalAnimation` simula logs do pipeline evolutivo; `ModelDetailView` rederiva a UI com base na seleção atual.

## Documentação Complementar
- `docs/rio-2_5-open.txt` – resumo técnico do Rio 2.5 Open com a linhagem de treinamento, modos de raciocínio e benchmarks detalhados (inclusive a referência ao SwiReasoning).

## Pré-requisitos
- Node.js 18+ (recomendado 20 LTS).
- npm 9+ (ou pnpm/yarn equivalente).
- Arquivo `.env.local` com as variáveis descritas abaixo.

## Início Rápido
1. Instale as dependências: `npm install`.
2. Copie `.env.example` para `.env.local` e preencha `RIO_API_KEY`; ajuste URLs/portas se necessário.
3. Inicie o proxy seguro (injeta credencial e faz forward para a API oficial): `npm run proxy`.
4. Em outro terminal, rode o projeto: `npm run dev` e acesse `http://localhost:3000` (`-- --host` para rede local).
5. Para build de produção: `npm run build` seguido de `npm run preview`.

## Scripts npm
| Script            | Descrição                                                                 |
|-------------------|---------------------------------------------------------------------------|
| `npm run dev`     | Servidor Vite em modo desenvolvimento com HMR.                            |
| `npm run proxy`   | Proxy Express em `http://localhost:3001/api/chat` que injeta `RIO_API_KEY`.|
| `npm run build`   | Build otimizado gerado em `dist/`.                                        |
| `npm run preview` | Servidor estático para inspeção do bundle gerado.                         |

## Variáveis de Ambiente
| Chave                       | Default                                         | Uso |
|-----------------------------|-------------------------------------------------|-----|
| `RIO_API_KEY`               | —                                               | Token obrigatório para o proxy injetar no backend. |
| `RIO_API_URL`               | `https://rio-api-test.onrender.com/v1/chat/completions` | Endpoint de destino do proxy. |
| `RIO_PROXY_PORT`            | `3001`                                          | Porta do proxy Express. |
| `RIO_ALLOWED_ORIGINS`       | `*` (via `true`)                               | Lista de origens permitidas para CORS (separadas por vírgula). |
| `RIO_PROXY_TARGET`          | `http://localhost:${RIO_PROXY_PORT}`           | URL alvo usada pelo Vite para proxiar `/api`. |
| `VITE_RIO_CHAT_PROXY_URL`   | —                                               | URL externa para `useRioChat` quando não se deseja usar `/api/chat`. |

## Estrutura do Projeto
```
.
├─ App.tsx                 # Orquestra as visualizações e a seleção de modelos
├─ components/             # Interface (Header, Hero, Chat, Terminal, etc.)
│  └─ detail/              # Subcomponentes da página de detalhes
├─ hooks/useRioChat.ts     # Hook de chat reutilizável
├─ constants.ts            # Catálogo completo da família Rio 2.0
├─ types.ts                # Tipagens compartilhadas
├─ server/proxy.mjs        # Proxy Express + dotenv
├─ index.html / index.tsx  # Bootstrap Vite + Tailwind CDN
├─ vite.config.ts          # Configuração de build e proxy
└─ dist/                   # Saída de build (`npm run build`)
```

## Customização
- **Adicionar modelos**: edite `constants.ts`, preenchendo `Model` e opcionalmente `useCases`, `codeSnippets`, `huggingFaceUrl` e `supportsChat`.
- **Ajustar o chat**: passe opções adicionais para `useRioChat` (ex.: `historyLimit`, `model`, `apiUrl`) ou sobrescreva o proxy com `VITE_RIO_CHAT_PROXY_URL`.
- **Reposicionar labels dos gráficos**: em `components/detail/Rio25PreviewDetail.tsx` há o objeto `LABEL_POSITION_OVERRIDES`, que aceita quadrantes (`top-left`, `top-right`, `bottom-left`, `bottom-right`) globais ou específicos por benchmark (`aime`/`gpqa`) para cada modelo.
- **Estilos**: Tailwind é carregado via CDN; ajuste tokens em `index.html` ou adicione classes utilitárias nos componentes.
- **Automação interna**: mantenha este README como fonte de verdade ao atualizar arquitetura, fluxos ou onboarding.

## Licença & Contato
Conteúdo visual e textual pertence à Prefeitura do Rio / IPLANRIO. Confirme com o time jurídico antes de reutilizar assets.

Contato interno: Escritório de Dados – IPLANRIO (`dados@iplan.rio`).
