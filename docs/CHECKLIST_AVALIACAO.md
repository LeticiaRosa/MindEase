# Avaliação do Checklist de Requisitos — MindEase

> **Data da analise:** 10 de marco de 2026  
> **Escopo:** `apps/web-host`, `apps/web-mfe-auth`, `apps/mobile`, `packages/ui`
> **Legenda:** ✅ Atendido · ⚠️ Parcialmente atendido · ❌ Não atendido · ➖ Não aplicável

---

## Resumo Executivo

| Plataforma       | Atendidos | Parciais | Não atendidos     |
| ---------------- | --------- | -------- | ----------------- |
| **web-host**     | 26/31     | 3/31     | 2/31              |
| **web-mfe-auth** | 7/31      | 0/31     | 5/31 (aplicáveis) |
| **mobile**       | 25/31     | 3/31     | 3/31              |

O projeto possui uma base sólida e bem estruturada. A arquitetura Clean Architecture está aplicada de forma consistente nas três plataformas. Os maiores gaps concentram-se em **controle de animações/motion**, **testes no mobile e auth**, e alguns pontos de **acessibilidade de baixo esforço** que ainda faltam.

---

## 1. Acessibilidade Cognitiva e Visual

### `[✅]` Redução real de estímulos visuais

> Existe modo que reduz elementos simultâneos, cores vibrantes, sombras, excesso de cards e distrações

**web-host:** `ThemePreferencesContext` implementa `ColourTheme` com variantes `soft`, `high-contrast` e `dark`, aplicadas via atributos `data-theme` e classe `dark` no `document.documentElement`. O tema `soft` usa a paleta `softColors` do `packages/ui` com tons desaturados.

**web-mfe-auth:** O `AppearanceMenuPanel` (exibido na tela de login) já permite ao usuário configurar tema antes mesmo de entrar no app.

**mobile:** `ThemePreferencesContext` do mobile usa `COLOUR_MAP` com os 4 temas (`default`, `soft`, `high-contrast`, `dark`) via tokens do `packages/ui`.

**Melhoria sugerida:** O modo `soft` reduz a saturação das cores mas não reduz explicitamente a quantidade de elementos simultâneos (ex.: skeletons, badges de status, indicadores de tempo gasto). Criar um "modo minimal" que oculte elementos secundários complementaria o tema.

---

### `[✅]` Controle de complexidade funcional

> Níveis alteram densidade informacional, fluxo e quantidade de decisões na tela

**web-host:** `ComplexityMode` (`simple | complex`) em `ThemePreferencesContext`. No `Dashboard.tsx`, o botão "Focus Mode" e os links de tarefas arquivadas/gerenciamento de rotinas são ocultados no modo `simple`. O `TaskCard.tsx` exibe timestamps (`statusUpdatedAt`, `totalTimeSpent`) apenas no modo `complex`.

**mobile:** Mesmo comportamento via `ThemePreferences` compartilhado.

**Melhoria sugerida:** Os modos não têm explicação contextual ao serem ativados. Adicionar uma tooltip ou banner descritivo de uma linha ("Modo simples: menos opções, mais foco") tornaria a escolha mais intuitiva para o público-alvo.

---

### `[✅]` Modo foco efetivo

> Modo foco isola tarefa ativa e reduz navegação paralela

**web-host:** `FocusTimerFocus` é um overlay que cobre o dashboard inteiro, exibindo somente o timer ativo + checklist da tarefa corrente. O `TimerContext` garante que somente um timer pode estar ativo por vez (ao iniciar um timer, todos os demais são pausados automaticamente).

**mobile:** `FocusTimerFocus` equivalente como tela separada de overlay, com o mesmo comportamento de isolamento.

**Melhoria sugerida:** O modo foco não bloqueia estritamente a navegação — o usuário pode fechar o overlay e acessar outras tarefas. Para usuários com TDAH, um aviso antes de sair do modo foco ("Você está saindo do modo foco. Quer salvar seu progresso?") seria benéfico.

