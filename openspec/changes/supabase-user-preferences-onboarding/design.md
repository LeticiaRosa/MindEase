## Context

A change afeta web-host, web-mfe-auth, mobile e Supabase, com necessidade de consistencia entre plataformas para preferencias cognitivas e estado de onboarding. Hoje, parte das configuracoes depende de estado local e nao existe contrato unico para saber se onboarding inicial foi concluido, pulado ou deve ser refeito.

Restricoes:

- Persistencia por usuario autenticado com isolamento por RLS.
- Leitura de preferencias no bootstrap sem criar bloqueio excessivo de render.
- UX de baixa estimulacao e navegacao previsivel.
- Compatibilidade com a arquitetura em camadas ja adotada no monorepo.

Stakeholders:

- Pessoas usuarias que precisam manter preferencias de foco entre dispositivos.
- Equipe de produto/acessibilidade, que precisa garantir onboarding controlavel (concluir, pular, refazer).

## Goals / Non-Goals

**Goals:**

- Definir modelo de dados no Supabase para preferencias e estado de onboarding por usuario.
- Definir fluxo de sincronizacao cross-app para carregar, aplicar e salvar preferencias.
- Definir comportamento de onboarding com tres transicoes centrais: concluir, pular e refazer.
- Definir pontos de integracao no menu de usuario para refazer onboarding.
- Definir estrategia de rollout segura com migracao e fallback.

**Non-Goals:**

- Redesenhar visual completo das telas de onboarding.
- Implementar novas regras de recomendacao cognitiva fora das preferencias existentes.
- Substituir o provedor de autenticacao atual.

## Decisions

### 1) Persistencia central no Supabase com uma linha por usuario

- Decisao: criar tabela dedicada de preferencias com chave primaria user_id e campos de configuracao cognitiva, junto com metadados de onboarding.
- Racional: simplifica leitura/escrita, reduz joins e facilita politica de dono.
- Alternativas consideradas:
  - Guardar tudo em user_metadata no auth: descartado por menor governanca de schema e evolucao mais dificil.
  - Tabelas separadas para preferencias e onboarding: viavel, mas aumenta complexidade sem ganho imediato para o escopo atual.

### 2) Contrato unico de estado de onboarding

- Decisao: adotar campo onboarding_state com valores pending, completed e skipped, alem de onboarding_completed_at quando aplicavel.
- Racional: explicita intencao de produto e evita inferencias ambiguas no cliente.
- Alternativas consideradas:
  - Booleano onboarding_done: descartado por nao representar skipped.
  - Eventos historicos apenas: descartado para leitura inicial simples.

### 3) Bootstrap com leitura antecipada e fallback local temporario

- Decisao: ler preferencias do Supabase logo apos sessao valida e antes de aplicar configuracoes de UI dependentes; usar fallback local apenas ate resposta inicial.
- Racional: preserva consistencia cross-app e evita piscadas de estado conflitante.
- Alternativas consideradas:
  - Somente localStorage/AsyncStorage: descartado por nao sincronizar entre apps.
  - Bloquear render completo ate resposta remota: descartado por piorar tempo de primeira interacao.

### 4) Mutacoes idempotentes com upsert

- Decisao: salvar preferencias e estado onboarding via upsert por user_id.
- Racional: simplifica criacao inicial, reduz condicoes de corrida e evita dupla logica insert/update.
- Alternativas consideradas:
  - Fluxo select + insert/update: descartado por mais round trips e mais pontos de falha.

### 5) Acao de refazer onboarding no menu de usuario

- Decisao: incluir item explicito no menu para resetar estado para pending e redirecionar para fluxo de onboarding.
- Racional: devolve controle para pessoa usuaria e reduz friccao para recalibrar preferencias.
- Alternativas consideradas:
  - Esconder em tela de configuracoes avancadas: descartado por baixa descobribilidade.
  - Exigir suporte/manual: descartado por baixa autonomia.

## Risks / Trade-offs

- [Inconsistencia temporaria entre cache local e remoto] -> Mitigacao: reconciliacao no bootstrap com timestamp de atualizacao e invalidação de cache local apos sucesso remoto.
- [Permissoes RLS bloquearem leitura/escrita legitima] -> Mitigacao: politicas owner-based simples, testes de acesso por usuario e verificacao com advisors de seguranca.
- [Mudanca de schema impactar apps em versoes diferentes] -> Mitigacao: migracao backward-compatible com defaults e leitura tolerante a campos ausentes em rollout inicial.
- [Refazer onboarding interromper fluxo ativo] -> Mitigacao: confirmar acao de forma nao intrusiva e preservar retorno para area anterior apos conclusao/pulo.

## Migration Plan

1. Criar migracao Supabase para tabela de preferencias com colunas de onboarding, timestamps e indice por user_id.
2. Aplicar politicas RLS de owner access para select/insert/update.
3. Publicar camada de infraestrutura nos apps para get/save preferencias e update de onboarding_state.
4. Integrar bootstrap de preferencias no host, auth e mobile com fallback local temporario.
5. Adicionar item de menu para refazer onboarding e acao de pular onboarding no fluxo inicial.
6. Fazer rollout gradual por ambiente com observabilidade de erros de leitura/escrita.

Rollback:

- Manter fallback local ativo.
- Desativar chamadas de escrita remota por feature flag caso haja regressao.
- Reverter migracao apenas se necessario e fora de janela critica de uso.

## Open Questions

- Quais preferencias cognitivas entram no escopo minimo da primeira entrega (fonte, espacamento, contraste, modo resumo/detalhado)?
- A opcao de pular onboarding deve ficar disponivel em todas as etapas ou apenas na primeira tela?
- O item de refazer onboarding fica no menu principal de usuario em todas as apps ou apenas no host inicialmente?
- Precisamos registrar historico de alteracoes de preferencias nesta fase ou apenas estado atual?
