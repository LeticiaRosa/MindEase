## Context

O MindEase ja possui componentes de ritmo guiado em fluxos pontuais (wizard de configuracao de alertas e checklist progressivo), mas ainda nao possui onboarding inicial orientado para novos usuarios. Isso cria sobrecarga de descoberta no primeiro acesso, principalmente para usuarios com TDAH, TEA, dislexia ou fadiga cognitiva.

O change precisa cobrir duas plataformas com arquitetura semelhante, porem stacks diferentes:

- web-host: React + Vite + React Router + Contexts + React Query
- mobile: Expo Router + React Native + Contexts + React Query

Restricoes e alinhamentos:

- manter Clean Architecture (dominio/aplicacao/infra/presentacao)
- preservar principios de acessibilidade cognitiva (baixo estimulo, progressao controlada, feedback previsivel)
- evitar onboarding repetitivo apos conclusao
- integrar com o fluxo de check-in (brain today) sem criar bloqueios de navegacao contraditorios

Stakeholders diretos: produto (experiencia inicial), engenharia web/mobile, QA, e usuarios finais com perfil neurodivergente.

## Goals / Non-Goals

**Goals:**

- Introduzir onboarding inicial por etapas no web-host e mobile com os passos:
  - escolha de complexidade
  - ajuste visual (tema, fonte, espacamento)
  - criacao da primeira tarefa
- Garantir progressao controlada (nao pular para o dashboard sem concluir ou explicitar adiamento).
- Persistir estado de onboarding (nao iniciado, em progresso, concluido, ignorado com retomada).
- Definir regra clara de orquestracao entre onboarding e brain-today-check-in.
- Manter paridade de experiencia entre web e mobile respeitando convencoes de cada plataforma.

**Non-Goals:**

- Redesenhar todo o dashboard.
- Reescrever modelos de dominio de tarefas ou preferencias ja existentes.
- Introduzir novo backend dedicado para onboarding nesta iteracao.
- Resolver outras melhorias do checklist fora do escopo (ex.: reduce motion, error boundary, testes completos em todos os modulos).

## Decisions

1. Decisao: modelar onboarding como estado persistido localmente com um pequeno state machine.

Racional:

- Atende a necessidade de exibicao unica com retomada simples.
- Evita acoplamento inicial com backend e reduz risco de regressao em auth.
- Permite evolucao futura para sync em nuvem sem quebrar contrato da camada de apresentacao.

Modelo de estado:

- `not_started`
- `in_progress` (com `currentStep`)
- `completed`
- `dismissed` (opcional, com lembrete para retomar)

Alternativas consideradas:

- Salvar em Supabase desde ja: descartado por custo de migracao e dependencia adicional para um fluxo essencialmente de UX local.
- Estado apenas em memoria: descartado por perder continuidade apos reload/restart.

2. Decisao: criar um orchestrator de entrada no app para decidir ordem onboarding x brain-today.

Racional:

- Hoje o check-in ja atua como gate de sessao. Sem orquestracao explicita, podem ocorrer conflitos de modais/telas.
- Centralizar decisao evita logica duplicada em varios componentes de pagina/layout.

Regra definida:

- Primeiro acesso sem onboarding concluido: exibir onboarding.
- Apos onboarding concluido (na mesma sessao): avaliar exibicao do brain-today conforme regra atual.
- Acessos futuros: pular onboarding e seguir regra atual do brain-today.

Alternativas consideradas:

- Exibir onboarding e brain-today em paralelo: descartado por sobrecarga cognitiva.
- Sempre brain-today antes do onboarding: descartado por atrasar configuracoes fundamentais de usabilidade.

3. Decisao: reutilizar componentes e contextos existentes de preferencias e criacao de tarefa.

Racional:

- Reduz duplicacao e risco de divergencia entre onboarding e configuracoes normais do app.
- Mantem consistencia com padroes visuais e contratos da camada de aplicacao.

Aplicacao por passo:

