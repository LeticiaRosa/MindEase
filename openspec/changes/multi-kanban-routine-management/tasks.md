## 1. Database — Supabase Schema & Migration

- [x] 1.1 Create `routines` table with columns (`id`, `user_id`, `name`, `icon`, `position`, `created_at`, `updated_at`), unique constraint on `(user_id, name)`, and defaults
- [x] 1.2 Create RLS policies on `routines`: SELECT/UPDATE/DELETE with `using (auth.uid() = user_id)`, INSERT with `with check (auth.uid() = user_id)`
- [x] 1.3 Enable RLS on `routines` table (`alter table routines enable row level security`)
- [x] 1.4 Add `routine_id uuid` column to `tasks` with FK to `routines(id) ON DELETE CASCADE` (nullable initially)
- [x] 1.5 Create index `idx_tasks_routine_id` on `tasks(routine_id)`
- [x] 1.6 Document backfill SQL (assign existing tasks to first routine) and `ALTER COLUMN routine_id SET NOT NULL` for post-deploy execution

## 2. Domain Layer — Routine Entity & Repository Interface

- [x] 2.1 Create `src/domain/entities/Routine.ts` with the `Routine` interface (`id`, `userId`, `name`, `icon`, `position`, `createdAt`, `updatedAt`)
- [x] 2.2 Create `src/domain/interfaces/IRoutineRepository.ts` with methods: `getRoutines`, `createRoutine`, `updateRoutine`, `deleteRoutine`, `reorderRoutines`
- [x] 2.3 Add `routineId: string` field to the `Task` interface in `src/domain/entities/Task.ts`

## 3. Infrastructure Layer — SupabaseRoutineRepository

- [x] 3.1 Create `src/infrastructure/adapters/SupabaseRoutineRepository.ts` implementing `IRoutineRepository` with Supabase client queries and `mapRoutine` row mapper
- [x] 3.2 Update `SupabaseTaskRepository.getTasks()` to accept `routineId` parameter and add `.eq("routine_id", routineId)` filter
- [x] 3.3 Update `SupabaseTaskRepository.createTask()` to accept `routineId` as first parameter and include `routine_id` in the insert payload
- [x] 3.4 Update `SupabaseTaskRepository.mapTask()` to map `routine_id` → `routineId`

## 4. Application Layer — Use Cases & DTOs

- [x] 4.1 Create `src/application/useCases/CreateRoutine.ts` with name validation (non-empty, max 40 chars, trimmed)
- [x] 4.2 Create `src/application/useCases/UpdateRoutine.ts` delegating to repository
- [x] 4.3 Create `src/application/useCases/DeleteRoutine.ts` (silent on non-existent routine)
- [x] 4.4 Update `CreateTask` use case to accept `routineId` as first parameter and pass it to the repository
- [x] 4.5 Create `src/application/dtos/RoutineDTOs.ts` with `RoutineDTO` (mirrors entity without `userId`)

## 5. Presentation Layer — ActiveRoutineContext

- [x] 5.1 Create `src/presentation/contexts/ActiveRoutineContext.tsx` with `activeRoutineId`, `setActiveRoutineId`, and localStorage persistence keyed by `mindease:activeRoutine:<userId>`
- [x] 5.2 Add fallback logic: if stored routine ID is not found in fetched routines, default to first routine (lowest position) and update localStorage

## 6. Presentation Layer — useRoutines Hook

- [x] 6.1 Create `src/presentation/hooks/useRoutines.ts` with React Query (`queryKey: ["routines"]`), CRUD mutations with optimistic updates, and default-seeding logic (insert "Estudo" + "Trabalho" when empty)
- [x] 6.2 Wire seeding to silently handle unique constraint violations on concurrent tab race conditions

## 7. Presentation Layer — Update useTaskKanban & Task Components

