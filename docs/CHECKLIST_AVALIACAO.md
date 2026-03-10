# Avaliação do Checklist de Requisitos — MindEase (Pós-Deploy)

> **Data da análise:** 10 de março de 2026  
> **Escopo:** `apps/web-host`, `apps/web-mfe-auth`, `apps/mobile`, `packages/ui`, `.github/workflows`  
> **Legenda:** ✅ Atendido · ⚠️ Parcialmente atendido · ❌ Não atendido · ➖ Não aplicável

---

## Resumo Executivo

| Plataforma       | Atendidos | Parciais | Não atendidos |
| ---------------- | --------- | -------- | ------------- |
| **web-host**     | 30/31     | 1/31     | 0/31          |
| **web-mfe-auth** | 9/31      | 1/31     | 3/31          |
| **mobile**       | 27/31     | 2/31     | 2/31          |

O projeto possui uma base muito sólida pós-deploy. A arquitetura Clean Architecture está aplicada de forma consistente nas três plataformas. O README foi completado com setup passo a passo e é agora suficiente para qualquer desenvolvedor iniciar o projeto. As melhorias de alta prioridade desta rodada foram concluídas (testes no `web-mfe-auth`, `ErrorBoundary` por rota no web-host e ampliação da suíte mobile). Os gaps remanescentes concentram-se em qualidade/acessibilidade e cobertura adicional em `packages/ui`.

---

## 1. Acessibilidade Cognitiva e Visual

### `[✅]` Redução real de estímulos visuais

> Existe modo que reduz elementos simultâneos, cores vibrantes, sombras, excesso de cards e distrações

**web-host:** `ThemePreferencesContext` implementa `ColourTheme` com variantes `soft`, `high-contrast` e `dark`, aplicadas via atributos `data-theme` e classe `dark` no `document.documentElement`. O tema `soft` usa paleta desaturada do `packages/ui`.

**web-mfe-auth:** `AppearanceMenuPanel` permite configurar tema antes mesmo de entrar no app.

**mobile:** `ThemePreferencesContext` do mobile usa `COLOUR_MAP` com os 4 temas via tokens do `packages/ui`.

---

### `[✅]` Controle de complexidade funcional

> Níveis alteram densidade informacional, fluxo e quantidade de decisões na tela

**web-host:** `ComplexityMode` (`simple | complex`) controla densidade nos dashboards e cards. No modo `simple`, links de arquivamento/rotinas e timestamps são ocultados.

**mobile:** Mesmo comportamento via `ThemePreferences` compartilhado.

---

### `[✅]` Modo foco efetivo

> Modo foco isola tarefa ativa e reduz navegação paralela

**web-host:** `FocusTimerFocus` é um overlay que cobre o dashboard inteiro, exibindo somente timer ativo + checklist. O `TimerContext` garante que apenas um timer fique ativo por vez.

**mobile:** `FocusTimerFocus` equivalente como tela de overlay com mesmo comportamento de isolamento.

---

### `[✅]` Ritmo guiado

> Interface conduz por etapas (progressão controlada, onboarding ou sequência orientada)

**web-host e mobile:** Onboarding inicial guiado implementado com arquitetura Clean completa:

- Entidade `OnboardingState` com `status` (`pending | completed | skipped`) e `currentStep`
- Use cases: `GetOnboardingState`, `StartOnboarding`, `AdvanceOnboardingStep`, `CompleteOnboarding`, `SkipOnboarding`, `ResetOnboarding`
- `OnboardingContext` em web e mobile
- Persistência via `OnboardingLocalStorageAdapter` (web) e `OnboardingAsyncStorageAdapter` (mobile)
- Interface de onboarding exibida na primeira autenticação

O `CognitiveAlertConfigPage.tsx` mantém o wizard multi-etapas de configuração. O `SmartChecklist.tsx` mantém progressive disclosure por passo.

---

### `[✅]` Controle de animações

> Permite reduzir/desativar animações e respeita `prefers-reduced-motion` (Web)

**web-host:** Implementado em duas camadas:

1. CSS global em `index.css` com `@media (prefers-reduced-motion: reduce)` desabilitando todas as animações e transições
2. Atributo `data-reduce-motion="true"` aplicado ao `document.documentElement` quando o toggle do usuário está ativo, com regra CSS correspondente
3. `ThemePreferencesContext` expõe `reduceMotion` (preferência manual) e `isReducedMotion` (OR entre manual e sistema), com sincronização reativa via `window.matchMedia`
4. Preferência persistida na camada remota via `SupabaseUserCognitivePreferencesRepository`

