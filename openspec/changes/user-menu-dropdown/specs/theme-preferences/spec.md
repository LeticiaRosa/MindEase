## ADDED Requirements

### Requirement: Theme preferences context provides global state

A `ThemePreferencesContext` SHALL expose the current `theme`, `fontSize`, and `spacing` values and an `updatePreferences` function to all descendants. A `ThemePreferencesProvider` SHALL wrap the application root so every component can consume preferences.

#### Scenario: Initial state from localStorage

- **WHEN** the provider mounts and a saved preference exists in `localStorage` under the key `mindease:theme-preferences`
- **THEN** the context SHALL initialise with the stored values

#### Scenario: Initial state defaults

- **WHEN** the provider mounts and no stored value exists
- **THEN** the context SHALL initialise with `theme: "default"`, `fontSize: "md"`, `spacing: "default"`

#### Scenario: localStorage unavailable

- **WHEN** `localStorage` throws (e.g., private browsing with storage blocked)
- **THEN** the context SHALL initialise with default values and SHALL NOT throw an error

---

### Requirement: Preferences persist across page reloads

Whenever `updatePreferences` is called, the new values SHALL be written to `localStorage` under the key `mindease:theme-preferences` as a JSON object.

#### Scenario: Write on update

- **WHEN** `updatePreferences({ theme: "soft" })` is called
- **THEN** `localStorage.getItem("mindease:theme-preferences")` SHALL contain `"soft"` as the theme value

#### Scenario: Persistence survives reload

- **WHEN** the user reloads the page after setting a preference
- **THEN** the preference SHALL be restored from localStorage on the next mount

---

### Requirement: Preferences are applied as HTML attributes

On every preference change, the provider SHALL set `data-theme`, `data-font-size`, and `data-spacing` attributes on `document.documentElement` to reflect the current values.

#### Scenario: Attribute set on mount

- **WHEN** the provider mounts with `theme: "soft"`, `fontSize: "lg"`, `spacing: "relaxed"`
- **THEN** `document.documentElement` SHALL have `data-theme="soft"`, `data-font-size="lg"`, `data-spacing="relaxed"`

#### Scenario: Attribute updated on change

- **WHEN** `updatePreferences({ fontSize: "sm" })` is called
- **THEN** `document.documentElement` SHALL have `data-font-size="sm"` immediately

---

### Requirement: Colour theme options

The system SHALL support exactly three colour theme values: `"default"` (standard palette), `"soft"` (reduced contrast, muted colours), and `"high-contrast"` (maximum contrast for visual sensitivity). Each value SHALL map to a `:root[data-theme="<value>"]` CSS block overriding the relevant custom properties.

#### Scenario: Default theme applies no override

- **WHEN** `theme` is `"default"`
- **THEN** no `data-theme` attribute is set on `<html>`, inheriting the base token values

#### Scenario: Soft theme applies muted tokens

- **WHEN** `theme` is `"soft"`
- **THEN** `data-theme="soft"` is set and the associated CSS overrides reduce foreground/background contrast

#### Scenario: High-contrast theme applies maximum contrast tokens

- **WHEN** `theme` is `"high-contrast"`
- **THEN** `data-theme="high-contrast"` is set and the associated CSS overrides maximise text/background contrast ratio (minimum 7:1 per WCAG AAA)

---

### Requirement: Font size options

The system SHALL support three font size values: `"sm"` (14px base), `"md"` (16px base, default), and `"lg"` (18px base). These SHALL be applied by setting `--font-size-base` on `document.documentElement`.

#### Scenario: Font size reflected in root property

- **WHEN** `fontSize` is `"lg"`
- **THEN** `document.documentElement` SHALL have `data-font-size="lg"` and the CSS SHALL set `font-size: 1.125rem` on `:root`

---

### Requirement: Spacing density options

The system SHALL support three spacing values: `"compact"`, `"default"`, and `"relaxed"`. These SHALL be applied via `data-spacing` on `document.documentElement` and drive `--spacing-scale` CSS custom property multipliers.

#### Scenario: Relaxed spacing increases whitespace

- **WHEN** `spacing` is `"relaxed"`
- **THEN** `data-spacing="relaxed"` is set and the CSS multiplier increases base spacing by 1.25×

#### Scenario: Compact spacing reduces whitespace

- **WHEN** `spacing` is `"compact"`
- **THEN** `data-spacing="compact"` is set and the CSS multiplier reduces base spacing by 0.8×

---

### Requirement: useThemePreferences hook

A `useThemePreferences` hook SHALL be exported from the context module. It SHALL throw a descriptive error when used outside `ThemePreferencesProvider`.

#### Scenario: Hook provides context values

- **WHEN** called inside a `ThemePreferencesProvider`
- **THEN** it SHALL return `{ theme, fontSize, spacing, updatePreferences }`

#### Scenario: Hook throws outside provider

- **WHEN** called outside `ThemePreferencesProvider`
- **THEN** it SHALL throw `Error: useThemePreferences must be used within ThemePreferencesProvider`
