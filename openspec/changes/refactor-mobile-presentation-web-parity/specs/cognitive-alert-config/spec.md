## MODIFIED Requirements

### Requirement: Preferences are persisted to and hydrated from localStorage

The system SHALL implement platform-specific storage adapters for alert preferences. On **web**, `AlertPreferencesLocalStorageAdapter` writes preferences under key `mindease:alert-prefs:<userId>` in `localStorage`. On **mobile**, `AlertPreferencesAsyncStorageAdapter` writes the same key to `AsyncStorage`. Both adapters SHALL return `DEFAULT_ALERT_PREFERENCES` for missing or corrupt entries without throwing.

#### Scenario: Save and retrieve (web)

- **WHEN** `save(userId, preferences)` is called followed by `load(userId)` using the localStorage adapter
- **THEN** `load` returns the exact same preferences object (deep equal)

#### Scenario: Save and retrieve (mobile)

- **WHEN** `save(userId, preferences)` is called followed by `load(userId)` using the AsyncStorage adapter
- **THEN** `load` returns the exact same preferences object (deep equal)

#### Scenario: Missing key on load

- **WHEN** `load(userId)` is called and no entry exists in the platform storage
- **THEN** it returns `DEFAULT_ALERT_PREFERENCES` without throwing

#### Scenario: Corrupt JSON on load

- **WHEN** the storage entry for the user contains invalid JSON
- **THEN** `load` returns `DEFAULT_ALERT_PREFERENCES` and logs a warning, without throwing

---

### Requirement: Settings page allows the user to configure every preference field

The cognitive alert configuration screen SHALL render a form (via `react-hook-form` + `zod`) with controls for triggers, tone, and intensity. On **web**, this is at `/settings/cognitive-alerts`. On **mobile**, this is the `(app)/cognitive-alert-config.tsx` route.

Controls:
- Which triggers are active (set of switches, at least five trigger types)
- Preferred tone (radio group or segmented control: Direto, Acolhedor, Reflexivo, Sugestão)
- Intensity (radio group or segmented control: Discreto, Moderado, Ativo)

On submit, preferences SHALL be saved via `SaveAlertPreferences` use case.

#### Scenario: Form pre-filled with current preferences

- **WHEN** the settings screen mounts
- **THEN** `useAlertPreferences` hydrates the form from platform storage so the user sees their saved values

#### Scenario: Submitting valid form persists preferences

- **WHEN** the user changes intensity to "Ativo" and submits
- **THEN** `SaveAlertPreferences` is called with the updated preferences and a success feedback is shown (toast on web, alert or toast on mobile)

#### Scenario: Form validation blocks empty trigger set

- **WHEN** the user deselects all triggers and attempts to submit
- **THEN** a zod validation error is displayed inline: "Selecione pelo menos um gatilho"

---

### Requirement: Settings page is accessible from the user menu

The user menu SHALL contain a menu item labelled "Alertas Cognitivos" that navigates to the cognitive alert configuration screen. On **web**, this is in the `UserMenuDropdown`. On **mobile**, this is in the `UserMenuBottomSheet`.

#### Scenario: Menu item present (web)

- **WHEN** the `UserMenuDropdown` is rendered for an authenticated user
- **THEN** an item with accessible name "Alertas Cognitivos" is present in the menu

#### Scenario: Menu item present (mobile)

- **WHEN** the `UserMenuBottomSheet` is open for an authenticated user
- **THEN** a navigation link labelled "Alertas Cognitivos" is visible

#### Scenario: Navigation on tap (mobile)

- **WHEN** the user taps the "Alertas Cognitivos" link in the mobile bottom sheet
- **THEN** the bottom sheet closes and `router.push("/(app)/cognitive-alert-config")` is called

---

### Requirement: Settings page design meets cognitive accessibility standards

The page SHALL use progressive disclosure: show one settings group at a time (Triggers → Tone → Intensity) with "Próximo" / "Anterior" navigation. On **mobile**, each step SHALL fill the screen with generous spacing and large touch targets (minimum 48dp for interactive elements).

#### Scenario: Initial state shows only triggers group

- **WHEN** the settings screen first renders
- **THEN** only the "Quando alertar" (triggers) group is visible

#### Scenario: Completing the triggers step reveals tone step

- **WHEN** the user activates "Próximo" with at least one trigger selected
- **THEN** the Tone selection group becomes visible

#### Scenario: Mobile touch targets meet minimum (mobile)

- **WHEN** the settings screen renders on mobile
- **THEN** every switch, radio button, and navigation button has a minimum height of 48 density-independent pixels

#### Scenario: Back navigation with header (mobile)

- **WHEN** the cognitive alert config screen renders
- **THEN** a header with a back arrow and title "Alertas Cognitivos" is displayed
