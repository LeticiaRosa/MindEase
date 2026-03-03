## ADDED Requirements

### Requirement: Routine management screen provides full CRUD

The `(app)/manage-routines.tsx` screen SHALL allow the user to create, rename, delete, and reorder routines. It SHALL be accessible via the user menu and dashboard header navigation.

#### Scenario: Screen lists all routines

- **WHEN** the manage-routines screen mounts
- **THEN** all user routines are displayed in a `FlatList` ordered by `position`, each showing the routine name and icon

#### Scenario: Create new routine

- **WHEN** the user taps "Novo Kanban" button
- **THEN** an inline text input appears at the bottom for entering the routine name; submitting creates the routine optimistically

#### Scenario: Rename routine inline

- **WHEN** the user taps on a routine name
- **THEN** the text becomes an editable `TextInput`; on blur or return, the `updateRoutine` mutation fires with the new name

#### Scenario: Delete routine with confirmation

- **WHEN** the user swipes a routine to the left and taps "Excluir"
- **THEN** a confirmation alert appears; on confirm, the routine is deleted optimistically and if it was the active routine, the next available routine becomes active

---

### Requirement: Routines can be reordered via drag

The routine list SHALL support drag-to-reorder using `react-native-draggable-flatlist`. Position changes SHALL be persisted via `reorderRoutines` mutation.

#### Scenario: Drag to reorder

- **WHEN** the user long-presses a routine item and drags it to a new position
- **THEN** the list reorders immediately (optimistic) and `reorderRoutines` mutation fires with the new position map

#### Scenario: Reorder rollback on error

- **WHEN** the `reorderRoutines` mutation fails
- **THEN** the list reverts to the previous order and an error toast is displayed

---

### Requirement: Each routine has a selectable icon

Routines SHALL support an icon field chosen from a fixed set of Lucide-compatible icons. The icon picker SHALL be presented in a bottom sheet with a grid layout.

#### Scenario: Icon picker opens from routine item

- **WHEN** the user taps the icon area of a routine item
- **THEN** a bottom sheet opens displaying a grid of available icons (same 12 icons as web-host's `RoutineIcon` registry)

#### Scenario: Selecting icon updates routine

- **WHEN** the user taps an icon in the picker grid
- **THEN** the routine's icon updates optimistically, the picker closes, and `updateRoutine` mutation fires

---

### Requirement: Active routine selection is persisted per user

The `ActiveRoutineContext` SHALL store the `activeRoutineId` in `AsyncStorage` under key `mindease:activeRoutine:<userId>`. Changing the active routine on the dashboard SHALL update this persisted value.

#### Scenario: Active routine persists across app restarts

- **WHEN** the user selects routine "Estudo" as active and restarts the app
- **THEN** the dashboard loads with "Estudo" as the active routine

#### Scenario: Invalid stored ID falls back to first routine

- **WHEN** the persisted `activeRoutineId` no longer exists (deleted)
- **THEN** the first available routine is automatically selected as active

#### Scenario: No routines triggers default seeding

- **WHEN** the user has zero routines
- **THEN** two default routines ("Estudo" and "Trabalho") are created automatically via the `useRoutines` hook's seeding logic

---

### Requirement: Routine selector on dashboard allows quick switching

The dashboard SHALL include a routine selector (dropdown or horizontal pill tabs) above the task groups that allows switching between routines.

#### Scenario: Selector shows all routine names

- **WHEN** the dashboard renders with 3 routines
- **THEN** the routine selector displays all 3 routine names with the active one highlighted

#### Scenario: Selecting a routine switches task context

- **WHEN** the user taps a different routine in the selector
- **THEN** `activeRoutineId` updates, tasks refetch for the new routine, and the selection is persisted to `AsyncStorage`
