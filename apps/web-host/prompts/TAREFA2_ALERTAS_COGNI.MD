✨ Implementar Alertas Cognitivos Personalizáveis

Contexto do Projeto
Você está trabalhando no MindEase, uma plataforma React que auxilia pessoas neurodivergentes ou com desafios de processamento cognitivo. O código segue arquiteturas limpas (Clean Architecture), acessibilidade cognitiva e padrões modernos de frontend.

Objetivo da Tarefa
O que são Alertas Cognitivos Personalizáveis (no contexto do seu projeto)? São intervenções leves e adaptáveis que ajudam o usuário a:
🔹Perceber padrões de distração
🔹Reduzir sobrecarga mental
🔹Regular foco e energia
🔹Interromper ciclos de procrastinação
🔹Reforçar progresso

Eles não são apenas “notificações”.
Eles são apoios executivos em tempo real.

📌 Requisitos Funcionais

🔹 1. Modo “Cérebro Hoje”

Antes de abrir o dashboard, o app pergunta algo simples (através de um modal leve):

“Como seu cérebro está hoje?”

Opções:
🟢 Focado
🟡 Cansado
🔴 Sobrecarregado
🔵 Ansioso
🟣 Disperso

Com base nisso, o sistema:
Ajusta os Alertas Cognitivos Personalizáveis para o dia
Prioriza tipos de alertas mais adequados

👉 Isso cria uma experiência adaptativa cognitiva real, não só customização manual.

🔹 2. Opção no MENU para alterar a configuração dos Alertas Cognitivos Personalizáveis

🔹 3. Quando quer ser alertado

Após X minutos na mesma tarefa
Ao trocar de tarefa muitas vezes
Ao ficar muito tempo sem interação
Ao ultrapassar o tempo planejado
Ao iniciar uma tarefa complexa

🔹 3. Que tipo de alerta prefere

Texto curto e direto
Mensagem acolhedora
Pergunta reflexiva
Sugestão de ação
Vibração leve (mobile)

🔹 4. Intensidade

🔕 Discreto (apenas ícone piscando)
🔔 Moderado (toast pequeno)
📢 Ativo (modal leve com sugestão)

🧠 Exemplos aplicados ao seu público

Para TDAH
“Você mudou de tarefa 3 vezes. Quer escolher só uma por 10 minutos?”
“Dividir essa tarefa pode ajudar?”

Para ansiedade
“Você está há 40 min nessa tarefa. Quer fazer uma pausa de 2 min?”
“Respira fundo antes de continuar?”

Para sobrecarga
“Talvez seja muita coisa agora. Mostrar só o próximo passo?”

Para burnout
“Seu ritmo caiu hoje. Que tal uma micro tarefa de 5 minutos?”

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

🔹 Componente de configuração de alertas com opções personalizáveis
🔹 Validações com zod
🔹 Documentação explicando escolhas arquiteturais e benefícios cognitivos
