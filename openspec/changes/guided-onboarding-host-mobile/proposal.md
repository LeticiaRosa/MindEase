## Why

O requisito de ritmo guiado esta apenas parcialmente atendido porque novos usuarios entram direto no dashboard sem uma sequencia orientada de configuracao inicial. Implementar onboarding por etapas no web-host e no mobile reduz sobrecarga de descoberta, acelera o primeiro valor percebido e melhora a autonomia cognitiva desde a primeira sessao.

## What Changes

- Introduzir um fluxo de onboarding inicial em etapas na primeira autenticacao para orientar configuracoes essenciais antes do uso pleno da aplicacao.
- Adicionar progressao controlada com passos claros, confirmacao de conclusao e possibilidade de retomar caso o fluxo seja interrompido.
- Cobrir, no minimo, as etapas de: escolha de complexidade, ajuste de preferencias visuais e criacao da primeira tarefa.
- Persistir o estado de conclusao do onboarding para nao repetir o fluxo a cada sessao.
- Garantir paridade funcional entre web-host e mobile mantendo os principios de acessibilidade cognitiva.

## Capabilities

### New Capabilities

- `guided-onboarding`: fluxo inicial de onboarding em etapas para configuracao cognitiva e criacao da primeira tarefa no web-host e no mobile, com persistencia de progresso e conclusao.

### Modified Capabilities

- `brain-today-check-in`: ajustar regras de entrada no app para coexistir com o novo onboarding inicial sem conflito de ordem entre check-in e configuracao guiada.

## Impact

- Areas de produto: experiencia de primeira sessao, ritmo guiado, descoberta de funcionalidades e aderencia ao checklist de acessibilidade cognitiva.
- Codigo web-host: paginas/componentes de onboarding, fluxo de roteamento inicial, contextos de preferencias e criacao de tarefa.
- Codigo mobile: telas de onboarding em `expo-router`, controle de entrada no `(app)`, integracao com contextos de preferencias e criacao de tarefa.
- Persistencia: armazenamento do estado de onboarding (em `localStorage` no web e `AsyncStorage` no mobile, ou camada equivalente ja adotada em cada plataforma).
- Testes: novos testes de fluxo para validar exibicao unica, progressao por etapas e persistencia do estado de conclusao.
