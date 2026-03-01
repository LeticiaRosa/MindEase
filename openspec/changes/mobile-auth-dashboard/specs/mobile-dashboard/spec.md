## ADDED Requirements

### Requirement: Dashboard screen is only accessible to authenticated users

The `DashboardScreen` SHALL be nested under the `(app)` expo-router group whose layout enforces authentication. An unauthenticated user SHALL never see the Dashboard screen content.

#### Scenario: Protected by layout guard

- **WHEN** an unauthenticated user is redirected to `/(app)/dashboard` directly
- **THEN** they are bounced to `/(auth)/login` before any dashboard content renders

---

### Requirement: Dashboard screen has a persistent header with logo and user menu

The Dashboard screen SHALL display a fixed-position header containing the MindEase logo and a user menu that offers sign-out. The header SHALL remain visible while the user scrolls the screen content.

#### Scenario: Header visible while scrolling

- **WHEN** the user scrolls down the dashboard content area
- **THEN** the header stays pinned at the top and does not scroll away

#### Scenario: Sign-out from user menu

- **WHEN** the user opens the user menu and selects "Sair"
- **THEN** `signOut` use-case is called, the session is cleared, and the app navigates to `/(auth)/login`

---

### Requirement: Dashboard displays a task status summary

The Dashboard screen SHALL show the user's tasks grouped by status (`todo`, `doing`, `done`) as a vertically scrollable list of cards. Each status group SHALL display a label and the count of tasks in that group.

#### Scenario: Tasks grouped by status

- **WHEN** the user opens the Dashboard
- **THEN** three labelled sections are visible: "A fazer", "Em andamento", and "Concluído", each showing the tasks that belong to it

#### Scenario: Empty state per group

- **WHEN** a status group has no tasks
- **THEN** the group is still shown with its label and a soft empty-state message (e.g., "Nenhuma tarefa aqui ainda")

#### Scenario: Task card content

- **WHEN** a task card is rendered
- **THEN** it shows the task title and, if present, the number of checklist steps completed out of total

---

### Requirement: Dashboard displays the active routine strip

If the user has an active routine, the Dashboard SHALL display a horizontally scrollable routine strip below the header showing each step of the active routine. The current step SHALL be visually highlighted.

#### Scenario: Active routine present

- **WHEN** the user has an active routine configured
- **THEN** a horizontal strip labelled with the routine name is shown, listing steps in order with the current step highlighted

#### Scenario: No active routine

- **WHEN** the user has no active routine
- **THEN** the routine strip is not shown and the task summary consumes the full screen height

---

### Requirement: Dashboard includes a cognitive alert banner

The Dashboard SHALL render a non-blocking, dismissible cognitive alert banner when the alert engine determines an alert is due, identical in behaviour to the web `CognitiveAlertBanner` but rendered using React Native primitives.

#### Scenario: Alert banner appears when due

- **WHEN** the alert engine emits an alert
- **THEN** a banner appears at the top of the content area with the alert message and a dismiss button

#### Scenario: Dismissing the banner

- **WHEN** the user taps the dismiss button on the banner
- **THEN** the banner disappears without navigating away or blocking the UI

#### Scenario: No alert active

- **WHEN** no alert is due
- **THEN** no banner is visible and the layout is unaffected

---

### Requirement: Dashboard shows a Brain Today check-in modal on first daily visit

The Dashboard SHALL display a "Cérebro Hoje" bottom-sheet modal the first time the user opens the Dashboard each day, mirroring the web `BrainTodayModal` behaviour but adapted for mobile.

#### Scenario: First visit of the day

- **WHEN** the user opens the Dashboard and has not answered the check-in yet today (no value in AsyncStorage for `mindease:brain-state`)
- **THEN** the "Cérebro Hoje" bottom-sheet is shown before the full content is interactive

#### Scenario: Already answered today

- **WHEN** the user dismisses the check-in and navigates away and back within the same day
- **THEN** the modal is not shown again

---

### Requirement: Dashboard layout meets cognitive accessibility standards

The Dashboard screen SHALL use generous vertical spacing between sections, a limited colour palette drawn from `@repo/ui/theme`, no auto-playing animations, and clearly labelled, high-contrast interactive elements.

#### Scenario: No autoplay animations

- **WHEN** the Dashboard first renders
- **THEN** no animations start without user interaction (no looping spinners, no sliding cards, no pulsing indicators)

#### Scenario: Readable task cards

- **WHEN** a task card is rendered
- **THEN** the title uses at least `fontSizes.base` and the card has at minimum `spacing.md` padding on all sides

#### Scenario: Focus indicator on interactive elements

- **WHEN** the user navigates to an interactive element using a keyboard or assistive technology
- **THEN** a high-contrast focus ring is visible around that element
