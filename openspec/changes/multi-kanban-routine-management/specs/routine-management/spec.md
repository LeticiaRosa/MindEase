## ADDED Requirements

### Requirement: Routine is represented by a typed domain entity

The system SHALL define a `Routine` interface with fields `id` (uuid string), `userId` (string), `name` (string), `icon` (string — Lucide icon name), `position` (number), `createdAt` (string), and `updatedAt` (string).

#### Scenario: Entity shape

- **WHEN** a `Routine` value is constructed
- **THEN** it contains all required fields with correct types and no optional fields

---

### Requirement: Routines are persisted in a Supabase `routines` table with RLS

The system SHALL store routines in a `routines` table with columns `id uuid PK`, `user_id uuid FK → auth.users`, `name text NOT NULL`, `icon text NOT NULL DEFAULT 'notebook-pen'`, `position integer NOT NULL DEFAULT 0`, `created_at timestamptz`, `updated_at timestamptz`. Row-Level Security SHALL enforce `auth.uid() = user_id` on all operations. A unique constraint on `(user_id, name)` SHALL prevent duplicate routine names per user.

#### Scenario: Select returns only the authenticated user's routines

- **WHEN** `getRoutines()` is called for user A
- **THEN** only routines where `user_id = A` are returned, ordered by `position` ascending

#### Scenario: Insert with RLS

- **WHEN** a routine is inserted without an explicit `user_id`
- **THEN** `auth.uid()` is used as the default, and the row is accessible to that user only

#### Scenario: Unique constraint prevents duplicates

- **WHEN** user A creates a routine named "Estudo" and then tries to create another named "Estudo"
- **THEN** the second insert fails with a unique violation error

---

### Requirement: IRoutineRepository defines CRUD operations

The system SHALL define an `IRoutineRepository` interface with methods: `getRoutines(): Promise<Routine[]>`, `createRoutine(name: string, icon?: string): Promise<Routine>`, `updateRoutine(id: string, updates: Partial<Pick<Routine, 'name' | 'icon'>>): Promise<Routine>`, `deleteRoutine(id: string): Promise<void>`, and `reorderRoutines(updates: Array<{ id: string; position: number }>): Promise<void>`.

#### Scenario: getRoutines returns ordered list

- **WHEN** `getRoutines()` is called
- **THEN** all user routines are returned sorted by `position` ascending

#### Scenario: createRoutine with default icon

- **WHEN** `createRoutine("Leitura")` is called without an icon
- **THEN** a routine is created with `icon = 'notebook-pen'` and the next available position

#### Scenario: createRoutine with custom icon

- **WHEN** `createRoutine("Fitness", "dumbbell")` is called
- **THEN** a routine is created with `icon = 'dumbbell'`

#### Scenario: updateRoutine changes name

- **WHEN** `updateRoutine(id, { name: "Estudos Avançados" })` is called
- **THEN** the routine's name is updated and `updated_at` is refreshed

#### Scenario: deleteRoutine removes the routine and its tasks

- **WHEN** `deleteRoutine(id)` is called
- **THEN** the routine row is removed, and all tasks with that `routine_id` are cascade-deleted

#### Scenario: reorderRoutines updates positions

- **WHEN** `reorderRoutines([{ id: "a", position: 1 }, { id: "b", position: 0 }])` is called
- **THEN** each routine's `position` is updated to the specified value

---

### Requirement: SupabaseRoutineRepository implements IRoutineRepository

The system SHALL provide a `SupabaseRoutineRepository` class that implements `IRoutineRepository` using the Supabase JS client. All queries SHALL target the `routines` table. Row mapping SHALL convert `snake_case` DB columns to `camelCase` entity fields.

#### Scenario: Mapping from database row to Routine entity

- **WHEN** a row with `user_id`, `created_at`, `updated_at` is returned from Supabase
- **THEN** the mapper returns a `Routine` with `userId`, `createdAt`, `updatedAt`

---

### Requirement: Application use cases wrap routine repository operations

The system SHALL provide `CreateRoutine`, `UpdateRoutine`, and `DeleteRoutine` use case classes. `CreateRoutine` SHALL validate that the name is non-empty and trimmed (max 40 characters). `DeleteRoutine` SHALL succeed silently when the routine does not exist.

#### Scenario: CreateRoutine with valid name

- **WHEN** `CreateRoutine.execute("Estudo")` is called
- **THEN** it delegates to `repository.createRoutine("Estudo")` and returns the created routine

#### Scenario: CreateRoutine with empty name

- **WHEN** `CreateRoutine.execute("")` is called
- **THEN** it throws a validation error without calling the repository

#### Scenario: CreateRoutine with name exceeding 40 characters

- **WHEN** `CreateRoutine.execute("A".repeat(41))` is called
- **THEN** it throws a validation error

#### Scenario: DeleteRoutine for existing routine

- **WHEN** `DeleteRoutine.execute(id)` is called for an existing routine
- **THEN** the routine and its tasks are removed

---

### Requirement: Default routines are seeded on first access

The system SHALL seed two default routines ("Estudo" with icon `notebook-pen`, "Trabalho" with icon `briefcase-business`) when a user has zero routines. Seeding SHALL occur client-side via the `useRoutines` hook after the initial `getRoutines()` returns an empty array.

#### Scenario: First-time user gets default routines

- **WHEN** a new user loads the dashboard and `getRoutines()` returns `[]`
- **THEN** two routines are inserted ("Estudo" at position 0, "Trabalho" at position 1) and the query is refetched

