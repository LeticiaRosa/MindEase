## MODIFIED Requirements

### Requirement: Session check-in modal is shown once per browser session

Once a user is authenticated and navigates to a protected route, the system SHALL display the "Cérebro Hoje" check-in before rendering dashboard content, unless the user has already answered it in the current session. On **web**, this uses `sessionStorage` (per browser session). On **mobile**, this uses `AsyncStorage` with a day-scoped key `mindease:brain-today:<YYYY-MM-DD>` (once per calendar day, since mobile apps don't have browser sessions).

#### Scenario: First visit this session (web)

- **WHEN** an authenticated user loads a protected page for the first time in a browser session with no `sessionStorage` entry for `mindease:brain-state`
- **THEN** the `BrainTodayModal` is rendered as an overlay before any dashboard content

#### Scenario: First open today (mobile)

- **WHEN** an authenticated user opens a protected screen and no `AsyncStorage` entry exists for `mindease:brain-today:<today's date>`
- **THEN** the `BrainTodayBottomSheet` is presented as a modal overlay before dashboard content is interactive

#### Scenario: Already answered this session (web)

- **WHEN** the user navigates away and returns to the dashboard within the same browser session
- **THEN** the `BrainTodayModal` is NOT shown again

#### Scenario: Already answered today (mobile)

- **WHEN** the user closes and reopens the app on the same calendar day after answering
- **THEN** the `BrainTodayBottomSheet` is NOT shown again

#### Scenario: New session after page close (web)

- **WHEN** the user closes the browser and reopens the app
- **THEN** `sessionStorage` is cleared and the modal appears again on the first protected-route visit

#### Scenario: New day resets check-in (mobile)

- **WHEN** the user opens the app on a new calendar day
- **THEN** no matching day-key exists in `AsyncStorage` and the bottom sheet appears again

---

### Requirement: Selecting a state persists it to session storage and context

After the user chooses a cognitive state, the system SHALL store the selection in the platform-appropriate storage and expose it via `BrainTodayContext`. On **web**, this is `sessionStorage` under key `mindease:brain-state`. On **mobile**, this is `AsyncStorage` under `mindease:brain-today:<YYYY-MM-DD>` with the selected state value.

#### Scenario: Successful selection (web)

- **WHEN** the user clicks or activates one of the five state options
- **THEN** the selected `BrainStateValue` is written to `sessionStorage` and the modal closes, revealing the dashboard

#### Scenario: Successful selection (mobile)

- **WHEN** the user taps one of the five state options
- **THEN** the selected `BrainStateValue` is written to `AsyncStorage` with today's date key, the context value updates, and the bottom sheet closes

#### Scenario: Context value available downstream

- **WHEN** a child component reads `useBrainToday()` after selection
- **THEN** it receives the chosen `BrainStateValue` (not `null`)

---

### Requirement: Modal design meets cognitive accessibility standards

The check-in UI SHALL use low visual stimulation: no animations beyond a gentle fade-in, generous whitespace, large readable labels, and a distinct high-contrast focus indicator on every interactive element. On **mobile**, the bottom sheet SHALL use the resolved theme tokens from `useTheme()` and meet minimum touch target sizes (48dp).

#### Scenario: No distracting entrance animation

- **WHEN** the check-in UI opens
- **THEN** it fades in (or slides up on mobile) over no more than 150 ms with no bounce, shake, or scale transforms

#### Scenario: Focus is trapped inside the modal (web)

- **WHEN** the modal is open on web
- **THEN** Tab cycling keeps focus inside the modal and does not reach background content

#### Scenario: Touch targets meet mobile minimum (mobile)

- **WHEN** the bottom sheet is open on mobile
- **THEN** every brain-state option button has a minimum height of 48 density-independent pixels
