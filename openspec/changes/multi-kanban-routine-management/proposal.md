## Why

The Task Organizer currently renders a single, global Kanban board — every task the user creates lives in one flat list. The `Routine` selector in the Dashboard header offers "Estudo" and "Trabalho" options but is purely cosmetic; it doesn't filter or segregate tasks. Neurodivergent users need **context separation** — mixing study and work tasks on the same board increases cognitive load, makes prioritisation harder, and defeats the "show less, focus on the next step" principle. Allowing users to create and switch between multiple named Kanbans (routines) lets them compartmentalise responsibilities and see only the tasks relevant to their current context.

## What Changes

- **New `routines` Supabase table** — stores user-created Kanbans (id, user_id, name, icon, position, timestamps). Each user gets two seed routines ("Estudo", "Trabalho") on first access.
- **New `routine_id` foreign key on `tasks`** — every task belongs to exactly one routine. **BREAKING** for existing tasks: a migration must assign current tasks to the user's first routine.
- **New `Routine` domain entity and repository** — CRUD operations for routines, with RLS scoped to `auth.uid()`.
- **Updated `Routine.tsx` selector** — dynamically lists the user's routines instead of hardcoded options; selecting a routine filters the Kanban to show only that routine's tasks.
- **New "Manage Kanbans" menu entry** — accessible from `UserMenuDropdown`, links to a dedicated management page (`/settings/routines`) where users can create, rename, reorder, and delete routines.
- **Updated task creation and queries** — `createTask` receives the active `routine_id`; `getTasks` filters by routine; React Query cache is keyed per routine.
- **Active-routine persistence** — the last-selected routine is stored in `localStorage` so it survives page reloads (cognitive accessibility: predictable navigation).

## Capabilities

### New Capabilities

- `routine-management`: CRUD for user-defined Kanbans (routines) — domain entity, Supabase table with RLS, repository, use cases, and the settings page UI at `/settings/routines`.
- `routine-task-filtering`: Associating tasks to a routine via `routine_id`, filtering the Kanban board and queries by the active routine, and persisting the active selection.

### Modified Capabilities

_(No existing spec-level requirements change. The cognitive alert engine and brain-today check-in remain unaffected — they operate on global activity signals, not per-routine data.)_

## Impact

- **Database**: new `routines` table; `ALTER TABLE tasks ADD COLUMN routine_id` with FK and index; data migration for existing rows.
- **Domain layer** (`apps/web-host/src/domain/`): new `Routine` entity, `IRoutineRepository` interface; `Task` entity gains `routineId` field.
- **Infrastructure** (`apps/web-host/src/infrastructure/`): new `SupabaseRoutineRepository`; `SupabaseTaskRepository.getTasks()` and `createTask()` updated to accept/filter by `routineId`.
- **Application layer**: new `CreateRoutine`, `UpdateRoutine`, `DeleteRoutine` use cases; `CreateTask` use case receives `routineId`.
- **Presentation layer**: `Routine.tsx` refactored to fetch real data; new `useRoutines` hook (React Query); new `/settings/routines` page; `KanbanBoard` receives active `routineId`; `useTaskKanban` query key includes `routineId`; `UserMenuDropdown` gets a "Gerenciar Kanbans" link.
- **Router** (`router.tsx`): add `/settings/routines` route.
- **Testing**: new unit tests for routine use cases, repository, and components; updated task tests to include `routineId`.
