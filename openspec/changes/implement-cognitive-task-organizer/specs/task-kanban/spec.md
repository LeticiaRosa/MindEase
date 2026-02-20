## ADDED Requirements

### Requirement: Kanban board with three columns

The system SHALL display a Kanban board with exactly three columns: "To Do", "In Progress", and "Done". Each column SHALL display its tasks sorted by position. The board SHALL use a clean, spacious layout with generous whitespace between columns and cards to minimize visual stimulation.

#### Scenario: Board renders with correct columns

- **WHEN** the user navigates to the Dashboard
- **THEN** the system displays a Kanban board with three columns labeled "To Do", "In Progress", and "Done"

#### Scenario: Tasks appear in correct columns

- **WHEN** the board loads with existing tasks
- **THEN** each task appears in the column matching its status, sorted by position ascending

#### Scenario: Empty column shows placeholder

- **WHEN** a column has no tasks
- **THEN** the column displays a gentle, non-intrusive placeholder message encouraging the user to add or move tasks

### Requirement: Task card display

Each task card SHALL display the task title, current status indicator, and a visual focus indicator when the task has an active timer or checklist in progress. Cards SHALL use soft colors and clear typography at readable sizes (minimum 1rem).

#### Scenario: Task card shows essential information

- **WHEN** a task exists in any column
- **THEN** the card displays the task title and a subtle status indicator

#### Scenario: Task card shows focus indicator

- **WHEN** a task has an active timer running or a checklist step in progress
- **THEN** the card displays a gentle visual indicator (e.g., soft glow or icon) signaling it is the current focus

#### Scenario: Task card is visually accessible

- **WHEN** a task card is rendered
- **THEN** the card uses at least 1rem font size, has visible borders or subtle shadows, and meets WCAG 2.1 AA contrast requirements

### Requirement: Drag-and-drop between columns

The system SHALL support moving tasks between columns via drag-and-drop. The drag interaction SHALL provide clear visual feedback (a translucent overlay of the card). The system SHALL also support keyboard-based reordering for accessibility.

#### Scenario: Drag task to another column

- **WHEN** the user drags a task card from "To Do" to "In Progress"
- **THEN** the task moves to the "In Progress" column, its status updates to "in_progress", and the change persists to the database

#### Scenario: Keyboard-based column move

- **WHEN** the user focuses a task card and uses keyboard shortcuts to move it
- **THEN** the task moves to the target column with the same persistence behavior as drag-and-drop

#### Scenario: Drag provides visual feedback

- **WHEN** the user begins dragging a task card
- **THEN** a translucent overlay follows the cursor and the target column highlights subtly to indicate valid drop zones

#### Scenario: Reorder within column

- **WHEN** the user drags a task above or below another task in the same column
- **THEN** the task's position updates and the new order persists

### Requirement: Task creation

The system SHALL allow creating new tasks via an inline form. The form SHALL require only a title (minimum input to reduce friction). Tasks SHALL be created in the "To Do" column by default.

#### Scenario: Create task with title only

- **WHEN** the user types a title in the task creation input and submits
- **THEN** a new task appears at the bottom of the "To Do" column with the given title

#### Scenario: Task creation form is minimal

- **WHEN** the task creation form is displayed
- **THEN** it shows only a text input and a submit button, without overwhelming the user with options

#### Scenario: Validation rejects empty title

- **WHEN** the user attempts to submit a task with an empty title
- **THEN** the system shows a gentle inline validation message and does not create the task

### Requirement: Task deletion

The system SHALL allow deleting tasks with a confirmation step to prevent accidental loss. Deletion SHALL cascade to associated checklist steps.

#### Scenario: Delete task with confirmation

- **WHEN** the user clicks the delete action on a task card
- **THEN** the system shows a brief, non-modal confirmation (e.g., an undo toast) and removes the task

#### Scenario: Deletion cascades to checklist steps

- **WHEN** a task is deleted
- **THEN** all associated checklist steps are also removed from the database

### Requirement: Task data persistence

All task operations (create, update status, reorder, delete) SHALL persist to Supabase Postgres. Data SHALL be scoped to the authenticated user via Row-Level Security. The system SHALL use optimistic updates for immediate UI feedback.

#### Scenario: Tasks persist across sessions

- **WHEN** the user creates tasks and reloads the page
- **THEN** all tasks appear in their saved positions and columns

#### Scenario: Tasks are user-scoped

- **WHEN** user A creates tasks
- **THEN** user B cannot see or access user A's tasks

#### Scenario: Optimistic update on status change

- **WHEN** the user drags a task to a new column
- **THEN** the UI updates immediately, and the server sync happens in the background