- Passo 1: usar setters de complexidade do contexto de preferencias
- Passo 2: usar setters de tema/fonte/espacamento ja existentes
- Passo 3: usar use case de criacao de tarefa ja existente (mesmas validacoes)

Alternativas consideradas:

- Criar formulario proprio paralelo de onboarding: descartado por duplicar regra e aumentar manutencao.

4. Decisao: implementar shell de onboarding dedicado por plataforma, com conteudo equivalente.

Racional:

- Web e mobile exigem componentes e navegacao diferentes, mas devem manter a mesma sequencia conceitual.
- Um shell dedicado permite foco visual (uma tarefa por tela) e melhor telemetria de progresso por passo.

Diretriz de UX:

- Uma acao principal por etapa
- texto curto e previsivel
- indicador de progresso (ex.: passo 1 de 3)
- opcao de voltar sem perda de dados do passo

Alternativas consideradas:

- Reusar paginas de configuracao completas dentro do onboarding: descartado por excesso de opcoes e carga cognitiva.

5. Decisao: encapsular persistencia em adapters de infraestrutura por plataforma.

Racional:

- Preserva Clean Architecture e facilita testes unitarios da camada de aplicacao.
- Permite trocar localStorage/AsyncStorage sem impacto nos use cases.

Implementacao-alvo:

- Web: adapter de onboarding state em localStorage
- Mobile: adapter equivalente em AsyncStorage

Alternativas consideradas:

- acesso direto ao storage em componentes: descartado por acoplamento e baixa testabilidade.

## Risks / Trade-offs

- [Conflito de gates de entrada] Onboarding e brain-today podem disputar prioridade na primeira sessao -> Mitigacao: criar orchestrator unico com ordem explicita e teste de fluxo.
- [Abandono no meio do onboarding] Usuario pode fechar app antes de concluir -> Mitigacao: persistir `in_progress` com `currentStep` e retomar automaticamente.
- [Duplicacao de logica entre web e mobile] Implementacoes separadas podem divergir -> Mitigacao: compartilhar contratos de estado/eventos e validar paridade nos specs.
- [Sobrecarga de UX se passo 3 for complexo] Criar primeira tarefa pode exigir muitos campos -> Mitigacao: usar versao minima do formulario no onboarding, com opcao de detalhar depois.
- [Impacto em fluxo existente] Mudanca no ponto de entrada pode gerar regressao de navegacao -> Mitigacao: rollout incremental e testes de navegacao inicial.

Trade-offs assumidos:

- Persistencia local prioriza simplicidade e velocidade de entrega, em troca de nao sincronizar estado de onboarding entre dispositivos.
- Reutilizar use cases existentes reduz retrabalho, mas pode exigir pequenas adaptacoes para UX orientada por passos.

## Migration Plan

1. Implementar contratos de dominio/aplicacao para estado de onboarding e adapter local por plataforma.
2. Adicionar orchestrator de entrada no web-host e mobile sem habilitar por padrao (feature flag ou condicao controlada em dev).
3. Construir telas/componentes dos 3 passos e integrar com contextos/use cases existentes.
4. Integrar conclusao do onboarding com persistencia e transicao para fluxo normal (incluindo brain-today).
5. Validar fluxo de primeira sessao, retomada e sessao recorrente em ambas plataformas.
6. Habilitar para producao.

Rollback:

- Desabilitar gate de onboarding no orchestrator (retorno imediato ao fluxo atual).
- Manter dados persistidos inofensivos no storage local sem afetar funcionalidades principais.

## Open Questions

- O passo de criacao da primeira tarefa deve exigir apenas titulo, ou incluir checklist inicial opcional?
- Devemos permitir "pular por agora" no onboarding? Se sim, qual politica de lembrete para retomada?
- O status de onboarding deve permanecer local nesta fase, ou ja sera sincronizado em backend para experiencia multi-dispositivo?
- O brain-today deve abrir imediatamente apos concluir onboarding na primeira sessao, ou somente no proximo acesso?
