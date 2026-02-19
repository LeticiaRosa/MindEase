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
