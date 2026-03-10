# Guided Onboarding QA Checklist

## Objetivo

Validar que o onboarding guiado reduz sobrecarga de descoberta e respeita a ordem de entrada com Brain Today no web-host e no mobile.

## Cenarios de aceite

1. Primeira sessao autenticada

- Usuario autenticado sem estado de onboarding salvo
- Esperado: onboarding inicia no passo 1 e bloqueia dashboard

2. Progressao controlada

- Avancar do passo 1 para o passo 2
- Esperado: estado persiste como `in_progress` e `currentStep` e atualizado

3. Retomada apos interrupcao

- Fechar app/aba durante passo 2 e reabrir
- Esperado: onboarding retoma no passo 2

4. Aplicacao de preferencias

- Alterar complexidade, tema, fonte e espacamento durante onboarding
- Esperado: preferencias persistidas e refletidas no app apos concluir

5. Criacao da primeira tarefa

- Informar titulo valido no passo 3
- Esperado: tarefa criada no kanban ativo e onboarding marcado como `completed`

6. Nao reexibir onboarding apos conclusao

- Acessar novamente rota protegida na mesma conta
- Esperado: onboarding nao aparece automaticamente

7. Ordem com Brain Today

- Sessao com onboarding pendente
- Esperado: Brain Today nao abre antes da conclusao do onboarding
- Sessao com onboarding concluido e sem resposta de Brain Today
- Esperado: Brain Today abre conforme regra de sessao vigente

## Plataformas

- Web-host: fluxo em rotas protegidas via gate no ProtectedRoute
- Mobile: fluxo em layout autenticado via gate no app/(app)/\_layout
