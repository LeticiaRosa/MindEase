## ADDED Requirements

### Requirement: Decomposable checklist within tasks

Each task SHALL support a checklist of sub-steps. Users SHALL be able to add, complete, and remove steps. Steps SHALL be persisted to Supabase and scoped to their parent task.

#### Scenario: Add a checklist step

- **WHEN** the user types a step title in the checklist input and submits
- **THEN** a new step appears at the bottom of the checklist in an uncompleted state

#### Scenario: Steps persist with the task

- **WHEN** the user adds checklist steps and reloads the page
- **THEN** all steps appear in their saved order and completion state

#### Scenario: Remove a checklist step

- **WHEN** the user clicks the remove action on a step
- **THEN** the step is removed from the checklist and deleted from the database

### Requirement: Progressive disclosure of steps

The checklist SHALL display steps using progressive disclosure: only the first incomplete step is prominently visible with full detail and focus. Completed steps appear above as dimmed checkmarks. Remaining incomplete steps are collapsed, showing only a count (e.g., "3 more steps").

#### Scenario: First incomplete step is prominent

- **WHEN** the checklist has 5 steps with step 1 completed
- **THEN** step 1 shows as a dimmed checkmark, step 2 is displayed prominently with full title, and the remaining 3 steps show as "3 more steps"

#### Scenario: All steps completed

- **WHEN** the user completes the last step in the checklist
- **THEN** all steps show as dimmed checkmarks and a gentle completion message appears (e.g., "All steps complete!")

#### Scenario: Empty checklist

- **WHEN** a task has no checklist steps
- **THEN** the checklist area shows a minimal prompt to add the first step

### Requirement: Automatic focus on next step

When a step is completed, the system SHALL automatically focus the next incomplete step. The transition SHALL use a smooth animation (fade-in over ~300ms) to avoid cognitive disruption.

#### Scenario: Complete step and auto-focus next

- **WHEN** the user marks the current prominent step as completed
- **THEN** the completed step transitions to a dimmed checkmark and the next incomplete step smoothly animates into the prominent position with automatic focus

#### Scenario: Keyboard accessibility for step completion

- **WHEN** the user presses Enter or Space on the focused step's checkbox
- **THEN** the step completes and focus moves to the next step's checkbox automatically

#### Scenario: Transition is gentle

- **WHEN** a step transition occurs
- **THEN** the animation duration is approximately 300ms with an ease-in-out curve, without any sudden jumps or flashes

### Requirement: Checklist progress indicator

The checklist SHALL display a simple progress indicator showing how many steps are completed out of the total. This provides context without exposing all steps at once.

#### Scenario: Progress indicator updates

- **WHEN** the user completes a step (e.g., 2 of 5 done)
- **THEN** the progress indicator updates to show "2 / 5" or an equivalent visual (e.g., a thin progress bar)

#### Scenario: Progress indicator is non-intrusive

- **WHEN** the progress indicator is displayed
- **THEN** it uses subtle styling (small text or thin bar) that informs without demanding attention
