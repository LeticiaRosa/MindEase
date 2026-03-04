## ADDED Requirements

### Requirement: Checklist highlights current step

The system SHALL display the first incomplete step as the "current step" with a highlighted border and larger text. The current step SHALL have a circular unchecked indicator and the step title. Tapping the step SHALL mark it as complete (toggle to `completed: true`).

#### Scenario: Current step is shown prominently

- **WHEN** the checklist has at least one incomplete step
- **THEN** the first incomplete step is rendered with a highlighted card style (border, larger font, accent border color)

#### Scenario: User completes the current step

- **WHEN** the user taps the current step's checkbox
- **THEN** the step is marked as completed, the next incomplete step becomes the current step, and LayoutAnimation animates the transition

### Requirement: Checklist shows progress bar

The system SHALL display a progress bar at the top of the checklist showing `completedCount / totalSteps` with a numerical label. The bar SHALL use the theme's primary color when all steps are complete, and the ring/accent color otherwise.

#### Scenario: Progress bar reflects completion

- **WHEN** 3 of 5 steps are completed
- **THEN** the progress bar fills to 60% and the label shows "3/5"

#### Scenario: All steps complete

- **WHEN** all steps are completed
- **THEN** the progress bar fills to 100% with the primary color and a "✓ Todas as etapas concluídas!" message is displayed

### Requirement: Completed steps section is collapsible

The system SHALL group completed steps into a collapsible section. A toggle button SHALL show the count (e.g., "3 concluídas"). In `summary` mode the section SHALL default to collapsed; in `detail` mode it SHALL default to expanded. Each completed step SHALL display with a checked indicator, strikethrough text, and reduced opacity.

#### Scenario: User expands completed steps in summary mode

- **WHEN** the user taps "N concluída(s)" in summary mode
- **THEN** the completed steps section expands with LayoutAnimation and each completed step is visible

#### Scenario: Completed steps default expanded in detail mode

- **WHEN** the theme mode is `detail`
- **THEN** the completed steps section is expanded by default

### Requirement: Upcoming steps section is collapsible

The system SHALL group incomplete steps after the current step into a collapsible "upcoming/pending" section. A toggle button SHALL show the count (e.g., "+2 etapas restantes"). In `summary` mode the section SHALL default to collapsed; in `detail` mode it SHALL default to expanded. Each upcoming step SHALL display with an unchecked indicator and muted text. Tapping an upcoming step SHALL mark it as complete.

#### Scenario: User expands upcoming steps

- **WHEN** the user taps "+N etapa(s) restante(s)"
- **THEN** the upcoming steps section expands showing all remaining incomplete steps (excluding the current step)

#### Scenario: User completes an upcoming step

- **WHEN** the user taps an upcoming step's checkbox
- **THEN** that step is marked as completed and the list re-sorts

### Requirement: Inline step editing

The system SHALL provide an edit action (pencil icon) on each step (current, completed, and upcoming). Tapping edit SHALL swap the step's title `Text` for a `TextInput` pre-filled with the current title. Pressing "Submit" on the keyboard or tapping a save button SHALL call `updateStep`. Tapping a cancel button SHALL revert the swap without saving. Only one step SHALL be in edit mode at a time.

#### Scenario: User edits a step title

- **WHEN** the user taps the edit icon on a step
- **THEN** the step title is replaced by a TextInput with the current title, plus save and cancel action buttons

#### Scenario: User saves an edited step

- **WHEN** the user presses "Submit" on the keyboard or the save button
- **THEN** `updateStep` is called with the new title and the TextInput reverts to static text

#### Scenario: User cancels editing

- **WHEN** the user taps the cancel button while editing
- **THEN** the TextInput is discarded without saving and the original title is restored

### Requirement: Step deletion with confirmation area

The system SHALL provide a delete action (✕ icon) on each step. Tapping delete SHALL immediately remove the step via `deleteStep` with optimistic UI update. The delete button SHALL have a minimum touch target of 44×44 points with `hitSlop`.

#### Scenario: User deletes a step

- **WHEN** the user taps the delete icon on a step
- **THEN** the step is immediately removed from the list optimistically and the deletion is persisted to Supabase

### Requirement: AddStepForm uses expandable pattern

The `AddStepForm` component SHALL default to a collapsed "+ Adicionar etapa" button. Tapping it SHALL expand to reveal a `TextInput` and "Adicionar" + "Cancelar" buttons. Submitting a non-empty title SHALL call `createStep` and collapse the form. Pressing "Cancelar" SHALL collapse without creating. Pressing "Submit" on the keyboard SHALL behave identically to the "Adicionar" button.

#### Scenario: User opens add step form

- **WHEN** the user taps "+ Adicionar etapa"
- **THEN** a TextInput with placeholder "Descrição da etapa…" appears, plus "Adicionar" and "Cancelar" buttons

#### Scenario: User adds a new step

- **WHEN** the user types a title and presses "Adicionar" or keyboard submit
- **THEN** the step is created optimistically, the form clears, and collapses back to the "+ Adicionar etapa" button

#### Scenario: User cancels add step

- **WHEN** the user presses "Cancelar"
- **THEN** the form collapses to the "+ Adicionar etapa" button without creating a step

### Requirement: Empty checklist shows prompt and add form

When a task has zero steps, the system SHALL display a prompt text ("Divida esta tarefa em etapas menores.") and the `AddStepForm` component.

#### Scenario: Task with no steps

- **WHEN** the checklist loads for a task with zero steps
- **THEN** the prompt text and AddStepForm are displayed (no progress bar, no current step)

### Requirement: Checklist respects theme preferences

The system SHALL use `ThemePreferencesContext` for all colors, font sizes, spacing, and border radii. The `mode` preference (`summary` | `detail`) SHALL control default section visibility.

#### Scenario: Theme styling applied

- **WHEN** the user has custom theme settings
- **THEN** all checklist elements render with the resolved theme values

### Requirement: Checklist accessible to screen readers

All interactive elements (checkboxes, edit buttons, delete buttons, toggle buttons) SHALL have appropriate `accessibilityRole` and `accessibilityLabel` properties. Step checkboxes SHALL use `accessibilityRole="checkbox"` with `accessibilityState={{ checked }}`.

#### Scenario: Screen reader announces step state

- **WHEN** a screen reader focuses on a step checkbox
- **THEN** it announces the step title and its checked/unchecked state