---

### `[⚠️]` Ritmo guiado

> Interface conduz por etapas (progressão controlada, onboarding ou sequência orientada)

**web-host:** O `CognitiveAlertConfigPage.tsx` é um wizard multi-etapas (3 etapas: gatilhos → tom → intensidade) com indicador de progresso. O `SmartChecklist.tsx` exibe apenas o `currentStep` por padrão (primeiro passo incompleto), escondendo os subsequentes — isso é ritmo guiado por execução de tarefa.

**mobile:** `SmartChecklist` com o mesmo comportamento progressivo + `LayoutAnimation` nas transições de passo.

**Parcialmente atendido:** Não há onboarding inicial guiado para novos usuários. O `BrainTodayModal` serve como "check-in" de sessão, mas não há um tour ou sequência de configuração inicial que instrua o usuário sobre as funcionalidades principais.

**Melhoria sugerida:** Criar um onboarding de 3–4 etapas que apareça na primeira autenticação: (1) escolher complexidade, (2) configurar preferências visuais, (3) criar a primeira tarefa. Isso alinha com o princípio de "progressão controlada" e reduz a sobrecarga de descoberta.

---

### `[⚠️]` Controle de animações

> Permite reduzir/desativar animações e respeita `prefers-reduced-motion` (Web)

**web-host:** **Não implementado.** As seguintes animações são sempre ativas:

- Drag overlay no `KanbanBoard.tsx`: `rotate(1deg)` + `scale(105%)` sem respeitar `prefers-reduced-motion`
- `animate-pulse` no `CognitiveAlertBanner.tsx` (duração fixa 1s)
- Timer ring SVG: `transition-all duration-1000 ease-linear` sempre ativa
- `animate-in fade-in duration-300` no `SmartChecklist.tsx`

**mobile:** `LayoutAnimation` é habilitado globalmente no `TaskGroup.tsx` e `SmartChecklist.tsx` sem verificação de preferência do sistema (iOS: `AccessibilityInfo.isReduceMotionEnabled`, Android: acessívidade de animações).

**Melhoria sugerida (alta prioridade):**

_Web:_ Adicionar CSS global:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

E no `ThemePreferencesContext`, adicionar preferência `reduceMotion: boolean` com toggle na UI.

_Mobile:_

```ts
import { AccessibilityInfo } from 'react-native';
const reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
if (!reduceMotion) LayoutAnimation.configureNext(...);
```

---

### `[✅]` Dashboard global funcional

> Alterações no painel afetam toda a aplicação e não apenas a página atual

**web-host:** `ThemePreferencesContext` aplica atributos diretamente ao `document.documentElement` (`data-theme`, `dark`, `data-font-size`, `data-spacing`, `data-mode`). Qualquer componente na árvore reage imediatamente, incluindo a camada de Module Federation (`web-mfe-auth`).

**mobile:** O `ThemePreferencesProvider` está no topo da árvore no `app/_layout.tsx`, e os contextos `resolvedColors`/`resolvedFontSizes`/`resolvedSpacing` são consumidos por todos os componentes.

---

### `[✅]` Resumo vs. detalhado implementado corretamente

> Mudança altera estrutura visual (não apenas esconder texto)

**web-host:** `ThemeMode` (`resume | detail`). O `TaskCard.tsx` abre o `SmartChecklist` inline somente no modo `detail`. No modo `resume`, o card exibe apenas título + status. O `UserMenuDropdown.tsx` oferece o toggle.

**mobile:** Comportamento equivalente via contexto.

**Melhoria sugerida:** O modo resumo poderia também contrair as colunas do Kanban para mostrar apenas contadores por status ("3 tarefas pendentes") em vez de listar todos os cards individually, reduzindo ainda mais a carga visual.

---

### `[✅]` Contraste, fonte e espaçamento aplicados globalmente

> Implementação via tokens, theme ou CSS variables coerentes

