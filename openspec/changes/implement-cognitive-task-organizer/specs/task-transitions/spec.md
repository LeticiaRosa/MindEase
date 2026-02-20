## ADDED Requirements

### Requirement: Smooth state transitions

All visual state changes (step completion, task column moves, timer state changes) SHALL use CSS transitions with a duration of 200–400ms and an ease-in-out timing function. No transition SHALL use spring physics, bounce effects, or durations exceeding 500ms.

#### Scenario: Task moves between columns smoothly

- **WHEN** a task is dropped into a new column
- **THEN** the task card animates into its new position with a smooth transition (200–400ms, ease-in-out)

#### Scenario: Step completion transition

- **WHEN** a checklist step is marked as completed
- **THEN** the step fades to a dimmed state and the next step fades into prominence over ~300ms

#### Scenario: No jarring animations

- **WHEN** any UI state change occurs
- **THEN** no animation uses bounce, spring, shake, or flash effects

### Requirement: Non-intrusive completion feedback

Task and step completions SHALL provide feedback via gentle toasts (using `sonner`). Toasts SHALL appear at the bottom-right, last 3 seconds, and SHALL NOT block user interaction. No modals or pop-ups SHALL be used for feedback.

#### Scenario: Task completion toast

- **WHEN** a task is moved to the "Done" column
- **THEN** a gentle toast appears at the bottom-right saying "Task completed" and auto-dismisses after 3 seconds

#### Scenario: Checklist completion toast

- **WHEN** all checklist steps within a task are completed
- **THEN** a toast appears saying "All steps complete!" without blocking the UI

#### Scenario: Toast does not block interaction

- **WHEN** a toast is visible
- **THEN** the user can continue interacting with the board, timer, and checklist without obstruction

### Requirement: Predictable navigation and focus management

The organizer SHALL maintain a logical tab order: columns left-to-right, tasks top-to-bottom within each column, then interactive elements within each card. Focus indicators SHALL be visible and high-contrast on every interactive element.

#### Scenario: Logical tab order

- **WHEN** the user navigates the board using the Tab key
- **THEN** focus moves through columns left-to-right, within each column top-to-bottom through task cards, and within each card through interactive elements (checklist checkbox, timer controls, actions)

#### Scenario: Visible focus indicators

- **WHEN** any interactive element receives keyboard focus
- **THEN** a visible, high-contrast focus ring appears (minimum 2px outline, contrast ratio ≥ 3:1 against background)

#### Scenario: Focus is preserved after state changes

- **WHEN** the user completes a checklist step via keyboard
- **THEN** focus moves to the next logical element (next step's checkbox) rather than being lost or jumping to the page top

### Requirement: Consistent layout and visual hierarchy

The organizer layout SHALL remain consistent across interactions — columns do not resize or jump when tasks are added, moved, or removed. Visual hierarchy SHALL use size and weight (not color alone) to distinguish headings, task titles, and secondary text.

#### Scenario: Columns maintain stable width

- **WHEN** tasks are added to or removed from a column
- **THEN** the column width remains constant and other columns do not shift

#### Scenario: Visual hierarchy uses size and weight

- **WHEN** the board is rendered
- **THEN** column headings use larger/bolder text, task titles use medium weight, and secondary info (timestamps, counts) uses smaller/lighter text — without relying solely on color differences
