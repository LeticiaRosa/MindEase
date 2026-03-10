# MindEase

MindEase e uma plataforma para reduzir sobrecarga cognitiva no estudo e no trabalho, com foco em pessoas neurodivergentes (TDAH, TEA, dislexia e perfis com fadiga mental).

## Problema Abordado

Ferramentas digitais tradicionais costumam aumentar a carga cognitiva em vez de reduzir:

- excesso de informacao simultanea na tela
- baixa previsibilidade de navegacao
- fluxos longos e sem orientacao por etapas
- pouca personalizacao de foco, contraste, fonte e espacamento
- feedback invasivo (modais ou interrupcoes frequentes)

## Visao da Solucao

MindEase combina dashboard cognitivo, autenticacao e organizacao de tarefas em um monorepo com Web + Mobile. A proposta e:

- reduzir estimulos visuais e decisorios
- guiar o usuario com progressao controlada
- manter consistencia cognitiva entre plataformas
- persistir preferencias de acessibilidade e foco

Principais entregas funcionais:

- ajustes globais de tema, contraste, fonte, espacamento e complexidade
- modo foco para isolamento da tarefa ativa
- organizador de tarefas com Kanban simplificado
- timer de foco (Pomodoro adaptado)
- checklist progressivo para decompor tarefas complexas
- alertas cognitivos suaves, nao intrusivos, baseados em contexto

## Quando Cada Mensagem de Alerta Aparece

As mensagens em `alertMessages` sao escolhidas por combinacao de:

- gatilho (trigger) ativo nas preferencias
- estado cognitivo atual do usuario (brain state)
- tom de mensagem escolhido pelo usuario
- intensidade escolhida pelo usuario (como o alerta sera entregue)

Para um alerta aparecer, todos os pontos abaixo precisam ser verdadeiros:

- o usuario esta na tela `/dashboard`
- o gatilho esta habilitado em `Configuracoes > Alertas Cognitivos`
- a condicao do gatilho foi atingida
- o gatilho nao esta em periodo de cool-down (15 minutos por gatilho)

Observacoes de funcionamento:

- o motor de alertas roda a cada 1 minuto
- se o estado cognitivo nao estiver definido, o sistema usa fallback `focado`
- se faltar uma mensagem especifica, o sistema usa fallback `focado + direto`

### 1) Gatilhos e condicoes

- `same-task-too-long`
  condicao: tempo na tarefa atual >= `sameTaskThresholdMin` (padrao 30 min)

- `task-switching`
  condicao: trocas de tarefa >= `taskSwitchThreshold` (padrao 3)

- `inactivity`
  condicao: sem interacao por >= `inactivityThresholdMin` (padrao 10 min)

- `time-overrun`
  condicao: tempo na tarefa atual > tempo planejado da tarefa

- `complex-task`
  condicao: tarefa atual marcada como complexa

### 2) Tom: qual texto sera exibido

O tom define qual variante textual sera escolhida dentro do mesmo gatilho e estado cognitivo:

- `direto`: texto curto e objetivo
- `acolhedor`: texto de apoio
- `reflexivo`: pergunta para autoavaliacao
- `sugestao`: proximo passo recomendado

Exemplo: para `task-switching` + `ansioso`, cada tom mostra uma mensagem diferente.

### 3) Estado cognitivo: qual versao da mensagem sera usada

O estado cognitivo selecionado na sessao altera o texto final:

- `focado`
- `cansado`
- `sobrecarregado`
- `ansioso`
- `disperso`

Exemplo: no gatilho `inactivity`, um usuario `ansioso` recebe texto diferente de um usuario `focado`.

### 4) Intensidade: como a mensagem sera entregue

- `discreto` -> canal `icon`
  exibicao: sino/indicador discreto no header

- `moderado` -> canal `toast`
  exibicao: toast curto e nao intrusivo

- `ativo` -> canal `modal`
  exibicao: modal leve com a mensagem

### 5) Ordem de avaliacao

Os gatilhos sao avaliados na ordem salva nas preferencias do usuario. Quando o primeiro gatilho valido dispara, ele gera um unico alerta naquele ciclo.

### 6) Como o sistema sabe que voce esta em uma tarefa

O sistema nao usa o Timer para isso. A tarefa ativa e inferida pelo comportamento no Kanban:

- ao mover uma tarefa entre colunas, o app registra aquela tarefa como a tarefa atual e inicia a contagem de tempo
- a partir desse momento, o tempo nessa tarefa e incrementado a cada 1 minuto
- uma troca de coluna tambem incrementa o contador de trocas de tarefa (`task-switching`)
- se nenhuma movimentacao ocorreu na sessao, `timeOnCurrentTaskMs` permanece em zero e os gatilhos `same-task-too-long` e `time-overrun` nao disparam

O Focus Timer existe na Dashboard e nas TaskCards, mas no estado atual ele nao alimenta diretamente os sinais do motor de alertas. O rastreio de tarefa ativa e exclusivamente via movimentacao no Kanban.

### 7) Configuracao padrao (primeiro uso)

- triggers: `same-task-too-long`, `task-switching`, `inactivity`
- tone: `direto`
- intensity: `moderado`
- sameTaskThresholdMin: `30`
- taskSwitchThreshold: `3`
- inactivityThresholdMin: `10`

## Tecnologias Utilizadas

### Monorepo e Build

- pnpm 9
- Turborepo 2.8
- TypeScript 5.9

### Web

- React 18
- Vite 7
- React Router v6
- Module Federation com @module-federation/vite

### Mobile

- React Native 0.76
- Expo 52
- expo-router