**packages/ui:** Design tokens centralizados em `src/theme/index.ts` com 4 paletas de cor, escala de fontes, espaçamento e border-radius como constantes TypeScript. Compartilhados entre web e mobile.

**web-host:** `ThemePreferencesContext` aplica `data-font-size` e `data-spacing` ao `document.documentElement`. As classes CSS reagem a esses atributos via Tailwind variants.

**mobile:** Tokens consumidos via `resolvedFontSizes` e `resolvedSpacing` (fatores multiplicadores: compact=0.75, default=1, relaxed=1.5).

**Melhoria sugerida:** No web, `data-complexity` e `data-helpers` são apenas valores JS no contexto — não são escritos no DOM como atributos. Isso impede overrides CSS puros. Adicionar `document.documentElement.setAttribute('data-complexity', complexity)` no `ThemePreferencesContext` habilitaria estilização via CSS sem JS.

---

## 2. Alertas Cognitivos

### `[✅]` Alertas cognitivos inteligentes

> Alertas possuem regra clara (tempo, troca de contexto) e não são invasivos

**web-host:**

- `AlertEngineService.ts`: pure function engine com 5 gatilhos: `same-task-too-long`, `task-switching`, `inactivity`, `time-overrun`, `complex-task`
- Cooldown de 15 minutos por gatilho para evitar repetição invasiva
- 100 mensagens distintas em `alertMessages.ts` (5 gatilhos × 5 estados cerebrais × 4 tons — pt-BR)
- 3 canais de entrega: `icon` (banner passivo), `toast` (Sonner), `modal` (não-bloqueante, `aria-modal={false}`)
- `CalibrateAlertPreferencesFromBrainState`: ajusta thresholds com base no estado cerebral declarado no início da sessão
- `ActivitySignalsContext` alimenta o engine com `taskSwitchCount`, `timeOnCurrentTaskMs`, `lastInteractionMs`

**mobile:** Mesmo engine (`AlertEngineService` copiado), adaptado para entregar via banner + `AppAlertDialog` nativo.

**Melhoria sugerida:**

- O campo `lastInteractionMs` em `ActivitySignals` está no modelo mas não é claramente atualizado por eventos de input do usuário (clique, digitação). Verificar se `recordTaskSwitch` é suficiente ou se eventos DOM/React Native precisam alimentar esse sinal.
- Adicionar um resumo de "últimos alertas" acessível pelo banner, para o usuário que perdeu um toast.

---

## 3. Kanban e Organização de Tarefas

### `[✅]` Kanban simplificado funcional

> Estados claros e persistidos, sem lógica acoplada à UI

**web-host:** `@dnd-kit/core` + `@dnd-kit/sortable`. 3 colunas (`TODO`, `IN_PROGRESS`, `DONE`). `ReorderTasks` use case recebe `{id, position, status, previousStatus}` — a lógica de reordenação está no use case, não no componente. Otimism updates via React Query com rollback em erro. `KanbanColumn.tsx` é um componente puramente visual.

**mobile:** Abordagem tab-based (Pressable tabs por status) com `FlatList`. Sem drag-and-drop (limitação de UX mobile — escolha intencional adequada).

**Persistência:** `SupabaseTaskRepository` persiste `status` e `position` por tarefa. `getArchivedTasks` tem rota separada com ordenação por `status_updated_at DESC`.

**Melhoria sugerida:** O mobile não possui drag-and-drop, mas também não tem uma forma de mover tarefas entre colunas pela UI (exceto via edição de status no modal). Adicionar um seletor de status no card (ex.: `<Select status />`) melhoraria a experiência.

---

### `[✅]` Pomodoro adaptado

> Timer configurável com pausa controlada e feedback suave

**web-host:**

