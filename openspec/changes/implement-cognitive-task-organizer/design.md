## Context

MindEase is a React + Vite monorepo serving neurodivergent users. The `web-host` app currently has authentication (via federated `web-mfe-auth`) and an empty Dashboard. The project uses Clean Architecture with domain/application/infrastructure/presentation layers, Supabase for backend (auth already integrated), `@tanstack/react-query` for server state, and `@repo/ui` (shadcn/ui + Tailwind v4) for components.

The proposal introduces a cognitively-supportive task organizer with four capabilities: Kanban board, focus timer, smart checklist, and smooth transitions — all persisted to Supabase.

## Goals / Non-Goals

**Goals:**

- Deliver a fully functional task organizer on the `/dashboard` route with Kanban, timer, and smart checklist.
- Persist all task data to Supabase Postgres, scoped per user via RLS.
- Follow Clean Architecture: domain entities → repository interfaces → Supabase adapters → React presentation.
- Maintain cognitive accessibility: low stimulation, progressive disclosure, gentle feedback.
- Use React Context API + `useReducer` for local UI state (active timer, focused step).
- Use `@tanstack/react-query` for Supabase data synchronization with optimistic updates.

**Non-Goals:**

- Real-time collaboration / multi-user shared boards.
- Mobile app integration (this iteration is `web-host` only).
- Recurring tasks, deadlines, or calendar integration.
- Task assignment to other users.
- Complex Kanban features (swimlanes, WIP limits, custom columns).
- Offline-first / service worker caching.

## Decisions

### 1. State architecture: React Context + useReducer for UI, React Query for server state

**Decision:** Split state into two concerns:

- **Server state** (`@tanstack/react-query`): task CRUD, checklist steps, timer preferences — all synced with Supabase.
- **Local UI state** (React Context + `useReducer`): ephemeral state like active timer countdown, which step is focused, drag-and-drop in-flight state.

**Why over alternatives:**

- _vs. Zustand_: Context API avoids adding a new dependency. The UI state is simple enough (a few values) that Context won't cause performance issues. Zustand would be overkill here.
- _vs. React Query alone_: Timer ticking state (seconds remaining) updates every second — this must be local, not server-synced. Context handles this naturally.
- _vs. single Context for everything_: Separating server state into React Query gives us caching, background refetch, optimistic updates, and retry logic for free.

### 2. Supabase schema design

**Decision:** Three tables with RLS:

```sql
-- tasks table
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  position integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- checklist_steps table
create table checklist_steps (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade not null,
  title text not null,
  completed boolean not null default false,
  position integer not null default 0,
  created_at timestamptz default now()
);

-- timer_preferences table (one row per user)
create table timer_preferences (
  user_id uuid primary key references auth.users(id),
  focus_duration integer not null default 25,
  break_duration integer not null default 5,
  long_break_duration integer not null default 15,
  cycles_before_long_break integer not null default 4,
  updated_at timestamptz default now()
);
```

RLS policies: `using (auth.uid() = user_id)` on all tables. Checklist steps inherit access via the task's `user_id` join.

**Why:** Flat, normalized schema. `position` integer enables drag-and-drop reordering with simple integer swaps. Timer preferences are per-user (not per-task) to keep the UX simple — users set their rhythm once.

### 3. Drag-and-drop library: @dnd-kit

