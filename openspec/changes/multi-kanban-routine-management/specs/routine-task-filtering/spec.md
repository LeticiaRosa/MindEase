## ADDED Requirements

### Requirement: Task entity includes a routineId field

The `Task` interface SHALL include a `routineId: string` field representing the UUID of the routine the task belongs to. Every task MUST belong to exactly one routine.

#### Scenario: Task entity shape includes routineId

- **WHEN** a `Task` value is constructed
- **THEN** it contains a `routineId` field of type `string`

---

### Requirement: Task repository methods accept routineId

`ITaskRepository.getTasks()` SHALL accept a `routineId: string` parameter and return only tasks belonging to that routine. `ITaskRepository.createTask()` SHALL accept `routineId` as its first parameter and include `routine_id` in the database insert.

#### Scenario: getTasks filters by routineId

- **WHEN** `getTasks(routineId)` is called with routine A's ID
- **THEN** only tasks where `routine_id = A` are returned, ordered by `position` ascending

#### Scenario: getTasks with unknown routineId returns empty

- **WHEN** `getTasks(routineId)` is called with a UUID that has no tasks
- **THEN** an empty array is returned

#### Scenario: createTask assigns routine_id

- **WHEN** `createTask(routineId, "New Task")` is called
- **THEN** the inserted row has `routine_id = routineId` and status `'todo'`

---

### Requirement: SupabaseTaskRepository filters queries by routine_id

The `SupabaseTaskRepository` SHALL add `.eq("routine_id", routineId)` to the `getTasks` query. The `createTask` method SHALL include `routine_id` in the insert payload. The `mapTask` mapper SHALL extract `routine_id` from the database row and map it to `routineId` on the entity.

#### Scenario: SQL query includes routine_id filter

- **WHEN** `getTasks("abc-123")` is called
- **THEN** the Supabase query includes an `.eq("routine_id", "abc-123")` filter

#### Scenario: Created task row includes routine_id

- **WHEN** `createTask("abc-123", "Study React")` is called
- **THEN** the inserted row contains `routine_id: "abc-123"`

#### Scenario: Mapper converts routine_id to routineId

- **WHEN** a database row with `routine_id: "abc-123"` is mapped
- **THEN** the resulting `Task` entity has `routineId: "abc-123"`

---

### Requirement: React Query cache is keyed per routine

The `useTaskKanban` hook SHALL use `["tasks", routineId]` as the React Query cache key. Switching the active routine SHALL trigger a fresh query for the new routine's tasks while keeping cached data for previously viewed routines available for instant display.

#### Scenario: Cache key includes routineId

- **WHEN** `useTaskKanban(routineId)` is called with routine A
- **THEN** the React Query `queryKey` is `["tasks", routineA.id]`

#### Scenario: Switching routine fetches new data

- **WHEN** the user switches from routine A to routine B
- **THEN** a query with key `["tasks", routineB.id]` is executed

#### Scenario: Previously viewed routine shows cached data

- **WHEN** the user switches back to routine A after viewing routine B
- **THEN** routine A's cached tasks are displayed immediately while a background refetch occurs

---

### Requirement: Routine selector dynamically lists user routines

The `Routine.tsx` component SHALL fetch routines via the `useRoutines` hook and render a `<Select>` populated with the user's routines. Each option SHALL display the routine's icon (rendered as a Lucide component) and name.

#### Scenario: Select shows all user routines

- **WHEN** the user has 3 routines ("Estudo", "Trabalho", "Leitura")
- **THEN** the `<Select>` contains 3 options with corresponding icons and names

#### Scenario: Active routine is pre-selected

- **WHEN** the selector mounts
- **THEN** the persisted active routine (from localStorage) is selected by default

#### Scenario: Selecting a routine updates the Kanban

- **WHEN** the user selects "Trabalho" from the dropdown
- **THEN** the Kanban board re-renders showing only tasks belonging to "Trabalho"

---

### Requirement: Active routine selection is persisted in localStorage

The system SHALL store the active routine ID in localStorage under key `mindease:activeRoutine:<userId>`. On mount, the `useRoutines` hook SHALL read this value and set it as the active routine. If the stored ID does not match any existing routine, the system SHALL fall back to the first routine (lowest position).

#### Scenario: Active routine persists across page reloads

- **WHEN** the user selects "Trabalho" and reloads the page
- **THEN** "Trabalho" is still the active routine after reload

#### Scenario: Fallback when stored routine no longer exists

- **WHEN** the stored active routine ID references a deleted routine
- **THEN** the system falls back to the first routine and updates localStorage

#### Scenario: Fallback when no stored value exists

- **WHEN** localStorage has no `mindease:activeRoutine:<userId>` entry
- **THEN** the first routine (by position) is selected and stored

---

### Requirement: ActiveRoutineContext provides routineId to descendant components

The system SHALL provide an `ActiveRoutineContext` with the current `activeRoutineId` and a `setActiveRoutineId` function. This context SHALL be consumed by `Routine.tsx` (selector), `KanbanBoard` (query filter), and `TaskCreateForm` (insert). The provider SHALL live inside the Dashboard page.

#### Scenario: Context provides activeRoutineId to KanbanBoard

- **WHEN** `KanbanBoard` reads `activeRoutineId` from context
- **THEN** it passes the value to `useTaskKanban(activeRoutineId)`

#### Scenario: Context provides activeRoutineId to TaskCreateForm

- **WHEN** `TaskCreateForm` reads `activeRoutineId` from context
- **THEN** newly created tasks are assigned to that routine

#### Scenario: Changing routine in selector updates context

- **WHEN** the user selects a different routine in `Routine.tsx`
- **THEN** the context value updates, and both `KanbanBoard` and `TaskCreateForm` re-render with the new routine's data

---

### Requirement: Task creation uses the active routine

The `CreateTask` use case and `TaskCreateForm` SHALL include the active `routineId` when creating a task. The form SHALL not allow task creation when no active routine is set.

#### Scenario: Task created with active routine

- **WHEN** the user creates a task titled "Read chapter 5" while routine "Estudo" is active
- **THEN** the task is inserted with `routine_id` matching "Estudo"'s ID

#### Scenario: No routine selected prevents task creation

- **WHEN** no active routine is set (edge case during loading)
- **THEN** the task creation form is disabled or hidden

---

### Requirement: Database migration adds routine_id to tasks

The `tasks` table SHALL be altered to add a `routine_id uuid` column with a foreign key to `routines(id) ON DELETE CASCADE`. An index `idx_tasks_routine_id` SHALL be created on the column. Existing tasks SHALL be backfilled to the user's first routine. After backfill, the column SHALL be set to `NOT NULL`.

#### Scenario: New tasks require routine_id

- **WHEN** a task is inserted without `routine_id` after migration is complete
- **THEN** the insert fails with a NOT NULL constraint violation

#### Scenario: Existing tasks are assigned to first routine

- **WHEN** the backfill migration runs
- **THEN** all tasks with `routine_id IS NULL` are assigned to their user's first routine (lowest position)

#### Scenario: Deleting a routine cascades to its tasks

- **WHEN** a routine is deleted
- **THEN** all tasks referencing that routine's ID are also deleted
