## ADDED Requirements

### Requirement: User menu is a rich bottom sheet

The `UserMenu` component SHALL be replaced with a `UserMenuBottomSheet` that presents a scrollable settings panel when the user taps their avatar. The bottom sheet SHALL contain sections matching `web-host`'s `UserMenuDropdown` content.

#### Scenario: Tapping avatar opens bottom sheet

- **WHEN** the user taps the avatar circle in the dashboard header
- **THEN** a bottom sheet slides up from the bottom of the screen

#### Scenario: Bottom sheet is dismissible

- **WHEN** the user swipes down on the bottom sheet handle or taps the backdrop
- **THEN** the bottom sheet closes

---

### Requirement: User info section displays email and name

The top section of the bottom sheet SHALL display the user's email and full name (from `user_metadata.full_name`).

#### Scenario: User info renders

- **WHEN** the bottom sheet opens for a user with email "user@example.com" and full name "Ana"
- **THEN** "Ana" is displayed as a heading and "user@example.com" below in muted text

#### Scenario: Missing full name shows email only

- **WHEN** the user has no `full_name` in metadata
- **THEN** the email is displayed as the primary text

---

### Requirement: Timer preferences section is configurable

The bottom sheet SHALL include a collapsible "Temporizador" section with controls for focus duration, break duration, long-break duration, and cycle count — matching web-host's `TimerPreferencesPanel`.

#### Scenario: Timer section collapsed by default

- **WHEN** the bottom sheet opens
- **THEN** the "Temporizador" section header is visible but the controls are collapsed

#### Scenario: Expanding shows duration controls

- **WHEN** the user taps "Temporizador"
- **THEN** sliders or steppers for "Foco", "Pausa", "Pausa longa", and "Ciclos" are revealed

#### Scenario: Changing duration saves to Supabase

- **WHEN** the user adjusts focus duration to 30 minutes
- **THEN** the `useTimerPreferences` hook persists the change and new timers use the updated value

---

### Requirement: Appearance section provides theme controls

The bottom sheet SHALL include a collapsible "Aparência" section with the `AppearancePanel` containing theme, font size, spacing selectors, and mode/helpers/complexity toggles.

#### Scenario: Theme change applies immediately

- **WHEN** the user selects "Escuro" in the theme segmented control
- **THEN** the entire app re-renders with dark colours immediately (no save button)

---

### Requirement: Navigation links section provides access to settings screens

The bottom sheet SHALL include navigation links: "Gerenciar Kanbans" → manage-routines, "Alertas Cognitivos" → cognitive-alert-config, "Tarefas Arquivadas" → archived-tasks.

#### Scenario: Tapping navigation link routes and closes sheet

- **WHEN** the user taps "Gerenciar Kanbans"
- **THEN** the bottom sheet closes and `router.push("/(app)/manage-routines")` is called

#### Scenario: All three links present

- **WHEN** the bottom sheet is open and `complexity` is `"complex"`
- **THEN** links for "Gerenciar Kanbans", "Alertas Cognitivos", and "Tarefas Arquivadas" are all visible

#### Scenario: Simple complexity hides advanced links

- **WHEN** `complexity` is `"simple"`
- **THEN** "Gerenciar Kanbans" and "Tarefas Arquivadas" links are hidden; only "Alertas Cognitivos" remains

---

### Requirement: Sign-out action is at the bottom with destructive styling

The bottom sheet SHALL include a "Sair" button at the bottom with destructive colour styling. Tapping it SHALL call `useAuth().signOut()` and navigate to the login screen.

#### Scenario: Sign out clears session and navigates

- **WHEN** the user taps "Sair"
- **THEN** `signOut()` is called, the bottom sheet closes, and `router.replace("/(auth)/login")` executes

#### Scenario: Destructive styling is clear

- **WHEN** the bottom sheet renders
- **THEN** the "Sair" button uses the destructive colour from the resolved theme tokens