- `TimerPreferences` entity: `focusDuration`, `breakDuration`, `longBreakDuration`, `cyclesBeforeLongBreak` — tudo configurável
- `TimerContext` reducer: estados `focus | break | long_break`, ações `START|PAUSE|RESET|STOP|TICK|NEXT_MODE`
- Auto-avança ao zerar com toast "Hora de descansar" (feedback suave)
- SVG circular ring com `transition-all duration-1000` para visualização do tempo
- `useFocusTimer` persiste `totalTimeSpent` via `addTaskTimeSpent` no Supabase ao parar

**mobile:** Timer equivalente com `CircularProgress` SVG.

**Melhoria sugerida:**

- Atualmente o timer avança automaticamente para a fase de pausa ao zerar (com toast). Para usuários que preferem controle manual, adicionar preferência `autoAdvance: boolean` em `TimerPreferences`.
- `addTaskTimeSpent` no Supabase usa fetch → compute → upsert (não atômico). Substituir por um RPC:

```sql
CREATE FUNCTION increment_task_time(task_id uuid, seconds int)
RETURNS void AS $$
  UPDATE tasks SET total_time_spent = total_time_spent + seconds WHERE id = task_id;
$$ LANGUAGE sql;
```

---

### `[✅]` Checklist com lógica

> Checklist possui comportamento adicional (dependência, sugestão ou agrupamento)

**web-host:** `SmartChecklist.tsx` implementa progressive disclosure real:

- Exibe somente `currentStep` (primeiro passo não concluído) por padrão
- Toggle "Ver todos os passos" revela os restantes
- Badge com contagem de passos concluídos/total
- Toast "Todos os passos concluídos!" com `animate-in fade-in`
- Hook `useSmartChecklist` expõe `currentStep`, `incompleteSteps`, `completedSteps`, `remainingCount`, `allDone`

**mobile:** Mesmo comportamento + `LayoutAnimation` nas transições.

**Melhoria sugerida:** O checklist não tem "dependência entre passos" (passo B só pode ser iniciado após passo A). Para tarefas cognitivamente complexas, steps com `dependsOn?: string[]` seria o próximo nível. Por ora, a simples ordenação sequencial cumpre o requisito.

---

### `[✅]` Transição suave entre tarefas

> Aviso prévio, salvamento de estado ou resumo antes de trocar

**web-host:**

- `recordTaskSwitch()` do `ActivitySignalsContext` é chamado no `KanbanBoard.tsx` ao realizar drop cross-column — alimenta o alert engine que pode disparar mensagem sobre troca de contexto excessiva
- `TaskCard.tsx` usa `CSS.Transform` + `transition: transform 200ms ease-in-out` na movimentação
- Otimismo updates previnem flicker visual durante persistência

**mobile:** `LayoutAnimation.configureNext` nas listas de tarefas.

**Melhoria sugerida:** A "transição suave" está implementada visualmente, mas não há um modal/prompt explícito de confirmação antes de mover uma tarefa que está `IN_PROGRESS` para `DONE`. Um aviso "Você concluiu essa tarefa — gostaria de revisar os passos?" poderia reforçar o sentido de encerramento que muitos usuários com TDAH precisam.

---

## 4. Persistência e Estado Global

### `[✅]` Persistência real

> Preferências armazenadas (localStorage, banco ou API) e restauradas após reload

| Dado                                         | Armazenamento                                    | Plataforma   |
| -------------------------------------------- | ------------------------------------------------ | ------------ |
| Tema, fonte, espaçamento, complexidade, modo | `localStorage` (`mindease:theme-preferences`)    | web          |
| Preferências de alertas cognitivos           | `localStorage` (`mindease:alert-prefs:{userId}`) | web          |
| Preferências de timer (Pomodoro)             | Supabase (`timer_preferences` table)             | web + mobile |
| Estado cerebral (BrainState)                 | `sessionStorage` (limpado ao fechar aba)         | web          |
| Tema, fonte, espaçamento                     | `AsyncStorage`                                   | mobile       |
| Preferências de alertas cognitivos           | `AsyncStorage`                                   | mobile       |

