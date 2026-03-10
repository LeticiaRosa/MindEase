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