**Decision:** Use `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop.

**Why over alternatives:**

- _vs. react-beautiful-dnd_: Deprecated/unmaintained. @dnd-kit is the modern successor with active maintenance.
- _vs. native HTML drag-and-drop_: Poor accessibility, no keyboard support, inconsistent touch behavior. @dnd-kit provides built-in keyboard and screen reader support.
- _vs. pragmatic-drag-and-drop (Atlassian)_: Good library but @dnd-kit has better React integration, more mature sortable presets, and broader community adoption.

@dnd-kit also supports `KeyboardSensor` for users who can't use a mouse — critical for accessibility.

### 4. Component architecture

**Decision:** Dashboard page composes three main feature components:

```
Dashboard (page)
├── KanbanBoard
│   ├── KanbanColumn (× 3: todo, in_progress, done)
│   │   └── TaskCard (× n)
│   │       ├── SmartChecklist (progressive disclosure)
│   │       └── FocusTimer (per-task, collapsible)
│   └── TaskCreateForm (inline, minimal)
└── TimerPreferencesPanel (settings drawer)
```

Each feature component has its own hook (`useTaskKanban`, `useFocusTimer`, `useSmartChecklist`) that encapsulates React Query mutations and context dispatches.

**Why:** Keeps components small and focused. Each hook is independently testable. The composition model lets us add/remove features without touching sibling components.

### 5. Progressive disclosure for checklist

**Decision:** The `SmartChecklist` component renders all steps but only visually emphasizes the first incomplete step. Completed steps show as dimmed checkmarks above. Future steps are collapsed (just a count: "3 more steps").

State machine: `idle → focused(stepIndex) → completing → next_step | all_done`.

**Why:** Showing only one step at a time reduces cognitive load. The "completed above, next prominent, rest hidden" pattern gives context (progress) without overwhelm. Auto-focus on the next step eliminates the decision of "what do I do next?"

### 6. Timer implementation

**Decision:** Timer runs client-side with `setInterval` in a `useEffect`. Timer state lives in React Context (not server). Only preferences (durations, cycles) are persisted to Supabase.

Timer states: `idle → running → paused → running | idle`. On cycle completion, a gentle toast (via `sonner`) notifies the user.

**Why:** The timer is ephemeral — if you close the tab, it resets. Persisting active countdowns to the server adds complexity with no real user benefit for this use case. Preferences (25min focus, 5min break) are the things worth persisting.

### 7. Transition and animation approach

**Decision:** Use Tailwind CSS `transition-all duration-300 ease-in-out` for state changes. No spring physics or complex animation libraries. Drag-and-drop uses @dnd-kit's built-in overlay with `transform` transitions.

Completion feedback: `sonner` toast with `duration: 3000`, positioned bottom-right, no sound.

**Why:** CSS transitions are predictable, performant, and don't introduce cognitive disruption. Spring animations can feel chaotic to neurodivergent users. The 300ms duration is long enough to register but short enough to not delay the workflow.

### 8. Clean Architecture layer mapping

```
domain/
  entities/          Task, ChecklistStep, TimerPreferences
  interfaces/        ITaskRepository
  valueObjects/      TaskStatus (enum)

application/
  useCases/          CreateTask, UpdateTaskStatus, ReorderTasks,
                     ToggleChecklistStep, UpdateTimerPreferences
  dtos/              TaskDTO, ChecklistStepDTO

infrastructure/
  adapters/          SupabaseTaskRepository (implements ITaskRepository)

presentation/
  pages/             Dashboard
  components/        KanbanBoard, KanbanColumn, TaskCard,
                     SmartChecklist, FocusTimer, TaskCreateForm,
                     TimerPreferencesPanel
  hooks/             useTaskKanban, useFocusTimer, useSmartChecklist
  contexts/          TaskOrganizerContext (useReducer)
```

**Why:** Mirrors the existing auth architecture pattern (`IAuthRepository` → `SupabaseAuthRepository`). Keeps Supabase concerns out of presentation. Use cases can be tested without any Supabase dependency.

## Risks / Trade-offs

- **[Position integers for ordering] → Mitigation:** Reordering updates multiple rows' `position` values. For small task lists (< 100 tasks), batch updates are fast enough. If scale becomes an issue, switch to fractional indexing (e.g., LexoRank). Not needed now.

- **[No optimistic delete rollback UX] → Mitigation:** Deleting a task with optimistic update could fail silently if the network call fails. React Query's `onError` callback will re-add the task and show an error toast. Good enough for V1.

- **[Timer resets on page reload] → Mitigation:** This is an intentional trade-off. Persisting active timers to the server creates complexity (stale timers, timezone issues, multiple tabs). V1 accepts this. A future enhancement could use `localStorage` for tab-survival.

- **[No offline support] → Mitigation:** If Supabase is unreachable, React Query retries automatically and shows stale data from cache. The user can still use the timer (local state). Tasks won't save until connectivity returns. Acceptable for V1.

- **[Context re-renders] → Mitigation:** The timer ticks every second, which triggers a context update. To avoid re-rendering the entire tree, the `TaskOrganizerContext` will be split into two contexts: `TimerContext` (high-frequency) and `UIContext` (low-frequency). Only timer-consuming components subscribe to `TimerContext`.

## Open Questions

- Should timer preferences be configurable per-task or only globally? (Current decision: globally, to reduce complexity.)
- Should completed tasks auto-archive after a time period, or stay in the Done column indefinitely?
