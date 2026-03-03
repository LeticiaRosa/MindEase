# MindEase

Facilitar a vida acadêmica e profissional de pessoas neurodivergentes e/ou com desafios de processamento cognitivo.

## Intro

O MindEase é uma plataforma que oferece uma variedade de ferramentas e recursos para ajudar pessoas neurodivergentes e/ou com desafios de processamento cognitivo a gerenciar suas tarefas diárias, organizar suas rotinas, melhorar sua comunicação e promover seu bem-estar mental. A plataforma é composta por três micro frontends principais: Autenticação, Painel Cognitivo e Organizador de Tarefas, todos integrados em um ambiente unificado.

## Público-Alvo

Pessoas com dificuldades cognitivas, como:
● TDAH;
● TEA (Autismo);
● Dislexia;
● Burnout e sobrecarga mental;
● Dificuldades de foco e retenção;
● Ansiedade em ambientes digitais;
● Sobrecarga sensorial.

## Problema

Esses usuários relataram grande dificuldade ao utilizar plataformas atuais por causa de:
● Excesso de informação na tela;
● Falta de previsibilidade e consistência;
● Ausência de modo de foco;
● Textos longos e pouco adaptados;
● Navegação caótica;

## Requisitos

### Painel Cognitivo Personalizável

Um dashboard onde o usuário ajusta:
● Nível de complexidade da interface;
● Modo de foco (esconde distrações);
● Modo resumo / modo detalhado;
● Contraste, espaçamento e tamanho de fonte;
● Alertas cognitivos (ex.: “você está muito tempo nesta tarefa”).

### Organizador de Tarefas com Suporte Cognitivo

Um sistema de tarefas com:
● Etapas visuais (Kanban simplificado);
● Timers com controle de foco (método Pomodoro adaptado);
● Checklist inteligente para reduzir sobrecarga. O checklist inteligente seria basicamente quebrar a tarefa em passos menores, por exemplo. Ou mostrar menos coisa de cada vez e ajudar o usuário a focar no próximo passo, com o objetivo de reduzir sobrecarga..
Ele fica dentro da tarefa, como um apoio cognitivo pra execução. A implementação é livre, o importante é explicar como isso ajuda no foco e na organização mental.
● Avisos de transição suave entre atividades.

### Perfil do Usuário + Configurações Persistentes

Armazenar preferências como:
● Modo de foco;
● Intensidade de contraste e espaçamento;
● Perfil de navegação;
● Necessidades específicas;
● Rotinas de estudo ou trabalho.

## Tecnologias Esperadas

### Arquitetura Microfrontend

● Separação clara entre módulos (painel, biblioteca, tarefas, perfil);
● Comunicação entre microapps.

### Desenvolvimento Mobile

● Flutter ou React Native;
● Versão mobile deve manter coerência cognitiva com a versão Web.

### Desenvolvimento Web

● Typescript;
● Angular, React ou Next.js.

### Clean Architecture (modularidade, separação de camadas: apresentação, domínio, infra)

● Camada de domínio isolada;
● Casos de uso independentes de UI;
● Adaptadores e interfaces claras.

### Gerenciamento de estado avançado

● Implementação de gerenciamento de estado avançado (State Management: Context API, Provider, etc.)

### Testes

● Testes unitários para lógica de negócios;
● Testes de integração para fluxos principais;
● Testes de usabilidade com usuários neurodivergentes.

### Acessibilidade Cognitiva (obrigatório)

● Níveis ajustáveis de complexidade;
● Componentes de foco;
● Ritmos guiados na interface;
● Redução de estímulos visuais;
● Animações controláveis.

## Estrutura do Projeto

my-turborepo/
├── apps/
│ ├── web-host/ ← web app principal ( React )
│ ├── web-auth/ ← web app de autenticação ( React )
│ └── mobile/ ← app mobile ( React Native )
├── packages/
│ ├── ui/ ← componentes compartilhados entre os micro frontends
│ ├── ├── src/ ← código-fonte dos componentes
│ ├── ├── hooks/ ← hooks compartilhados de UI ( ex.: use-toast )

## CheckList de Requisitos do Projeto - Critério Objetivo de Avaliação

[] Redução real de estímulos visuais
Existe modo que reduz elementos simultâneos, cores vibrantes, sombras, excesso de cards e distrações (não apenas troca de tema)

[] Controle de complexidade funcional
Níveis alteram densidade informacional, fluxo e quantidade de decisões na tela

[] Modo foco efetivo
Modo foco isola tarefa ativa e reduz navegação paralela

[] Ritmo guiado
Interface conduz por etapas (progressão controlada, onboarding ou sequência orientada)

[] Controle de animações
Permite reduzir/desativar animações e respeita prefers-reduced-motion (Web)

[] Dashboard global funcional
Alterações no painel afetam toda a aplicação e não apenas a página atual

[] Resumo vs detalhado implementado corretamente
Mudança altera estrutura visual (não apenas esconder texto)

[] Contraste, fonte e espaçamento aplicados globalmente
Implementação via tokens, theme ou CSS variables coerentes

[] Alertas cognitivos inteligentes
Alertas possuem regra clara (tempo, troca de contexto) e não são invasivos

[] Kanban simplificado funcional
Estados claros e persistidos, sem lógica acoplada à UI

[] Pomodoro adaptado
Timer configurável com pausa controlada e feedback suave

[] Checklist com lógica
Checklist possui comportamento adicional (dependência, sugestão ou agrupamento)

[] Transição suave entre tarefas
Aviso prévio, salvamento de estado ou resumo antes de trocar

[] Persistência real
Preferências armazenadas (localStorage, banco ou API) e restauradas após reload

[] Separação de estado global
Gerenciamento adequado (Context, Redux, Bloc, Provider etc.), sem prop drilling excessivo

[] Separação por domínio/feature
Estrutura organizada por responsabilidade e não apenas por tipo de arquivo

[] Domínio isolado da UI
Regras de negócio não dependem de framework ou componentes

[] Casos de uso implementados
Use cases independentes e testáveis

[] Uso de interfaces/adapters
Dependências externas desacopladas via abstrações

[] TypeScript avançado
Uso correto de tipos, generics, enums, sem abuso de any

[] Componentização adequada
Componentes reutilizáveis, coesos e sem lógica excessiva

[] Tratamento de erros e estados
Loading, error e empty states tratados explicitamente

[] Mobile funcional real
Aplicação roda em Flutter/RN com navegação própria

[] Coerência cognitiva Web/Mobile
Mesma lógica de foco e complexidade mantida entre plataformas

[] Acessibilidade estrutural
Semântica correta, aria quando necessário, navegação por teclado funcional

[] Contraste validado
Cores respeitam WCAG mínimo (AA)

[] Testes relevantes
Testes unitários cobrindo regras de negócio (não apenas snapshot)

[] CI/CD funcional
Pipeline executa build + testes automaticamente

[] Padrões e lint
ESLint, Prettier ou equivalente configurados corretamente

[] Repositório organizado
Estrutura clara, histórico coerente, sem código morto

[] README técnico completo
Setup, arquitetura, decisões técnicas e instruções claras

[] Vídeo técnico (<=15min)
Explica decisões arquiteturais e cognitivas, não apenas demonstração visual