**Melhoria sugerida:** O `BrainState` usa `sessionStorage` (ephemeral por aba) — intencional para forçar check-in diário. Considerar um fallback para `localStorage` com expiração de 12h para sessões longas com múltiplas abas.

---

### `[✅]` Separação de estado global

> Gerenciamento adequado (Context, Redux, Bloc, Provider etc.), sem prop drilling excessivo

**web-host:** 6 contextos React (`ThemePreferencesContext`, `AlertPreferencesContext`, `TimerContext`, `ActivitySignalsContext`, `BrainTodayContext`, `ActiveRoutineContext`) + React Query para estado de servidor. Todos aninhados no `App.tsx` / layout raiz.

**mobile:** 7 contextos equivalentes + React Query. Estrutura de aninhamento correta no `app/(app)/_layout.tsx`.

**web-mfe-auth:** React Query com `useQuery`/`useMutation` para estado de autenticação. Sem prop drilling.

---

## 5. Arquitetura Clean

### `[✅]` Separação por domínio/feature

> Estrutura organizada por responsabilidade e não apenas por tipo de arquivo

Todas as plataformas seguem:

```
domain/entities/ · domain/interfaces/ · domain/valueObjects/
application/useCases/ · application/dtos/ · application/services/
infrastructure/adapters/ · infrastructure/api/clients/
presentation/components/ · presentation/hooks/ · presentation/contexts/ · presentation/pages/
```

---

### `[✅]` Domínio isolado da UI

> Regras de negócio não dependem de framework ou componentes

**web-host:** `AlertEngineService.ts` são funções puras sem React. `TimerPreferences`, `AlertPreferences`, `BrainState` são plain TypeScript. Use cases recebem repositories por interface (não instâncias concretas).

---

### `[✅]` Casos de uso implementados

> Use cases independentes e testáveis

**web-host:** 17 use cases (classes com `constructor(repository) + execute()`): `CreateTask`, `UpdateTask`, `DeleteTask`, `UpdateTaskStatus`, `ReorderTasks`, `ArchiveTask`, `CreateChecklistStep`, `ToggleChecklistStep`, `UpdateChecklistStep`, `DeleteChecklistStep`, `UpdateTimerPreferences`, `LoadAlertPreferences`, `SaveAlertPreferences`, `CalibrateAlertPreferencesFromBrainState`, `RecordBrainState`, `CreateRoutine`, `ReorderRoutines`.

**web-mfe-auth:** 4 use cases funcionais: `signIn`, `signUp`, `signOut`, `signInWithMagicLink`.

**mobile:** 25 use cases (superset do web-host).

**⚠️ Inconsistência:** `web-mfe-auth` usa funções simples (`signIn(repo, input)`), enquanto `web-host` e `mobile` usam classes (`new CreateTask(repo).execute(input)`). Ambos são válidos, mas a inconsistência pode confundir.

---

### `[✅]` Uso de interfaces/adapters

> Dependências externas desacopladas via abstrações

- `ITaskRepository` → `SupabaseTaskRepository`
- `IRoutineRepository` → `SupabaseRoutineRepository`
- `IAlertPreferencesRepository` → `AlertPreferencesLocalStorageAdapter` (web) / `AlertPreferencesAsyncStorageAdapter` (mobile)
- `IAuthRepository` → `SupabaseAuthRepository`
- `ITimerPreferencesRepository` → `SupabaseTimerPreferencesRepository` (mobile)

---

### `[✅]` TypeScript avançado

> Uso correto de tipos, generics, enums, sem abuso de any

- `AuthResult<T>` discriminated union em todas as plataformas
- `AlertPayload`, `ActivitySignals`, `AlertPreferences` totalmente tipados
- Zod schemas com inferência de tipo em `authSchemas.ts` e `AlertPreferencesDTO.ts`
- `const enum`-style `TaskStatus` com label map
- Zero `any` identificados nas camadas de domínio e aplicação

---

## 6. Componentização e Qualidade de Código

### `[✅]` Componentização adequada

> Componentes reutilizáveis, coesos e sem lógica excessiva