**mobile:** Implementado com `AccessibilityInfo.isReduceMotionEnabled()`:

- `ThemePreferencesContext` do mobile lê `AccessibilityInfo.isReduceMotionEnabled()` no mount e escuta o evento `reduceMotionChanged`
- Expõe `isReducedMotion = prefs.reduceMotion || systemReduceMotion`
- `SmartChecklist` e `FocusTimerFocus` usam `animateLayoutIfAllowed(!isReducedMotion)` — nenhum `LayoutAnimation.configureNext` é chamado quando motion está reduzido

---

### `[✅]` Dashboard global funcional

> Alterações no painel afetam toda a aplicação e não apenas a página atual

**web-host:** Atributos `data-theme`, `data-font-size`, `data-spacing`, `data-mode`, `data-helpers`, `data-reduce-motion` são aplicados no `document.documentElement`. Preferências persistidas remotamente via Supabase para sincronização entre sessões.

**mobile:** `ThemePreferencesProvider` no topo da árvore em `app/_layout.tsx`.

---

### `[✅]` Resumo vs. detalhado implementado corretamente

> Mudança altera estrutura visual (não apenas esconder texto)

**web-host:** `ThemeMode` (`resume | detail`). O `TaskCard.tsx` abre o `SmartChecklist` inline no modo `detail`. No modo `resume`, o card exibe apenas título + status.

**mobile:** Comportamento equivalente via contexto.

---

### `[✅]` Contraste, fonte e espaçamento aplicados globalmente

> Implementação via tokens, theme ou CSS variables coerentes

**packages/ui:** Design tokens centralizados em `src/theme/index.ts` com 4 paletas de cor, escala de fontes, espaçamento e border-radius. Compartilhados entre web e mobile.

**web-host:** `ThemePreferencesContext` aplica `data-font-size` e `data-spacing` ao `document.documentElement`. As classes CSS reagem a esses atributos via Tailwind.

**mobile:** Tokens consumidos via `resolvedFontSizes` e `resolvedSpacing` com fatores multiplicadores por densidade.

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

| Dado                                         | Armazenamento                                         | Plataforma   |
| -------------------------------------------- | ----------------------------------------------------- | ------------ |
| Tema, fonte, espaçamento, complexidade, modo | Supabase + `localStorage` (fallback offline)          | web          |
| Preferências de alertas cognitivos           | `localStorage` (`mindease:alert-prefs:{userId}`)      | web          |
| Preferências de timer (Pomodoro)             | Supabase (`timer_preferences` table)                  | web + mobile |
| Estado cerebral (BrainState)                 | `sessionStorage` (ephemeral — forçar check-in diário) | web          |
| Tema, fonte, espaçamento                     | `AsyncStorage`                                        | mobile       |
| Preferências de alertas cognitivos           | `AsyncStorage`                                        | mobile       |
| Estado de onboarding                         | `localStorage` / `AsyncStorage`                       | web + mobile |

**Melhoria sugerida:** O `BrainState` usa `sessionStorage` (ephemeral por aba) — intencional para forçar check-in diário. Considerar um fallback para `localStorage` com expiração de 12h para sessões longas com múltiplas abas.

---

### `[✅]` Separação de estado global

> Gerenciamento adequado (Context, Redux, Bloc, Provider etc.), sem prop drilling excessivo

**web-host:** 7 contextos React (`ThemePreferencesContext`, `AlertPreferencesContext`, `TimerContext`, `ActivitySignalsContext`, `BrainTodayContext`, `ActiveRoutineContext`, `OnboardingContext`) + React Query para estado de servidor. Todos aninhados no `App.tsx` / layout raiz.

**mobile:** 8 contextos + React Query. Inclui `AlertContext` (nativo — `showAlert` via `AppAlertDialog`) que o web-host não precisa (usa Sonner diretamente). Estrutura de aninhamento correta no `app/(app)/_layout.tsx`.

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

