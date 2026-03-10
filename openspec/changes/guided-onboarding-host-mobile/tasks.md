## 1. Domain and Application Contracts

- [x] 1.1 Definir tipos de estado do onboarding (`not_started`, `in_progress`, `completed`) compartilhados entre camadas de aplicacao
- [x] 1.2 Criar interface de repositorio para persistencia de estado do onboarding (load/save/clear)
- [x] 1.3 Implementar use cases para iniciar onboarding, avancar passo, concluir onboarding e obter status atual
- [x] 1.4 Cobrir os use cases com testes unitarios de transicao de estado e retomada de passo

## 2. Infrastructure Persistence Adapters

- [x] 2.1 Implementar adapter web-host para persistencia do onboarding em localStorage com chave versionada
- [x] 2.2 Implementar adapter mobile para persistencia do onboarding em AsyncStorage com contrato equivalente ao web-host
- [x] 2.3 Tratar cenarios de dado corrompido com fallback seguro para `not_started`
- [x] 2.4 Adicionar testes de adapter para leitura, escrita, fallback e resiliencia de parse

## 3. Entry Orchestration with Brain Today

- [x] 3.1 Criar orchestrator de entrada no web-host para decidir prioridade entre onboarding e brain-today-check-in
- [x] 3.2 Criar orchestrator equivalente no mobile no layout raiz do fluxo autenticado
- [x] 3.3 Garantir regra: onboarding pendente bloqueia check-in; onboarding concluido libera check-in por sessao
- [x] 3.4 Validar por testes de fluxo a ordem correta em primeira sessao, sessao recorrente e sessao interrompida

## 4. Web-Host Guided Onboarding UI Flow

- [x] 4.1 Criar shell de onboarding no web-host com indicador de progresso e navegacao passo-a-passo
- [x] 4.2 Implementar passo 1 (complexidade) reutilizando o contexto de preferencias existente
- [x] 4.3 Implementar passo 2 (tema, fonte, espacamento) reutilizando os mesmos setters e persistencia atuais
- [x] 4.4 Implementar passo 3 (primeira tarefa) reutilizando o fluxo de criacao de tarefa existente
- [x] 4.5 Persistir `currentStep` durante onboarding e retomar no passo correto apos reload
- [x] 4.6 Finalizar onboarding com marcacao `completed` e redirecionamento ao fluxo normal

## 5. Mobile Guided Onboarding UI Flow

- [x] 5.1 Criar telas de onboarding no mobile com sequencia equivalente de 3 etapas via expo-router
- [x] 5.2 Implementar passo 1 (complexidade) integrado ao contexto de preferencias do mobile
- [x] 5.3 Implementar passo 2 (tema, fonte, espacamento) integrado aos mesmos tokens e persistencia existentes
- [x] 5.4 Implementar passo 3 (primeira tarefa) usando o mesmo contrato de criacao de tarefa do app
- [x] 5.5 Persistir e retomar `currentStep` apos fechamento/reabertura do app
- [x] 5.6 Finalizar onboarding com estado `completed` e transicao para fluxo autenticado padrao

## 6. Validation and Regression Safety

- [x] 6.1 Criar testes de integracao web-host para gate inicial, progressao obrigatoria e nao reexibicao apos conclusao
- [x] 6.2 Criar testes mobile para progressao por etapas, retomada de passo e conclusao persistida
- [x] 6.3 Adicionar testes para o requisito modificado de `brain-today-check-in` com deferimento durante onboarding
- [x] 6.4 Executar lint e type-check nas workspaces afetadas e corrigir regressao introduzida pelo change
- [x] 6.5 Atualizar documentacao da feature com criterio de aceitacao para QA (primeira sessao, retomada e sessao recorrente)
