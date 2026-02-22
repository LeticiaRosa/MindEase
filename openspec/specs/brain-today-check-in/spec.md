## ADDED Requirements

### Requirement: Session check-in modal is shown once per browser session

Once a user is authenticated and navigates to a protected route, the system SHALL display the "Cérebro Hoje" modal before rendering dashboard content, unless the user has already answered it in the current browser session.

#### Scenario: First visit this session

- **WHEN** an authenticated user loads a protected page for the first time in a browser session with no `sessionStorage` entry for `mindease:brain-state`
- **THEN** the `BrainTodayModal` is rendered as an overlay before any dashboard content

#### Scenario: Already answered this session

- **WHEN** the user navigates away and returns to the dashboard within the same browser session
- **THEN** the `BrainTodayModal` is NOT shown again

#### Scenario: New session after page close

- **WHEN** the user closes the browser and reopens the app
- **THEN** `sessionStorage` is cleared and the modal appears again on the first protected-route visit

---

### Requirement: Modal presents exactly five cognitive-state options

The modal SHALL display five selectable options representing the user's current cognitive state, each identified by a distinct colour-coded label and accessible name.

#### Scenario: All five options visible

- **WHEN** the `BrainTodayModal` is open
- **THEN** the user sees exactly five options: Focado (green), Cansado (yellow), Sobrecarregado (red), Ansioso (blue), Disperso (purple)

#### Scenario: Keyboard navigation between options

- **WHEN** the modal is open and the user presses Tab or arrow keys
- **THEN** focus moves sequentially through the five options and the "Pular por hoje" action in a predictable order

---

### Requirement: Selecting a state persists it to session storage and context

After the user chooses a cognitive state, the system SHALL store the selection in `sessionStorage` under key `mindease:brain-state` and expose it via `BrainTodayContext`.

#### Scenario: Successful selection

- **WHEN** the user clicks or activates one of the five state options
- **THEN** the selected `BrainStateValue` is written to `sessionStorage` and the modal closes, revealing the dashboard

#### Scenario: Context value available downstream

- **WHEN** a child component reads `useBrainToday()` after selection
- **THEN** it receives the chosen `BrainStateValue` (not `null`)

---

### Requirement: Modal is skippable without blocking the user

The modal SHALL include a clearly visible "Pular por hoje" (Skip for today) secondary action that dismisses it without recording a brain state.

#### Scenario: Skipping the modal

- **WHEN** the user activates "Pular por hoje"
- **THEN** the modal closes, no brain state is stored, and the dashboard renders normally

#### Scenario: Engine defaults when state is null

- **WHEN** `useBrainToday()` returns `null` (because user skipped)
- **THEN** the alert engine treats the session as `focado` for message selection purposes

---

### Requirement: Modal design meets cognitive accessibility standards

The modal SHALL use low visual stimulation: no animations beyond a gentle fade-in, generous whitespace, large readable labels, and a distinct high-contrast focus ring on every interactive element.

#### Scenario: No distracting entrance animation

- **WHEN** the modal opens
- **THEN** it fades in over no more than 150 ms with no bounce, shake, or scale transforms

#### Scenario: Focus is trapped inside the modal

- **WHEN** the modal is open
- **THEN** Tab cycling keeps focus inside the modal and does not reach background content