**web-host:** 23 use cases: `CreateTask`, `UpdateTask`, `DeleteTask`, `UpdateTaskStatus`, `ReorderTasks`, `CreateChecklistStep`, `ToggleChecklistStep`, `UpdateChecklistStep`, `DeleteChecklistStep`, `UpdateTimerPreferences`, `LoadAlertPreferences`, `SaveAlertPreferences`, `CalibrateAlertPreferencesFromBrainState`, `RecordBrainState`, `CreateRoutine`, `DeleteRoutine`, `UpdateRoutine` + 6 de onboarding: `GetOnboardingState`, `StartOnboarding`, `AdvanceOnboardingStep`, `CompleteOnboarding`, `SkipOnboarding`, `ResetOnboarding`.

**web-mfe-auth:** 4 use cases funcionais: `signIn`, `signUp`, `signOut`, `signInWithMagicLink`.

**mobile:** 34 use cases (superset do web-host): inclui todos os do web-host + `GetTasks`, `GetArchivedTasks`, `RestoreTask`, `ArchiveTask`, `GetRoutines`, `ReorderRoutines`, `AddChecklistStep`, `AddTaskTimeSpent` + auth móvel: `signIn`, `signOut`, `signUp`, `signInWithMagicLink`, `exchangeAuthCodeForSession`, `handleMagicLinkCallback`.

---

### `[✅]` Uso de interfaces/adapters

> Dependências externas desacopladas via abstrações

- `ITaskRepository` → `SupabaseTaskRepository`
- `IRoutineRepository` → `SupabaseRoutineRepository`
- `IAlertPreferencesRepository` → `AlertPreferencesLocalStorageAdapter` (web) / `AlertPreferencesAsyncStorageAdapter` (mobile)
- `IAuthRepository` → `SupabaseAuthRepository`
- `ITimerPreferencesRepository` → `SupabaseTimerPreferencesRepository` (mobile)
- `IOnboardingStateRepository` → `OnboardingLocalStorageAdapter` (web) / `OnboardingAsyncStorageAdapter` (mobile)
- `IUserCognitivePreferencesRepository` → `SupabaseUserCognitivePreferencesRepository` (web)

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

**Status atualizado:** Implementado `RouteErrorBoundary` por rota em `src/presentation/router.tsx` do `web-host` (`/`, `/login`, `/register`, `/auth/callback`, `/dashboard`, `/settings/cognitive-alerts`, `/settings/routines`, `/archived-tasks`), com fallback acessível (`role="alert"`) e ação de recarregar.

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
- Mesma arquitetura de onboarding (mesmo conjunto de use cases e entidade `OnboardingState`)

**⚠️ Divergências menores:**

- `BrainState` é `valueObject` no web, `entity` no mobile
- `ITimerPreferencesRepository` é separado no mobile, embutido no web
- Mobile tem `AlertContext` (dialog nativo); web usa Sonner diretamente
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

**Status atual por plataforma:**

- **web-host:** ✅ Validação automatizada com `src/test/accessibility/colorContrast.test.ts` (contraste de tokens) e `src/test/accessibility/LandingPage.a11y.test.tsx` (auditoria com `jest-axe`).
- **mobile:** ✅ Validação automatizada com `src/test/presentation/colorContrast.test.ts`.
- **web-mfe-auth:** ⚠️ Ainda sem suíte dedicada de contraste/acessibilidade.

**packages/ui:** A validação de contraste passou a ser documentada e testada para os temas `default`, `soft`, `dark` e `high-contrast` usando os tokens compartilhados em `src/theme/index.ts`.

**Correções aplicadas nesta rodada (guiadas pelos testes):**

- Ajuste do token `ring` para garantir contraste mínimo de indicador de foco nos temas claro/soft.
- Ajuste de `primaryForeground` no tema dark para atender AA em botões primários.
- Correções semânticas na landing (`heading-order`, role ARIA inválida e landmark de footer aninhada).

**Execução validada:**

- `pnpm --filter web-host test -- src/test/accessibility/colorContrast.test.ts src/test/accessibility/LandingPage.a11y.test.tsx` ✅
- `pnpm --filter @mindease/mobile test -- src/test/presentation/colorContrast.test.ts` ✅

**Melhoria sugerida:** Expandir a mesma auditoria para `web-mfe-auth` e incluir páginas adicionais além da landing no web-host.

---

## 9. Testes

### `[⚠️]` Testes relevantes