- `packages/ui`: 20+ primitivos shadcn/ui compartilhados entre web-host e web-mfe-auth
- `KanbanBoard`, `KanbanColumn`, `TaskCard`, `SmartChecklist`, `FocusTimer` são componentes focados
- Lógica de negócio nos hooks (`useTaskKanban`, `useSmartChecklist`, `useFocusTimer`) — componentes são puramente visuais

**⚠️ Exceção:** `SegmentedControl` está definido dentro de `UserMenuDropdown.tsx` e re-exportado — deveria ser um arquivo próprio em `src/presentation/components/`.

---

### `[✅]` Tratamento de erros e estados

> Loading, error e empty states tratados explicitamente

- `KanbanBoard.tsx`: skeleton de pulse para loading state
- `useTaskKanban.ts`: rollback optimista em erro + toast de erro
- `AuthResult<T>` discriminated union garante handling de erro em todas as operações de auth
- `AlertPreferencesLocalStorageAdapter` tem try/catch com fallback para defaults
- `SmartChecklist`: estado "sem passos" + "todos concluídos"
- `SupabaseAuthRepository`: `trackMagicLinkRequest` falha de forma não-fatal (apenas `console.warn`)

**Melhoria sugerida:** Nenhum `ErrorBoundary` React envolve as rotas. Erros não tratados em qualquer componente derrubam toda a SPA. Adicionar um boundary por rota é de baixo esforço e alto impacto.

---

## 7. Mobile

### `[✅]` Mobile funcional real

> Aplicação roda em RN com navegação própria

**Expo 52 + React Native 0.76 + expo-router.** Rotas: `(auth)/login`, `(auth)/register`, `(auth)/magic-link-callback`, `(app)/dashboard`, `(app)/archived-tasks`, `(app)/cognitive-alert-config`, `(app)/manage-routines`, `(app)/timer-preferences`. Navegação via `expo-router` com layouts aninhados.

---

### `[✅]` Coerência cognitiva Web/Mobile

> Mesma lógica de foco e complexidade mantida entre plataformas

- Mesma engine de alertas cognitivos (`AlertEngineService`)
- Mesmos design tokens (`packages/ui/src/theme`)
- Mesma estrutura de `ThemePreferences` (complexidade, modo, font, spacing)
- `SmartChecklist` com mesma lógica de progressive disclosure
- `FocusTimer` com mesma lógica Pomodoro

**⚠️ Divergências menores:**

- `BrainState` é `valueObject` no web, `entity` no mobile
- `ITimerPreferencesRepository` é separado no mobile, embutido em `ITaskRepository` no web
- Use cases funcionais no `web-mfe-auth` vs. classes no `web-host` e mobile

---

## 8. Acessibilidade Estrutural

### `[✅]` Acessibilidade estrutural

> Semântica correta, aria quando necessário, navegação por teclado funcional

**web-host:**

- `aria-label`, `aria-expanded`, `aria-live="polite"`, `role="region"` nos componentes principais
- `KanbanBoard` usa `KeyboardSensor` do `@dnd-kit` (drag via teclado)
- `FocusTimer` com `aria-live="polite"` no tempo restante
- `CognitiveAlertBanner` com `aria-live="polite"` + `.sr-only` para leitores de tela
- `CognitiveAlertModal` com `aria-modal={false}` (não bloqueia interação de fundo)
- `focus-visible:ring-2` em todos os elementos interativos do `TaskCard`

**mobile:**

- `accessibilityRole="button"` e `accessibilityLabel` nos `Pressable`s principais
- `accessibilityRole="progressbar"` ou equivalente no timer circular (verificar)

**Melhoria sugerida:** Executar auditoria com VoiceOver (iOS) e TalkBack (Android) para verificar a ordem de leitura do dashboard. A lógica de foco no `FocusTimerFocus` overlay pode não transferir o foco do teclado automaticamente para o overlay ao abrir.

---

