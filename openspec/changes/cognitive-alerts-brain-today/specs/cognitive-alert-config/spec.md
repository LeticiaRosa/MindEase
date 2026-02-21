## ADDED Requirements

### Requirement: Alert preferences are represented by a typed domain model

The system SHALL define an `AlertPreferences` interface with fields for enabled triggers, tone, and intensity. All fields SHALL have safe defaults encapsulated in `DEFAULT_ALERT_PREFERENCES`.

#### Scenario: Default preferences shape

- **WHEN** `DEFAULT_ALERT_PREFERENCES` is read
- **THEN** it returns an object with `triggers` containing `same-task-too-long`, `task-switching`, and `inactivity` enabled; `tone` set to `'direto'`; and `intensity` set to `'moderado'`

#### Scenario: Preference object is serialisable

- **WHEN** `JSON.stringify(preferences)` is called on any valid `AlertPreferences` value
- **THEN** the output is valid JSON with no loss of information, and `JSON.parse` round-trips successfully

---

### Requirement: Preferences are persisted to and hydrated from localStorage

The system SHALL implement `AlertPreferencesLocalStorageAdapter`, which writes preferences under key `mindease:alert-prefs:<userId>` and reads them back on hydration. Reading a missing or corrupt entry SHALL return `DEFAULT_ALERT_PREFERENCES` without throwing.

#### Scenario: Save and retrieve

- **WHEN** `save(userId, preferences)` is called followed by `load(userId)`
- **THEN** `load` returns the exact same preferences object (deep equal)

#### Scenario: Missing key on load

- **WHEN** `load(userId)` is called and no entry exists in localStorage
- **THEN** it returns `DEFAULT_ALERT_PREFERENCES` without throwing

#### Scenario: Corrupt JSON on load

- **WHEN** the localStorage entry for the user contains invalid JSON
- **THEN** `load` returns `DEFAULT_ALERT_PREFERENCES` and logs a warning, without throwing

---

### Requirement: Settings page allows the user to configure every preference field

The `/settings/cognitive-alerts` page SHALL render a form (via `react-hook-form` + `zod`) with controls for:

- Which triggers are active (set of checkboxes / switches, at least five trigger types)
- Preferred tone (radio group: Direto, Acolhedor, Reflexivo, Sugestão)
- Intensity (radio group: Discreto, Moderado, Ativo)
  On submit the preferences SHALL be saved via `SaveAlertPreferences` use case.

#### Scenario: Form pre-filled with current preferences

- **WHEN** the settings page mounts
- **THEN** `useAlertPreferences` hydrates the form from localStorage so the user sees their saved values

#### Scenario: Submitting valid form persists preferences

- **WHEN** the user changes intensity to "Ativo" and submits
- **THEN** `SaveAlertPreferences` is called with the updated preferences and a success toast appears

#### Scenario: Form validation blocks empty trigger set

- **WHEN** the user deselects all triggers and attempts to submit
- **THEN** a zod validation error is displayed inline: "Selecione pelo menos um gatilho"

---

### Requirement: Settings page is accessible from the user menu

The `UserMenuDropdown` SHALL contain a menu item labelled "Alertas Cognitivos" that navigates to `/settings/cognitive-alerts`.

#### Scenario: Menu item present

- **WHEN** the `UserMenuDropdown` is rendered for an authenticated user
- **THEN** an item with accessible name "Alertas Cognitivos" is present in the menu

#### Scenario: Navigation on click

- **WHEN** the user activates the "Alertas Cognitivos" menu item
- **THEN** the router navigates to `/settings/cognitive-alerts`

---

### Requirement: Settings page design meets cognitive accessibility standards

The page SHALL use progressive disclosure: show one settings group at a time (Triggers → Tone → Intensity) with "Próximo" / "Anterior" navigation, so the user is not overwhelmed by all options at once.

#### Scenario: Initial state shows only triggers group

- **WHEN** the settings page first renders
- **THEN** only the "Quando alertar" (triggers) group is visible and the Tone and Intensity groups are hidden

#### Scenario: Completing the triggers step reveals tone step

- **WHEN** the user activates "Próximo" with at least one trigger selected
- **THEN** the Tone selection group becomes visible and the Triggers group is visually de-emphasised (not hidden, for review)
