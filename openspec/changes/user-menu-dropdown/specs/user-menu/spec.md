## ADDED Requirements

### Requirement: User menu trigger displays user identity

The header SHALL render a `UserMenuDropdown` trigger button that shows the authenticated user's display name (or email as fallback) and a generic avatar icon. When no user is available (loading / federation not ready), the trigger SHALL appear as an icon-only button and SHALL be non-interactive until the user resolves.

#### Scenario: Authenticated user name is shown

- **WHEN** the user is authenticated and `user.user_metadata.full_name` is non-empty
- **THEN** the trigger SHALL display the user's full name truncated to a maximum of 20 characters

#### Scenario: Email fallback when name is absent

- **WHEN** the user is authenticated and `full_name` is empty or undefined
- **THEN** the trigger SHALL display the user's email address truncated to 20 characters

#### Scenario: Loading state

- **WHEN** the auth state is loading
- **THEN** the trigger SHALL render a skeleton placeholder and SHALL NOT open the dropdown

---

### Requirement: Dropdown opens and closes accessibly

The `UserMenuDropdown` SHALL open a dropdown panel when the trigger is activated (click or Enter/Space key). The dropdown SHALL trap focus within itself while open. Pressing Escape SHALL close the dropdown and return focus to the trigger.

#### Scenario: Keyboard open

- **WHEN** the trigger has focus and Enter or Space is pressed
- **THEN** the dropdown panel SHALL open and the first focusable item SHALL receive focus

#### Scenario: Keyboard close

- **WHEN** the dropdown is open and Escape is pressed
- **THEN** the dropdown SHALL close and focus SHALL return to the trigger

#### Scenario: Click outside closes

- **WHEN** the dropdown is open and the user clicks outside the panel
- **THEN** the dropdown SHALL close

---

### Requirement: Dropdown shows user info section

The top section of the dropdown SHALL display the authenticated user's full name and email address as read-only information. This section SHALL NOT be interactive (not a clickable item).

#### Scenario: User info rendered

- **WHEN** the dropdown is open
- **THEN** the first section SHALL show the user's display name in bold and email below it in muted text

---

### Requirement: Dropdown embeds timer preferences

The dropdown SHALL include a labelled "Timer" section containing the timer preferences form (focus duration, break duration, long break duration, cycles before long break). The form SHALL NOT close the dropdown when inputs are interacted with. Changes SHALL be committed only when the "Save" button is activated.

#### Scenario: Timer form visible in dropdown

- **WHEN** the dropdown is open
- **THEN** the timer preferences form SHALL be visible and all four numeric inputs SHALL be focusable without closing the dropdown

#### Scenario: Save timer preferences

- **WHEN** the user modifies a timer field and activates "Save"
- **THEN** the preferences SHALL be persisted and a success toast SHALL be shown

#### Scenario: Invalid timer input

- **WHEN** a timer field contains a value outside its allowed range
- **THEN** an inline validation message SHALL appear and the Save button SHALL be disabled

---

### Requirement: Dropdown embeds theme preferences

The dropdown SHALL include a labelled "Appearance" section exposing controls for colour theme, font size, and spacing density. Changes SHALL apply immediately (live preview) and be persisted automatically.

#### Scenario: Theme control visible

- **WHEN** the dropdown is open
- **THEN** the Appearance section SHALL show a colour theme selector, a font size selector, and a spacing density selector

#### Scenario: Live apply on change

- **WHEN** the user selects a different colour theme, font size, or spacing
- **THEN** the new preference SHALL be applied to the page immediately without requiring a Save action

---

### Requirement: Sign out action

The dropdown SHALL include a "Sign out" item in a visually separated final section. Activating it SHALL call the `signOut` function from `useAuth`, then redirect the user to the auth page.

#### Scenario: Sign out success

- **WHEN** the user activates "Sign out"
- **THEN** the auth session SHALL be cleared and the router SHALL navigate to `/` (auth page)

#### Scenario: Sign out failure

- **WHEN** the sign-out call fails
- **THEN** a non-blocking error toast SHALL be displayed and the user SHALL remain on the current page

---

### Requirement: Dropdown is low-stimulation and accessible

The dropdown trigger and panel SHALL comply with cognitive accessibility rules: no animations that play without user intent, a visible high-contrast focus ring on every interactive element, and sufficient whitespace between groups.

#### Scenario: Focus ring on trigger

- **WHEN** the trigger is focused via keyboard
- **THEN** a visible focus ring SHALL be rendered (minimum 2px solid, not just a colour change)

#### Scenario: No auto-close on settings interaction

- **WHEN** the user interacts with an input inside the timer or appearance section
- **THEN** the dropdown SHALL remain open
