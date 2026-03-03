## ADDED Requirements

### Requirement: Each task card displays a checklist summary

The `TaskCard` component SHALL display a checklist progress indicator showing completed steps vs total steps. When the task has no checklist steps, no indicator SHALL be shown.

#### Scenario: Task with checklist shows count

- **WHEN** a task has 3 checklist steps, 1 completed
- **THEN** the task card displays "1/3 etapas" with a subtle progress bar

#### Scenario: Task without checklist hides indicator

- **WHEN** a task has zero checklist steps
- **THEN** no checklist indicator is rendered on the card

---

### Requirement: Checklist is expandable within the task card

Tapping the checklist summary on a `TaskCard` SHALL expand an inline `SmartChecklist` component below the card, revealing all checklist steps with toggle, add, edit, and delete capabilities.

#### Scenario: Tap expands checklist

- **WHEN** the user taps the checklist summary area on a task card
- **THEN** the `SmartChecklist` component expands below the card with all steps visible

#### Scenario: Tap again collapses checklist

- **WHEN** the user taps the checklist summary area while expanded
- **THEN** the checklist collapses back to summary-only view

---

### Requirement: Checklist steps can be toggled

Each checklist step SHALL have a checkbox that toggles its `completed` state via `toggleChecklistStep` mutation with an optimistic update.

#### Scenario: Toggling incomplete step marks it complete

- **WHEN** the user taps the checkbox of an incomplete step
- **THEN** the step is optimistically marked as completed (checkbox filled, text strikethrough) and the `toggleChecklistStep` mutation fires

#### Scenario: Toggling complete step marks it incomplete

- **WHEN** the user taps the checkbox of a completed step
- **THEN** the step is optimistically marked as incomplete

---

### Requirement: New checklist steps can be added inline

The `SmartChecklist` SHALL include an `AddStepForm` at the bottom that allows adding a new step with a title.

#### Scenario: Add step form renders at bottom

- **WHEN** the checklist is expanded
- **THEN** an inline text input with "Adicionar etapa..." placeholder appears below the last step

#### Scenario: Submitting adds step optimistically

- **WHEN** the user types a step title and submits
- **THEN** the step appears immediately at the end of the list (optimistic), the input clears, and `addChecklistStep` mutation fires

---

### Requirement: Checklist steps can be edited and deleted

Each step SHALL support inline editing (tap to edit) and swipe-to-delete.

#### Scenario: Tap on step title enters edit mode

- **WHEN** the user taps on a step title text
- **THEN** the text is replaced with a focused `TextInput` containing the current title

#### Scenario: Saving edit updates step optimistically

- **WHEN** the user changes the title and submits (blur or return key)
- **THEN** the step title updates optimistically and `updateChecklistStep` mutation fires

#### Scenario: Swipe left deletes step

- **WHEN** the user swipes a step to the left
- **THEN** a red "Excluir" action is revealed; tapping it deletes the step optimistically

---

### Requirement: Progressive disclosure highlights the current step

In summary mode, the checklist SHALL highlight the first incomplete step as the "current step" to guide the user's focus.

#### Scenario: Current step is highlighted

- **WHEN** steps 1 and 2 are complete and step 3 is incomplete
- **THEN** step 3 is visually highlighted with a primary-colour left border or background tint

#### Scenario: All steps complete shows success

- **WHEN** all checklist steps are completed
- **THEN** the summary displays a checkmark icon with "Todas as etapas concluídas"

---

### Requirement: Smart checklist respects mode preference

When `ThemePreferencesContext.mode` is set to `"resume"`, the checklist SHALL show only the summary (current step + count). When set to `"detail"`, it SHALL auto-expand to show all steps.

#### Scenario: Resume mode shows summary only

- **WHEN** mode is `"resume"` and the user has not manually expanded the checklist
- **THEN** only the summary line (e.g., "Etapa 3 de 5: Write tests") is visible

#### Scenario: Detail mode auto-expands

- **WHEN** mode is `"detail"`
- **THEN** the checklist renders fully expanded with all steps visible by default
