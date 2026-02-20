## Why

MindEase currently has no task management functionality — after login the user lands on an empty Dashboard placeholder. Neurodivergent users need a structured, low-stimulation task organizer that reduces cognitive overload, guides focus sequentially, and supports customizable work/break rhythms. Building this now fills the core feature gap and delivers the platform's primary value proposition.

## What Changes

- **New Kanban board** — A simplified three-column board (To Do, In Progress, Done) with drag-and-drop reordering. Each task card shows title, status, and focus indicators. Visual density is kept minimal to avoid overwhelm.
- **New Pomodoro-style focus timer** — Integrated per-task timer with start/pause/reset controls. Cycle durations are adjustable to accommodate shorter attention spans. Visual feedback uses gentle progress indicators instead of aggressive countdowns.
- **New smart checklist** — Each task contains decomposable sub-steps. Only the current step is prominently visible (progressive disclosure). Completing a step automatically reveals and focuses the next one, reducing decision fatigue.
- **Smooth activity transitions** — State changes between steps and tasks use soft CSS transitions. Completion feedback is non-intrusive (gentle toasts via `sonner`). No modals, pop-ups, or jarring animations.
- **New route** — The organizer replaces the current empty Dashboard at `/dashboard` within the existing protected route structure.
- **Domain layer** — New entities for Task, Checklist, ChecklistStep, and FocusTimer following Clean Architecture in `web-host`.
- **State management** — Tasks and preferences managed via React Context API with `useReducer` for predictable state transitions. No external state library needed.
- **Supabase persistence** — Tasks, checklist steps, and timer preferences persisted to Supabase Postgres via the existing `supabaseClient`. Data is scoped per authenticated user using RLS policies. `@tanstack/react-query` handles server-state synchronization, caching, and optimistic updates.

## Capabilities

### New Capabilities

- `task-kanban`: Simplified Kanban board with three columns, drag-and-drop between columns, task card display with title/status/focus indicators, and minimal visual stimulation design.
- `focus-timer`: Pomodoro-adapted timer with start/pause/reset controls, adjustable cycle durations, gentle visual progress feedback, and per-task association.
- `smart-checklist`: Progressive-disclosure checklist within tasks — decomposable sub-steps, automatic focus on next step, sequential completion flow, and cognitive load reduction.
- `task-transitions`: Smooth visual transitions between steps and tasks, non-intrusive completion feedback, predictable navigation patterns, and accessible focus management.

### Modified Capabilities

_(No existing specs to modify — the specs directory is empty.)_

## Impact

- **Code**: New domain entities, use cases, and presentation components in `apps/web-host/src/`. The existing `Dashboard.tsx` page is replaced with the organizer UI.
- **Routes**: No new routes — reuses the existing `/dashboard` protected route.
- **Dependencies**: Will need a drag-and-drop library (e.g., `@dnd-kit/core`) added to `web-host`. All other dependencies (React, Tailwind, shadcn/ui, lucide-react, zod) are already available.
- **UI package**: May add new shared components to `@repo/ui` (e.g., progress indicators, timer display) if they are reusable across apps.
- **Testing**: New Vitest test suite for domain logic and component integration tests in `web-host`.
- **Supabase schema**: New tables (`tasks`, `checklist_steps`, `timer_preferences`) with RLS policies scoped to the authenticated user. Migration managed via Supabase.
- **Data flow**: `@tanstack/react-query` for fetching/mutating Supabase data; React Context for local UI state (active timer, current focus step). Clean Architecture repository pattern (`ITaskRepository` → `SupabaseTaskRepository`) keeps persistence decoupled from presentation.