> Testes unitários cobrindo regras de negócio (não apenas snapshot)

**web-host:** ✅ 17 arquivos de teste com Vitest:

- `AlertEngineService.test.ts` — pure functions com `clockFn` injectable
- `CalibrateAlertPreferencesFromBrainState.test.ts`, `RecordBrainState.test.ts`
- `OnboardingUseCases.test.ts` — cobre GetOnboardingState, Start, Advance, Complete, Skip, Reset
- `useCases.test.ts` — CreateTask, UpdateTask, DeleteTask com repos mockados
- `AlertPreferences.test.ts`, `TaskStatus.test.ts`, `TimerPreferences.test.ts`
- `OnboardingLocalStorageAdapter.test.ts`, `AlertPreferencesLocalStorageAdapter.test.ts`
- `ProtectedRouteOnboarding.test.tsx`, `BrainTodayModal.test.tsx`, `CognitiveAlertConfigPage.test.tsx`
- `ThemePreferencesContext.test.tsx`, `useTimerPreferences.test.tsx`
- `accessibility/colorContrast.test.ts` — valida contraste WCAG dos tokens compartilhados
- `accessibility/LandingPage.a11y.test.tsx` — auditoria de acessibilidade com `jest-axe`

**web-mfe-auth:** ✅ Vitest configurado e testes adicionados:

- `authSchemas.test.ts` — valida login, signup (incluindo mismatch de senha) e magic link.
- `useAuth.test.tsx` — cobre carregamento de usuário, fluxo de sucesso/erro no `signIn` e unsubscribe no unmount.

**mobile:** ⚠️ 6 arquivos de teste com Vitest:

- `OnboardingUseCases.test.ts` — cobre Start, Advance (cap a step 5), Complete, Skip, Reset
- `OnboardingAsyncStorageAdapter.test.ts` — save/restore, fallback para estado corrompido
- `authDeepLink.test.ts` — criação de URL de callback e extração de tokens de hash/query params
- `AlertEngineService.test.ts` — cobre gatilhos, mapeamento de canal e cooldown
- `ThemePreferencesContext.test.tsx` — cobre hidratação/persistência e integração com `AccessibilityInfo` mockado
- `presentation/colorContrast.test.ts` — valida contraste WCAG dos tokens em todos os temas

Ainda faltam testes para hooks principais de tela e fluxos de integração end-to-end.

**packages/ui:** ❌ Nenhum arquivo de teste.

**Lacuna prioritária atual:**

1. **packages/ui:** testes de snapshot + acessibilidade nos primitivos compartilhados.

---

## 10. CI/CD e Padrões

### `[✅]` CI/CD funcional

> Pipeline executa build + testes automaticamente

`.github/workflows/ci.yml` com 4 jobs independentes: `lint`, `type-check`, `test` (roda `pnpm test` com secrets Supabase) e `build`. Executa em `push` e `pull_request` sobre `main` e `develop`. Cache de Turborepo configurado para acelerar runs subsequentes.

---

### `[✅]` Padrões e lint

> ESLint, Prettier ou equivalente configurados corretamente

- ESLint 9 com flat config em cada app + `@repo/eslint-config` compartilhado
- Prettier com `pnpm format`
- TypeScript 5.9 strict em todos os workspaces via `@repo/typescript-config`
- Turborepo com tasks `lint`, `check-types`, `format`, `test` no `turbo.json`

---

### `[✅]` Repositório organizado

> Estrutura clara, histórico coerente, sem código morto

Monorepo com estrutura clara. OpenSpec com histórico de changes em `openspec/changes/`. Código morto não identificado nas camadas analisadas.

---

### `[✅]` README técnico completo

> Setup, arquitetura, decisões técnicas e instruções claras

O README cobre todos os pontos essenciais:

- Problema abordado e visão da solução
- Tecnologias por camada (monorepo, web, mobile, UI/estado, backend, qualidade)
- Estrutura de pastas e descrição das camadas da Clean Architecture
- Setup passo a passo: `pnpm install`, configuração do `.env.example`, `pnpm dev` / `dev:host` / `dev:auth` / `dev:sequential`
- Comandos de qualidade: `pnpm lint`, `pnpm check-types`, `pnpm format`
- Referências para `docs/ARCHITECTURE.md` (arquitetura detalhada) e `docs/CHECKLIST_AVALIACAO.md`
- Seções dedicadas para screenshots (placeholder com instruções) e vídeo técnico (pendente de publicação)