### UI e Estado

- Tailwind CSS v4
- shadcn/ui (pacote compartilhado)
- @tanstack/react-query
- react-hook-form + zod

### Backend e Persistencia

- Supabase (auth + dados)

### Qualidade

- ESLint 9 (flat config)
- Prettier
- Vitest (web-host)

## Arquitetura do Projeto

Este repositorio e um monorepo com separacao por apps e pacotes compartilhados:

```text
apps/
  web-host/      # Shell host (porta 3000)
  web-mfe-auth/  # Microfrontend de autenticacao (porta 3001)
  mobile/        # App mobile (Expo)
packages/
  ui/                # componentes e tokens compartilhados
  eslint-config/     # configuracoes de lint compartilhadas
  typescript-config/ # configuracoes TS compartilhadas
```

A arquitetura segue Clean Architecture em todas as plataformas:

- domain: entidades, regras e contratos
- application: casos de uso e servicos de orquestracao
- infrastructure: adapters, clientes e integracoes externas
- presentation: componentes, paginas, hooks e contexts

A documentacao arquitetural detalhada esta em `docs/ARCHITECTURE.md`.

## Decisoes Arquiteturais

### Por que Module Federation (web-host + web-mfe-auth)

**Contexto do problema:** autenticacao e shell principal possuem ciclos de mudanca diferentes e exigem deploy desacoplado.

**Decisao:** usar Module Federation via `@module-federation/vite`, com o `web-host` consumindo o remoto de auth.

**Beneficios esperados:**

- separacao de ownership entre shell e autenticacao
- deploy independente do fluxo de auth sem rebuild completo do host
- isolamento de falhas e evolucao incremental por feature

**Tradeoffs assumidos:**

- maior complexidade de ambiente local (ordem de subida dos apps)
- necessidade de alinhamento de versoes e compartilhamento de dependencias singleton (`react`, `react-dom`, `@tanstack/react-query`)
- observabilidade e debugging mais complexos entre fronteiras host/remoto

### Por que Supabase (auth + persistencia)

**Contexto do problema:** precisavamos acelerar entrega com autenticacao, banco relacional e regras de acesso sem operar backend completo do zero.

**Decisao:** adotar Supabase para autenticacao (senha + magic link), Postgres e camada de dados.

**Beneficios esperados:**

- reducao de tempo de implementacao para auth e persistencia
- stack SQL com maturidade de Postgres para consultas e evolucao de schema
- integracao simples com web e mobile, mantendo tipagem TypeScript no dominio

**Tradeoffs assumidos:**

- dependencia de plataforma externa e do modelo de quotas/planos
- necessidade de disciplina em politicas de seguranca e modelagem para evitar acoplamento ao banco
- latencia/rede impactando UX em fluxos sensiveis, exigindo fallback local quando aplicavel

### Tradeoffs de Clean Architecture no frontend

**Contexto do problema:** o produto exige alta manutencao, regras cognitivas explicitas e paridade entre web e mobile.

**Decisao:** manter separacao em `domain`, `application`, `infrastructure` e `presentation` em todas as plataformas.

**Beneficios esperados:**

- regras de negocio testaveis e independentes de framework
- maior previsibilidade para evolucao de features cognitivas
- possibilidade de reutilizar conceitos e contratos entre web e mobile

**Tradeoffs assumidos:**

- mais arquivos, camadas e boilerplate para features pequenas
- curva inicial maior para onboarding de novos contribuidores
- risco de sobre-engenharia se fronteiras de dominio nao forem aplicadas com criterio

**Mitigacao adotada:** priorizamos casos de uso e entidades apenas onde ha regra de negocio real; para fluxos simples, mantemos implementacoes enxutas para evitar complexidade acidental.

## Como Rodar o Projeto

### 1. Pre-requisitos

- Node.js 20+
- pnpm 9+

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variaveis de ambiente (auth web)

Crie o arquivo `apps/web-mfe-auth/.env` com base em `apps/web-mfe-auth/.env.example`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

### 4. Executar em desenvolvimento

Rodar todo o workspace:

```bash
pnpm dev
```

Rodar apenas o host web:

```bash
pnpm dev:host
```

Rodar apenas o microfrontend de auth:

```bash
pnpm dev:auth
```

Rodar auth e host em sequencia (evita race de federation):

```bash
pnpm dev:sequential
```

### 5. Comandos de qualidade

```bash
pnpm lint
pnpm check-types
pnpm format
```

## Prints ou GIFs da Aplicacao

Ainda nao ha capturas oficiais versionadas do produto no repositorio. Para fechar este requisito, adicione arquivos em `docs/media/` e atualize esta secao.

Sugestao minima:

- `docs/media/web-dashboard.png`
- `docs/media/web-focus-mode.gif`
- `docs/media/mobile-dashboard.png`

Exemplo de como referenciar quando os arquivos forem adicionados:

```md
![Dashboard Web](docs/media/web-dashboard.png)
![Modo Foco (GIF)](docs/media/web-focus-mode.gif)
![Dashboard Mobile](docs/media/mobile-dashboard.png)
```

## Link do Video

Video tecnico (arquitetura + criterios cognitivos + demo):

- Pendente de publicacao
- Recomendacao: video de ate 15 minutos com secao de decisoes arquiteturais e secao de acessibilidade cognitiva

## Documentacao Complementar

- `AGENTS.md`: padroes e operacao do projeto
- `docs/ARCHITECTURE.md`: visao de arquitetura Clean
- `docs/CHECKLIST_AVALIACAO.md`: avaliacao objetiva dos requisitos