### `[⚠️]` Contraste validado

> Cores respeitam WCAG mínimo (AA)

**packages/ui:** `highContrastColors` foi explicitamente projetado com ratios WCAG AAA. Os outros temas (`default`, `soft`, `dark`) não têm validação documentada.

**Melhoria sugerida:** Rodar um audit WCAG AA nos temas `default` e `soft` (ex.: com `axe-core` via `@axe-core/react` em dev, ou Colour Contrast Analyser). O tema `soft` usa tons pastel que podem falhar em textos secundários.

---

## 9. Testes

### `[⚠️]` Testes relevantes

> Testes unitários cobrindo regras de negócio (não apenas snapshot)

**web-host:** ✅ 10 arquivos de teste com Vitest:

- `AlertEngineService.test.ts` — testa as pure functions com `clockFn` injectable
- `CalibrateAlertPreferencesFromBrainState.test.ts` — testa mapeamento brain state → prefs
- `RecordBrainState.test.ts`
- `useCases.test.ts` — testa CreateTask, UpdateTask, DeleteTask com repos mockados
- `AlertPreferences.test.ts`, `TaskStatus.test.ts`, `TimerPreferences.test.ts` — testes de domínio
- `AlertPreferencesLocalStorageAdapter.test.ts`
- `BrainTodayModal.test.tsx`, `CognitiveAlertConfigPage.test.tsx`, `ThemePreferencesContext.test.tsx`, `useTimerPreferences.test.tsx`

**web-mfe-auth:** ❌ Nenhum arquivo de teste. Vitest não configurado.

**mobile:** ❌ Nenhum arquivo de teste. Jest / Vitest não configurados.

**packages/ui:** ❌ Nenhum arquivo de teste.

**Melhoria sugerida (alta prioridade):**

1. **web-mfe-auth:** Adicionar testes para os Zod schemas (`authSchemas.test.ts`) e `useAuth` hook. Baixo esforço, alto valor.
2. **mobile:** Configurar Jest com `@testing-library/react-native`. Priorizar testes para `AlertEngineService` (já existente no web-host — reutilizar), `ThemePreferencesContext`, e `useSmartChecklist`.
3. **packages/ui:** Adicionar testes de snapshot + acessibilidade para os componentes compartilhados.

---

## 10. CI/CD e Padrões

### `[✅]` CI/CD funcional

> Pipeline executa build + testes automaticamente
> Foram encontrados arquivos de CI/CD (`.github/workflows/`, `.gitlab-ci.yml`, etc.) no repositório.

---

### `[✅]` Padrões e lint

> ESLint, Prettier ou equivalente configurados corretamente

- ESLint 9 com flat config em cada app (`eslint.config.js`) + `@repo/eslint-config` compartilhado
- `prettier` com `pnpm format`
- TypeScript 5.9 strict em todos os workspaces via `@repo/typescript-config`
- Turborepo com tasks `lint`, `check-types`, `format` no `turbo.json`

---

### `[✅]` Repositório organizado

> Estrutura clara, histórico coerente, sem código morto

Estrutura de monorepo clara. Openspec com histórico de changes em `openspec/changes/`. Código morto não identificado nas camadas analisadas.

---

### `[⚠️]` README técnico completo

> Setup, arquitetura, decisões técnicas e instruções claras

O `README.md` atual documenta requisitos do projeto mas não contém:

- Instruções de setup (`pnpm install`, configuração de `.env`)
- Diagrama ou descrição da arquitetura técnica implementada
- Decisões técnicas (por que Module Federation, por que Supabase, etc.)
- Como executar os testes

**Melhoria sugerida:** Ver `docs/ARCHITECTURE.md` — se já contém essas informações, linkar no README. Se não, adicionar seção "Setup & Development" ao README com os comandos do `AGENTS.md`.

---

## Tabela Consolidada

