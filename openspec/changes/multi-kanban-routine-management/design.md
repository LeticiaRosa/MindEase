## Context

The Task Organizer already provides a fully functional single-board Kanban with drag-and-drop, focus timer, and smart checklists, all persisted to Supabase. The `Routine.tsx` component renders a `<Select>` with two hardcoded values ("Estudo" / "Trabalho") but has no effect on data — it is a UI placeholder. The proposal calls for turning this into a real multi-board system: a `routines` table, a `routine_id` FK on `tasks`, CRUD for routines, and filtered views.

The existing Clean Architecture layers (domain → application → infrastructure → presentation) and the per-user RLS strategy remain the foundation. This design extends them without altering any existing capability (cognitive alerts, brain-today check-in).

## Goals / Non-Goals

**Goals:**

- Let users create, rename, reorder, and delete custom Kanbans (routines).
- Every task belongs to exactly one routine; the Kanban board shows only the active routine's tasks.
- Seed two default routines ("Estudo", "Trabalho") on first access so the experience starts familiar.
- Persist the active routine selection in `localStorage` across reloads (predictable navigation).
- Expose a `/settings/routines` management page accessible from the user menu.
- Maintain cognitive accessibility: low-stimulation UI, progressive disclosure, gentle toasts.

**Non-Goals:**

- Sharing routines between users.
- Per-routine timer preferences (timer stays global per user).
- Archiving or soft-deleting routines (hard delete only for now).
- Drag-and-drop reordering of routines on the settings page (simple up/down buttons suffice).
- Mobile app integration (web-host only).

## Decisions

### 1. New `routines` table and FK on `tasks`

**Decision:** Add a `routines` table and a `routine_id` column on `tasks`.

```sql
create table routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  name text not null,
  icon text not null default 'notebook-pen',
  position integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table tasks
  add column routine_id uuid references routines(id) on delete cascade;

create index idx_tasks_routine_id on tasks (routine_id);
```

RLS on `routines`: `using (auth.uid() = user_id)` for SELECT/UPDATE/DELETE; `with check (auth.uid() = user_id)` for INSERT.

**Why `on delete cascade` on `tasks.routine_id`:** When a routine is deleted, its tasks are removed too. This is simpler than orphaning tasks or requiring reassignment — and aligns with the "show less" principle (no stale data).

**Why over alternatives:**

- _vs. a `boards` name_: "Routine" matches the existing UI label and domain language (study routine, work routine). Consistency reduces cognitive load.
- _vs. a `tags` / many-to-many approach_: A task belongs to exactly one context (study or work). Many-to-many would complicate the UI and violate the "focus on one thing" principle.

### 2. Data migration for existing tasks

**Decision:** A migration function assigns all existing tasks (where `routine_id IS NULL`) to the user's first routine (lowest `position`).

```sql
-- Run after seeding default routines for each user
update tasks
set routine_id = (
  select id from routines
  where routines.user_id = tasks.user_id
  order by position asc
  limit 1
)
where routine_id is null;

-- Then enforce non-null
alter table tasks
  alter column routine_id set not null;
```

**Why two-step:** Adding a NOT NULL constraint on a column with existing NULLs would fail. The backfill ensures every row has a value before the constraint is applied.

### 3. Default routine seeding strategy

**Decision:** Seed routines client-side via `useRoutines` hook on first load. If the user has zero routines, insert two defaults ("Estudo" with icon `notebook-pen`, "Trabalho" with icon `briefcase-business`) in a single batch insert, then refetch.

**Why client-side over DB trigger:**

- _vs. Postgres trigger on `auth.users`_: Supabase auth triggers are limited and hard to debug. Client-side seeding is simpler, testable, and visible in the application layer.
- _vs. Edge Function_: Adds infrastructure complexity. A simple "if empty, seed" check in the hook is sufficient for this use case.

### 4. Domain layer: Routine entity and IRoutineRepository

**Decision:** New files following the existing Clean Architecture pattern:

- `domain/entities/Routine.ts` — `id`, `userId`, `name`, `icon`, `position`, `createdAt`, `updatedAt`.
- `domain/interfaces/IRoutineRepository.ts` — `getRoutines()`, `createRoutine(name, icon?)`, `updateRoutine(id, updates)`, `deleteRoutine(id)`, `reorderRoutines(updates)`.

The `Task` entity gains a `routineId: string` field.

**Why a separate repository (not extending ITaskRepository):** Routines and tasks are different aggregates. Mixing them in one repository would violate single responsibility and make testing harder.

