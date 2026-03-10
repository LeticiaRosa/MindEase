## Why

MindEase precisa manter as preferencias cognitivas de forma consistente entre web-host, web-mfe-auth e mobile para reduzir reconfiguracao repetitiva e carga mental em cada sessao. Tambem precisamos tornar o onboarding previsivel, registrando se a pessoa ja concluiu o fluxo e oferecendo controle explicito para refazer ou pular quando necessario.

## What Changes

- Persistir preferencias do usuario no Supabase e aplicar os mesmos valores em todas as aplicacoes (host, auth e mobile).
- Registrar estado de onboarding inicial por usuario (nao respondido, concluido, pulado).
- Expor acao no menu de usuario para refazer onboarding.
- Expor acao para pular onboarding quando o usuario preferir ir direto ao uso.
- Garantir que o carregamento inicial use preferencias persistidas antes de renderizar configuracoes dependentes de foco, espacamento e navegacao.

## Capabilities

### New Capabilities

- `user-preferences-sync`: Persistencia e sincronizacao de preferencias cognitivas no Supabase, com leitura e aplicacao consistente em todas as apps.
- `onboarding-state-management`: Controle de estado do onboarding por usuario, incluindo conclusao inicial, opcao de pular e opcao de refazer no menu.

### Modified Capabilities

- Nenhuma.

## Impact

- Banco de dados Supabase: nova modelagem para preferencias e estado de onboarding por usuario, com politicas de seguranca por dono e consultas indexadas.
- Aplicacoes web e mobile: ajustes no bootstrap de sessao/preferencias e no menu de usuario para incluir refazer onboarding.
- Fluxo de UX: primeira experiencia mais previsivel e menos intrusiva, mantendo o principio de foco guiado e baixa estimulacao.
- Testes: novos cenarios de persistencia cross-app, inicializacao com preferencias salvas e transicoes de estado do onboarding (concluir, pular, refazer).
