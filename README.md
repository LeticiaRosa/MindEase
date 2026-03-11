# MindEase

MindEase e uma plataforma para reduzir sobrecarga cognitiva no estudo e no trabalho, com foco em pessoas neurodivergentes (TDAH, TEA, dislexia e perfis com fadiga mental).

[<img width="1091" height="489" alt="image" src="https://github.com/user-attachments/assets/2f9ea63b-5981-4edf-9bd7-479052719dba" />](https://mindease-com.netlify.app/)


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

[Web+Mobile](https://github.com/user-attachments/assets/bf58e684-34e0-4069-a86a-edca7a7c07e8)

## Site

[Clique aqui para ver o site](https://mindease-com.netlify.app/)

## Link do Video Técnico (arquitetura + criterios cognitivos + demo)

[Clique aqui para ver o Video Técnico](https://drive.google.com/drive/u/0/folders/1L9Ns_-DpWCzIvruW7In-1Gv3LenIlPdY)


## Documentacao Complementar

- `AGENTS.md`: padroes e operacao do projeto
- `docs/ARCHITECTURE.md`: visao de arquitetura Clean
- `docs/CHECKLIST_AVALIACAO.md`: avaliacao objetiva dos requisitos