### 5. Updated task queries: filter by `routineId`

**Decision:** Modify `ITaskRepository.getTasks()` and `createTask()` to accept `routineId`:

```typescript
getTasks(routineId: string): Promise<Task[]>;
createTask(routineId: string, title: string, description?: string): Promise<Task>;
```

`SupabaseTaskRepository` adds `.eq("routine_id", routineId)` to the `getTasks` query and includes `routine_id` in the insert payload.

React Query cache key changes from `["tasks"]` to `["tasks", routineId]` so switching routines triggers a fresh fetch (with stale data displayed instantly if cached).

**Why not a global filter context:** Passing `routineId` explicitly through the hook keeps the data flow transparent and testable. A global context would hide the dependency and make cache invalidation harder.

### 6. Active routine persistence

**Decision:** Store `activeRoutineId` in `localStorage` keyed by user ID (`mindease:activeRoutine:<userId>`). The `useRoutines` hook reads this on mount and falls back to the first routine if the stored ID is invalid or missing.

**Why `localStorage` over Supabase:** Active-routine selection is an ephemeral UI preference, not data. Persisting it server-side would add a round-trip on every page load for no benefit. `localStorage` is instant and survives reloads.

### 7. Routine management page at `/settings/routines`

**Decision:** A new route `/settings/routines` with a simple list of routines showing name, icon, and action buttons (edit, delete, move up/down). A form at the top for creating new routines (`react-hook-form` + `zod`).

The page follows the existing pattern of `CognitiveAlertConfigPage` — full-page settings under the protected route layout.

**Why a dedicated page (not inline in the dropdown):** The dropdown already has timer and appearance settings. Adding full CRUD there would make it too long and violate progressive disclosure. A dedicated page gives space for a clean, low-stimulation layout.

### 8. Routine selector in Dashboard header

**Decision:** Refactor `Routine.tsx` to:

1. Fetch routines via `useRoutines` hook.
2. Render a `<Select>` populated with the user's routines (name + icon).
3. On change, update `activeRoutineId` in `localStorage` and in local state.
4. Pass `activeRoutineId` to `<KanbanBoard>` (or provide it via a lightweight `RoutineContext`).

**Why `RoutineContext` is acceptable here:** The active routine ID is needed by `Routine.tsx` (selector), `KanbanBoard` (query filter), and `TaskCreateForm` (insert). A small context avoids prop-drilling through three levels while keeping the surface area small (just one value + setter).

### 9. Icon selection

**Decision:** Routines have an `icon` field that stores a Lucide icon name string (e.g. `"notebook-pen"`, `"briefcase-business"`, `"graduation-cap"`). The management page offers a curated palette of ~12 icons relevant to study/work contexts.

**Why a curated palette:** An open icon picker would be overwhelming. A small, hand-picked set reduces choice paralysis (cognitive accessibility).

## Risks / Trade-offs

- **[Cascade delete removes tasks]** → Acceptable for MVP. A future iteration could add a confirmation dialog listing the task count before deletion.
- **[Client-side seeding race condition]** → Two tabs opening simultaneously could double-seed. Mitigated by a unique constraint `(user_id, name)` on `routines` — the second insert fails silently and the refetch picks up the first.
- **[Migration for existing tasks]** → Must be run manually via Supabase SQL editor (no automated migration framework in the project). Document the SQL in the tasks artifact.
- **[React Query cache per routine]** → Switching routines frequently could accumulate stale cache entries. Acceptable — `react-query` garbage-collects inactive queries after 5 minutes by default.

## Migration Plan

1. Run the `CREATE TABLE routines` SQL in Supabase SQL editor.
2. Run the `ALTER TABLE tasks ADD COLUMN routine_id` SQL.
3. Create RLS policies for `routines`.
4. Deploy the updated frontend code.
5. On first load, the `useRoutines` hook seeds default routines for each user.
6. Run the backfill SQL to assign existing tasks to the first routine.
7. Run `ALTER TABLE tasks ALTER COLUMN routine_id SET NOT NULL` after backfill is verified.

**Rollback:** Drop the `routine_id` column from `tasks` and drop the `routines` table. The frontend falls back gracefully (the old code didn't use `routine_id`).

## Open Questions

- Should routine deletion require re-assigning tasks to another routine instead of cascade-deleting? (Deferred to user feedback after MVP.)
- Should the Pomodoro timer preferences eventually become per-routine? (Out of scope per non-goals, but worth considering later.)
