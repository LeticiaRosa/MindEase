## ADDED Requirements

### Requirement: Archived tasks screen lists all archived tasks

The `(app)/archived-tasks.tsx` route SHALL display a `FlatList` of all tasks with status `ARCHIVED`, fetched via `useArchivedTasks` hook (which calls `repository.getArchivedTasks()`).

#### Scenario: Screen shows archived tasks

- **WHEN** the user navigates to the archived-tasks screen and has 5 archived tasks
- **THEN** a list of 5 task cards is displayed, each showing title, original routine name, and archived date

#### Scenario: Empty state when no archived tasks

- **WHEN** the user has no archived tasks
- **THEN** an empty state message "Nenhuma tarefa arquivada" with an icon is displayed

---

### Requirement: Archived tasks can be restored to a specific status

Each archived task card SHALL have a "Restaurar" action that opens a status picker allowing the user to choose which status to restore the task to (TODO, IN_PROGRESS, or DONE).

#### Scenario: Restore action shows status picker

- **WHEN** the user taps "Restaurar" on an archived task
- **THEN** an action sheet or bottom sheet with three options ("A fazer", "Em andamento", "Concluído") appears

#### Scenario: Restoring moves task back to active list

- **WHEN** the user selects "Em andamento" from the status picker
- **THEN** the task disappears from the archived list (optimistic), the `restoreTask` mutation fires, and both `["archived-tasks"]` and `["tasks", routineId]` queries are invalidated

#### Scenario: Restore rollback on error

- **WHEN** the `restoreTask` mutation fails
- **THEN** the task reappears in the archived list and an error toast is displayed

---

### Requirement: Screen is accessible from user menu and dashboard

The archived-tasks screen SHALL be reachable from the user menu bottom sheet via "Tarefas Arquivadas" link. It SHALL also be accessible when `complexity` is `"complex"` from the dashboard.

#### Scenario: Navigation from user menu

- **WHEN** the user taps "Tarefas Arquivadas" in the user menu bottom sheet
- **THEN** `router.push("/(app)/archived-tasks")` is called

#### Scenario: Hidden when complexity is simple

- **WHEN** `complexity` is `"simple"`
- **THEN** no link to archived tasks is visible in the user menu or dashboard

---

### Requirement: Screen has a back navigation header

The archived-tasks screen SHALL display a header with a back arrow and title "Tarefas Arquivadas".

#### Scenario: Back button navigates to dashboard

- **WHEN** the user taps the back arrow
- **THEN** `router.back()` is called, returning to the previous screen

#### Scenario: Title displayed in header

- **WHEN** the screen renders
- **THEN** the header shows "Tarefas Arquivadas" as the page title