- [x] 7.1 Update `useTaskKanban` to accept `routineId` parameter and change `queryKey` to `["tasks", routineId]`
- [x] 7.2 Update `useTaskKanban.createMutation` to pass `routineId` to `createTask.execute()`
- [x] 7.3 Update `KanbanBoard.tsx` to read `activeRoutineId` from `ActiveRoutineContext` and pass to `useTaskKanban`
- [x] 7.4 Update `TaskCreateForm.tsx` to read `activeRoutineId` from context and pass to create mutation; disable form when no routine is active

## 8. Presentation Layer — Routine Selector (Routine.tsx Refactor)

- [x] 8.1 Refactor `Routine.tsx` to fetch routines via `useRoutines` hook and populate `<Select>` dynamically
- [x] 8.2 Render each option with dynamic Lucide icon + routine name
- [x] 8.3 Read/write `activeRoutineId` from `ActiveRoutineContext` on selection change

## 9. Presentation Layer — Icon Picker Component

- [x] 9.1 Create `src/presentation/components/IconPicker.tsx` with curated palette (~12 Lucide icons: `notebook-pen`, `briefcase-business`, `graduation-cap`, `book-open`, `code`, `dumbbell`, `music`, `palette`, `heart-pulse`, `home`, `coffee`, `lightbulb`)
- [x] 9.2 Render icons in a grid with hover/focus labels, visible focus indicators, and selected-state border

## 10. Presentation Layer — Routine Management Page

- [x] 10.1 Create `src/presentation/pages/RoutineManagementPage.tsx` with page layout matching `CognitiveAlertConfigPage` pattern
- [x] 10.2 Add routine creation form at top using `react-hook-form` + `zod` (name: required, max 40 chars) with `IconPicker`
- [x] 10.3 Render routine list ordered by position with icon, name, and action buttons (edit, delete, move up, move down)
- [x] 10.4 Implement inline rename: edit button swaps name text for input, Escape cancels, Enter/submit calls `UpdateRoutine`
- [x] 10.5 Implement delete with gentle confirmation message ("Todas as tarefas deste Kanban serão removidas"); disable delete when only one routine remains
- [x] 10.6 Implement move up/down buttons that swap positions and call `reorderRoutines`; disable at list boundaries
- [x] 10.7 Add toast feedback: "Kanban criado com sucesso", "Kanban atualizado", "Kanban removido", "Você precisa ter pelo menos um Kanban"

## 11. Routing & Navigation

- [x] 11.1 Add `/settings/routines` route to `router.tsx` under the protected route children, importing `RoutineManagementPage`
- [x] 11.2 Add "Gerenciar Kanbans" menu item to `UserMenuDropdown.tsx` with a `LayoutGrid` icon, navigating to `/settings/routines`; place it above the "Alertas Cognitivos" item

## 12. Dashboard Integration

- [x] 12.1 Wrap Dashboard content with `ActiveRoutineContext.Provider` inside the `TimerProvider`, passing `useRoutines` data
- [x] 12.2 Verify end-to-end flow: selector → context → KanbanBoard → filtered tasks → task creation with routineId

## 13. Tests

- [ ] 13.1 Unit test `CreateRoutine` use case: valid name, empty name, name exceeding 40 chars
- [ ] 13.2 Unit test `UpdateRoutine` and `DeleteRoutine` use cases
- [ ] 13.3 Unit test `useRoutines` hook: seeding logic, CRUD mutations, localStorage persistence
- [ ] 13.4 Unit test `ActiveRoutineContext`: persistence, fallback to first routine, handling deleted routine ID
- [ ] 13.5 Unit test `useTaskKanban` with `routineId` parameter: cache key includes routineId, create mutation passes routineId
- [ ] 13.6 Component test `Routine.tsx`: renders fetched routines, changes active routine on select
- [ ] 13.7 Component test `RoutineManagementPage`: create form validation, rename, delete confirmation, reorder
- [ ] 13.8 Component test `IconPicker`: renders all icons, selection state, focus indicators
- [ ] 13.9 Update existing `TaskCreateForm` tests to include `routineId`
- [ ] 13.10 Accessibility tests: focus indicators on all interactive elements, logical tab order on management page
