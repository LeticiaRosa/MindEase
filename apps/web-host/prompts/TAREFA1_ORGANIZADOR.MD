✨ Implementar Organizador de Tarefas Cognitivamente Suportado

Contexto do Projeto
Você está trabalhando no MindEase, uma plataforma React que auxilia pessoas neurodivergentes ou com desafios de processamento cognitivo. O código segue arquiteturas limpas (Clean Architecture), acessibilidade cognitiva e padrões modernos de frontend.

Objetivo da Tarefa
Implemente o Organizador de Tarefas com Suporte Cognitivo como um novo módulo funcional dentro do MindEase — um sistema de gerenciamento de tarefas que ajuda o usuário a focar, reduzir sobrecarga e executar sequências de atividades com clareza e fluidez.

📌 Requisitos Funcionais

Implemente um Organizador de Tarefas com os seguintes recursos:

🧩 1. Etapas Visuais (Kanban Simplificado)

✅ Um quadro Kanban com colunas como A Fazer, Em Progresso, Concluído.
✅ Suporte para arrastar e soltar tarefas entre colunas.
✅ Cada tarefa deve exibir título, estado, e indicadores de foco.

⏱️ 2. Timers com Controle de Foco (Pomodoro Adaptado)

✅ Inclua timers integrados para sessões de foco tipo Pomodoro.
✅ Permita iniciar/pausar/reiniciar um ciclo.
✅ Mostre tempo restante com feedback visual suave.
✅ Ajuste ciclos com base em preferências cognitiva (ex.: períodos mais curtos).

🧩 3. Checklist Inteligente Dentro da Tarefa

✅ Cada tarefa tem um checklist decomponível em passos menores.
✅ O checklist deve mostrar apenas o próximo passo relevante (progressiva revelação).
✅ Ao marcar um passo, o próximo aparece com foco automático.
✅ Esse componente age como suporte cognitivo para execução, reduzindo sobrecarga visual e incentivando foco sequencial.

🌿 4. Transição Suave Entre Atividades

✅ Ao alternar de um passo para o próximo, ou de uma tarefa para outra, transições visuais devem ser suaves e sem choques cognitivos.
✅ Feedback claro de conclusão de etapas e transição de estados sem animações agressivas.

📌 Requisitos Não-Funcionais

🛠️ Tecnologias e Bibliotecas

Use já as tecnologias do projeto:

✔ React
✔ React Router Dom
✔ Tailwind CSS + shadcn/ui (via @repo/ui)
✔ lucide-react (ícones)
✔ zod (validação de formulários)
✔ TanStack React Query (se necessário)

Você pode instalar dependências adicionais quando necessário (ex.: drag-and-drop), desde que justificadas para acessibilidade e desempenho.

🧠 Critérios de Acessibilidade Cognitiva

Seu código deve:

✅ Minimizar estímulos visuais
✅ Manter foco claro no próximo passo
✅ Oferecer estados de foco guiado
✅ Evitar animações muito rápidas ou distrativas
✅ Ser legível e previsível

Explique no seu PR/descrição como cada parte da implementação ajuda no foco e organização mental do usuário.

📁 Padrões de Arquitetura

✔ Use Clean Architecture:

Domain: Entidades de tarefas, checklists e timers.
Application / Use Cases: Lógica de negócios e orquestração de estado.
Infrastructure: API clients, persistência local (se aplicável).
Presentation: Componentes React / UI.

✔ Mantenha separação clara entre camadas e use componentes de @repo/ui sempre que possível.

📦 Critérios de Entrega

Seu PR deve incluir:

🔹 Componente Kanban simplificado e interativo
🔹 Componente Timer com lógica adaptada
🔹 Componente Checklist inteligente com foco automático no próximo passo
🔹 Rotas integradas em React Router
🔹 Validações com zod
🔹 Documentação explicando escolhas arquiteturais e benefícios cognitivos
🔹 Testes básicos de unidade e integração (preferencialmente Vitest)