#### Scenario: Existing user with routines does not re-seed

- **WHEN** a user who already has routines loads the dashboard
- **THEN** no seed insert occurs

#### Scenario: Concurrent tab seeding race condition

- **WHEN** two tabs try to seed simultaneously
- **THEN** the unique constraint `(user_id, name)` prevents duplicates; the second insert fails silently and the refetch returns the correct data

---

### Requirement: Routine management page at /settings/routines

The system SHALL render a settings page at `/settings/routines` accessible from a protected route. The page SHALL display the user's routines in a list ordered by `position`, with each item showing the routine's icon, name, and action buttons (edit, delete, move up, move down).

#### Scenario: Page renders routine list

- **WHEN** the user navigates to `/settings/routines`
- **THEN** all their routines are displayed in position order with name, icon, and action buttons

#### Scenario: Empty state

- **WHEN** the user has no routines (should not happen after seeding, but defensively)
- **THEN** a message is shown: "Nenhum Kanban encontrado"

---

### Requirement: User can create a new routine from the management page

The management page SHALL include a creation form at the top with a text input for the routine name and an icon picker (curated palette of ~12 Lucide icons). The form SHALL use `react-hook-form` with a `zod` schema requiring a non-empty name (max 40 characters). On successful creation, a toast SHALL confirm: "Kanban criado com sucesso".

#### Scenario: Successful routine creation

- **WHEN** the user enters "Leitura", selects an icon, and submits
- **THEN** a new routine is created, the list updates, and a success toast appears

#### Scenario: Validation error for empty name

- **WHEN** the user submits with an empty name field
- **THEN** an inline validation error is displayed: "Nome é obrigatório"

#### Scenario: Validation error for long name

- **WHEN** the user enters a name with more than 40 characters
- **THEN** an inline validation error is displayed: "Máximo de 40 caracteres"

---

### Requirement: User can rename a routine

The management page SHALL allow inline editing of a routine's name. Clicking the edit button SHALL replace the name text with an input field pre-filled with the current name. Submitting SHALL call `UpdateRoutine` and show a toast: "Kanban atualizado".

#### Scenario: Rename a routine

- **WHEN** the user clicks edit on "Estudo", changes the name to "Estudos", and confirms
- **THEN** the routine name is updated and a success toast appears

#### Scenario: Cancel rename

- **WHEN** the user clicks edit and then presses Escape
- **THEN** the original name is restored and no update occurs

---

### Requirement: User can delete a routine

The management page SHALL allow deleting a routine via a delete button. Before deletion, the system SHALL show a gentle confirmation message indicating that all tasks in the routine will be removed. On confirmation, `DeleteRoutine` is called and a toast appears: "Kanban removido".

#### Scenario: Delete routine with confirmation

- **WHEN** the user clicks delete on "Trabalho" and confirms
- **THEN** the routine and its tasks are removed, the list updates, and a toast appears

#### Scenario: Cancel deletion

- **WHEN** the user clicks delete and then cancels the confirmation
- **THEN** no deletion occurs

#### Scenario: Prevent deleting last routine

- **WHEN** the user has only one routine and tries to delete it
- **THEN** the delete button is disabled or a toast warns: "Você precisa ter pelo menos um Kanban"

---

### Requirement: User can reorder routines

The management page SHALL provide move-up and move-down buttons on each routine item. Moving a routine SHALL swap its position with the adjacent routine and call `reorderRoutines`.

#### Scenario: Move routine up

- **WHEN** the user clicks move-up on the routine at position 1
- **THEN** it swaps position with the routine at position 0 and the list re-renders in the new order

#### Scenario: First routine has no move-up button

- **WHEN** the routine is at position 0
- **THEN** the move-up button is disabled or hidden

#### Scenario: Last routine has no move-down button

- **WHEN** the routine is at the last position
- **THEN** the move-down button is disabled or hidden

---

### Requirement: Routine management is accessible from the user menu

The `UserMenuDropdown` SHALL contain a menu item labelled "Gerenciar Kanbans" with a `Kanban` or `LayoutGrid` icon that navigates to `/settings/routines`.

#### Scenario: Menu item present

- **WHEN** the `UserMenuDropdown` is rendered for an authenticated user
- **THEN** an item with accessible name "Gerenciar Kanbans" is present in the menu

#### Scenario: Navigation on click

- **WHEN** the user activates the "Gerenciar Kanbans" menu item
- **THEN** the router navigates to `/settings/routines`

---

### Requirement: Curated icon picker for routines

The routine creation and edit forms SHALL offer an icon picker with a curated palette of approximately 12 Lucide icons: `notebook-pen`, `briefcase-business`, `graduation-cap`, `book-open`, `code`, `dumbbell`, `music`, `palette`, `heart-pulse`, `home`, `coffee`, `lightbulb`. The picker SHALL display icons in a grid with labels on hover/focus.

#### Scenario: Icon picker renders all options

- **WHEN** the icon picker is displayed
- **THEN** all curated icons are shown as selectable buttons with visible focus indicators

#### Scenario: Default icon pre-selected

- **WHEN** the creation form mounts
- **THEN** `notebook-pen` is pre-selected as the default icon

#### Scenario: Selected icon is visually highlighted

- **WHEN** the user selects an icon
- **THEN** the selected icon has a distinct visual state (e.g., primary-coloured border)