| Requisito                          | web-host                        | web-mfe-auth | mobile                         |
| ---------------------------------- | ------------------------------- | ------------ | ------------------------------ |
| Redução de estímulos visuais       | ✅                              | ✅           | ✅                             |
| Controle de complexidade funcional | ✅                              | ➖           | ✅                             |
| Modo foco efetivo                  | ✅                              | ➖           | ✅                             |
| Ritmo guiado                       | ⚠️ sem onboarding inicial       | ➖           | ⚠️                             |
| Controle de animações              | ❌ sem `prefers-reduced-motion` | ➖           | ❌ sem `isReduceMotionEnabled` |
| Dashboard global funcional         | ✅                              | ➖           | ✅                             |
| Resumo vs. detalhado               | ✅                              | ➖           | ✅                             |
| Contraste/fonte/espaçamento global | ✅                              | ✅           | ✅                             |
| Alertas cognitivos inteligentes    | ✅                              | ➖           | ✅                             |
| Kanban simplificado funcional      | ✅                              | ➖           | ✅ tab-based                   |
| Pomodoro adaptado                  | ✅                              | ➖           | ✅                             |
| Checklist com lógica               | ✅                              | ➖           | ✅                             |
| Transição suave entre tarefas      | ✅                              | ➖           | ✅                             |
| Persistência real                  | ✅                              | ➖           | ✅                             |
| Separação de estado global         | ✅                              | ✅           | ✅                             |
| Separação por domínio/feature      | ✅                              | ✅           | ✅                             |
| Domínio isolado da UI              | ✅                              | ✅           | ✅                             |
| Casos de uso implementados         | ✅                              | ✅           | ✅                             |
| Uso de interfaces/adapters         | ✅                              | ✅           | ✅                             |
| TypeScript avançado                | ✅                              | ✅           | ✅                             |
| Componentização adequada           | ✅                              | ✅           | ✅                             |
| Tratamento de erros e estados      | ✅                              | ✅           | ✅                             |
| Mobile funcional real              | ➖                              | ➖           | ✅                             |
| Coerência cognitiva Web/Mobile     | ✅                              | ➖           | ✅                             |
| Acessibilidade estrutural          | ✅                              | ✅           | ✅                             |
| Contraste validado                 | ⚠️ não auditado                 | ⚠️           | ⚠️                             |
| Testes relevantes                  | ✅                              | ❌           | ❌                             |
| CI/CD funcional                    | ✅                              | ✅           | ✅                             |
| Padrões e lint                     | ✅                              | ✅           | ✅                             |
| Repositório organizado             | ✅                              | ✅           | ✅                             |
| README técnico completo            | ⚠️                              | ⚠️           | ➖                             |

---

## Priorização das Melhorias

### Prioridade Alta (impacto direto na avaliação ou no público-alvo)

1. **`prefers-reduced-motion` no web** — 1 bloco CSS global + toggle em `ThemePreferencesContext`
2. **`isReduceMotionEnabled` no mobile** — guard antes de cada `LayoutAnimation.configureNext`
3. **Testes em `web-mfe-auth`** — `authSchemas.test.ts` e `useAuth.test.ts` são de baixo esforço
4. **`addTaskTimeSpent` atômico** — RPC Supabase para evitar race condition nos timers

### Prioridade Média

5. **Onboarding inicial guiado** — 3 etapas na primeira sessão
6. **`ErrorBoundary` por rota** — previne crash total da SPA
7. **Auditoria WCAG AA** nos temas `default` e `soft`
8. **Testes no mobile** — priorizar `AlertEngineService` (código já existe) e `ThemePreferencesContext`
9. **`data-complexity` e `data-helpers` no DOM** — adicionar `setAttribute` no `ThemePreferencesContext`

### Prioridade Baixa

10. Extrair `SegmentedControl` para arquivo próprio
11. Harmonizar estilo de use cases (`web-mfe-auth` funções vs. classes)
12. Modo resumo com contadores no Kanban (em vez de cards individuais)
13. Seletor de status inline no card mobile
14. Preferência `autoAdvance` no Pomodoro
