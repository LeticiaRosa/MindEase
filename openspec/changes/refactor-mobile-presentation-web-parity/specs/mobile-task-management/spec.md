## ADDED Requirements

### Requirement: Tasks are fetched per active routine

The `useTaskKanban` hook SHALL fetch tasks for the currently active routine via `getTasksByRoutine(routineId)`. When `activeRoutineId` changes in `ActiveRoutineContext`, the task query SHALL refetch automatically via its query key `["tasks", routineId]`.

#### Scenario: Routine switch reloads tasks

- **WHEN** the user selects a different routine from the routine selector
- **THEN** the task list re-fetches for the new `routineId` and displays the corresponding tasks

#### Scenario: No routine selected shows empty state

- **WHEN** `activeRoutineId` is `null` (no routines exist)
- **THEN** the task area displays an empty state message encouraging the user to create a routine first

---

### Requirement: Tasks are displayed in grouped sections by status

The dashboard SHALL display tasks grouped into three collapsible sections: "A fazer" (TODO), "Em andamento" (IN_PROGRESS), and "Concluído" (DONE). Each section header SHALL show the section title and task count badge.

#### Scenario: All three groups rendered

- **WHEN** the dashboard loads with tasks in multiple statuses
- **THEN** three `TaskGroup` sections are visible with correct task counts

#### Scenario: Collapsing a group hides its tasks

- **WHEN** the user taps a `TaskGroup` header
- **THEN** the section body collapses and the tasks are hidden, but the count badge remains visible

#### Scenario: Empty group shows placeholder

- **WHEN** a status group has zero tasks
- **THEN** a subtle placeholder text is displayed (e.g., "Nenhuma tarefa aqui")

---

### Requirement: Task creation is available inline at the top of each group

Each `TaskGroup` SHALL include an inline `TaskCreateForm` at the top that allows the user to add a new task to that status group.

#### Scenario: Create form appears on tap

- **WHEN** the user taps the "+" button in a group header
- **THEN** an inline text input with "Nova tarefa..." placeholder appears at the top of the group, focused and ready for input

#### Scenario: Submitting creates task with optimistic update

- **WHEN** the user types a title and presses return/submit
- **THEN** the task appears immediately in the list (optimistic), a `createTask` mutation fires, and on error the task is removed with a toast message

#### Scenario: Validation rejects empty title

- **WHEN** the user submits the create form with an empty title
- **THEN** the form is not submitted and the input shows a shake animation or red border

---

### Requirement: Task status can be changed via swipe actions

Each `TaskCard` SHALL support swipe gestures for quick status transitions. Swiping right SHALL advance the task to the next status (TODO → IN_PROGRESS → DONE). Swiping left SHALL move the task back to the previous status.

#### Scenario: Swipe right advances status

- **WHEN** the user swipes a TODO task card to the right
- **THEN** the task optimistically moves to IN_PROGRESS and the `updateTaskStatus` mutation fires

#### Scenario: Swipe left regresses status

- **WHEN** the user swipes an IN_PROGRESS task card to the left
- **THEN** the task optimistically moves back to TODO

#### Scenario: DONE task cannot advance further

- **WHEN** the user swipes a DONE task card to the right
- **THEN** no status change occurs; the swipe action is a no-op or the right action shows "Arquivar"

#### Scenario: TODO task cannot regress further

- **WHEN** the user swipes a TODO task card to the left
- **THEN** no status change occurs (swipe left is a no-op for the first status)

---

### Requirement: Task long-press reveals full action menu

Long-pressing a `TaskCard` SHALL open a context menu (or action sheet) with options: Edit, Delete, Archive, and Move to (specific status).

#### Scenario: Long-press opens action sheet

- **WHEN** the user long-presses a task card
- **THEN** an action sheet appears with at least: "Editar", "Excluir", "Arquivar", and status move options

#### Scenario: Delete action removes task with confirmation

- **WHEN** the user selects "Excluir" from the action sheet
- **THEN** a confirmation prompt appears; on confirm, the task is deleted optimistically

#### Scenario: Archive action moves task to archived status

- **WHEN** the user selects "Arquivar"
- **THEN** the task disappears from the active list (archived optimistically) and a toast confirms with an undo option

---

### Requirement: Task editing is available via a modal form

Selecting "Edit" from the task action menu SHALL open a modal with `TaskEditForm` containing title and description fields, pre-filled with the current task data.

#### Scenario: Edit form pre-fills current values

- **WHEN** the edit modal opens for a task
- **THEN** the title and description inputs contain the task's current values

#### Scenario: Saving updates task optimistically

- **WHEN** the user changes the title and saves
- **THEN** the task card updates immediately (optimistic) and the `updateTask` mutation fires

---

### Requirement: All task mutations use optimistic updates with rollback

Every task mutation (create, update status, edit, delete, archive, reorder) SHALL apply the change optimistically to the React Query cache before the network request completes. On error, the cache SHALL be rolled back to the previous snapshot and an error toast displayed.

#### Scenario: Network error triggers rollback

- **WHEN** a `createTask` mutation fails with a network error
- **THEN** the optimistically added task is removed from the cache and a toast with the error message appears

#### Scenario: Successful mutation invalidates query

- **WHEN** any task mutation settles (success or error)
- **THEN** `queryClient.invalidateQueries(["tasks", routineId])` is called to ensure eventual consistency