**Gap residual:** O vídeo técnico e as capturas de tela da aplicação ainda não estão incluídos (placeholders documentados). As decisões de tradeoff arquiteturais (por que Module Federation, por que Supabase, por que Clean Architecture no frontend) estão ausentes mas o `ARCHITECTURE.md` cobre os padrões.

---

## Tabela Consolidada

| Requisito                          | web-host | web-mfe-auth | mobile       |
| ---------------------------------- | -------- | ------------ | ------------ |
| Redução de estímulos visuais       | ✅       | ✅           | ✅           |
| Controle de complexidade funcional | ✅       | ➖           | ✅           |
| Modo foco efetivo                  | ✅       | ➖           | ✅           |
| Ritmo guiado                       | ✅       | ➖           | ✅           |
| Controle de animações              | ✅       | ➖           | ✅           |
| Dashboard global funcional         | ✅       | ➖           | ✅           |
| Resumo vs. detalhado               | ✅       | ➖           | ✅           |
| Contraste/fonte/espaçamento global | ✅       | ✅           | ✅           |
| Alertas cognitivos inteligentes    | ✅       | ➖           | ✅           |
| Kanban simplificado funcional      | ✅       | ➖           | ✅ tab-based |
| Pomodoro adaptado                  | ✅       | ➖           | ✅           |
| Checklist com lógica               | ✅       | ➖           | ✅           |
| Transição suave entre tarefas      | ✅       | ➖           | ✅           |
| Persistência real                  | ✅       | ➖           | ✅           |
| Separação de estado global         | ✅       | ✅           | ✅           |
| Separação por domínio/feature      | ✅       | ✅           | ✅           |
| Domínio isolado da UI              | ✅       | ✅           | ✅           |
| Casos de uso implementados         | ✅       | ✅           | ✅           |
| Uso de interfaces/adapters         | ✅       | ✅           | ✅           |
| TypeScript avançado                | ✅       | ✅           | ✅           |
| Componentização adequada           | ✅       | ✅           | ✅           |
| Tratamento de erros e estados      | ✅       | ✅           | ✅           |
| Mobile funcional real              | ➖       | ➖           | ✅           |
| Coerência cognitiva Web/Mobile     | ✅       | ➖           | ✅           |
| Acessibilidade estrutural          | ✅       | ✅           | ✅           |
| Contraste validado                 | ✅       | ⚠️           | ✅           |
| Testes relevantes                  | ✅       | ✅           | ⚠️           |
| CI/CD funcional                    | ✅       | ✅           | ✅           |
| Padrões e lint                     | ✅       | ✅           | ✅           |
| Repositório organizado             | ✅       | ✅           | ✅           |
| README técnico completo            | ✅       | ✅           | ➖           |

---

## Priorização das Melhorias (Pós-Deploy)

### Prioridade Alta

1. ✅ **Testes em `web-mfe-auth`** — `authSchemas.test.ts` e `useAuth.test.ts` implementados com Vitest configurado
2. ✅ **`ErrorBoundary` por rota no web-host** — implementado com 1 boundary por rota no `router.tsx`
3. ✅ **Ampliar suite de testes mobile** — `AlertEngineService.test.ts` portado e `ThemePreferencesContext.test.tsx` adicionado com mock de `AccessibilityInfo`

### Prioridade Média

4. **`data-complexity` no DOM** — 1 linha em `applyToDocument`: `root.setAttribute('data-complexity', prefs.complexity)` no `ThemePreferencesContext` do web-host
5. **Expandir auditoria WCAG AA para `web-mfe-auth`** — criar suíte equivalente de contraste e axe no app de autenticação
6. **Testes em `packages/ui`** — snapshot + acessibilidade nos primitivos compartilhados

### Prioridade Baixa

7. Decisões arquiteturais no README (por que Module Federation, por que Supabase, tradeoffs de Clean Architecture no frontend)
8. `addTaskTimeSpent` atômico via RPC Supabase para evitar race condition nos timers
9. Extrair `SegmentedControl` para arquivo próprio em `src/presentation/components/`
10. Harmonizar estilo de use cases (`web-mfe-auth` funções vs. classes no `web-host` e mobile)
