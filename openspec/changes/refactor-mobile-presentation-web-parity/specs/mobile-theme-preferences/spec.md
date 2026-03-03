## ADDED Requirements

### Requirement: Theme preferences context provides 6 configurable dimensions

The `ThemePreferencesContext` SHALL manage and expose 6 preference dimensions: `theme` (default | soft | high-contrast | dark), `fontSize` (sm | md | lg), `spacing` (compact | default | relaxed), `mode` (resume | detail), `helpers` (show | hide), `complexity` (simple | complex). All dimensions SHALL have identical value sets as `web-host`.

#### Scenario: Context provides all dimensions

- **WHEN** a component calls `useTheme()`
- **THEN** it receives an object with `theme`, `fontSize`, `spacing`, `mode`, `helpers`, `complexity` fields and setter functions for each

#### Scenario: Default values on first launch

- **WHEN** no preferences exist in `AsyncStorage`
- **THEN** defaults are: theme `"default"`, fontSize `"md"`, spacing `"default"`, mode `"resume"`, helpers `"show"`, complexity `"simple"`

---

### Requirement: Theme preferences are persisted to AsyncStorage

The provider SHALL persist the full preferences object to `AsyncStorage` under key `mindease:theme-preferences` on every change and hydrate on mount.

#### Scenario: Persistence on change

- **WHEN** the user changes `theme` to `"dark"`
- **THEN** the full preferences object (including the new theme) is written to `AsyncStorage`

#### Scenario: Hydration on mount

- **WHEN** the app launches and the provider mounts
- **THEN** preferences are read from `AsyncStorage` and applied; `isHydrated` transitions from `false` to `true`

#### Scenario: Corrupt storage falls back to defaults

- **WHEN** `AsyncStorage` contains invalid JSON for the preferences key
- **THEN** defaults are used, the corrupt entry is overwritten, and no error is thrown

---

### Requirement: Theme context resolves concrete token objects

The context SHALL resolve the selected `theme` to a concrete colour palette from `@repo/ui/theme` (`colors`, `darkColors`, `softColors`, `highContrastColors`). Similarly, `fontSize` and `spacing` SHALL resolve to scaled versions of the base `fontSizes` and `spacing` tokens.

#### Scenario: Dark theme resolves to darkColors

- **WHEN** `theme` is `"dark"`
- **THEN** `resolvedColors` returns the `darkColors` palette from `@repo/ui/theme`

#### Scenario: Large font size applies scaling

- **WHEN** `fontSize` is `"lg"`
- **THEN** `resolvedFontSizes` returns font sizes scaled up by a factor (e.g., `base: 18` instead of `16`)

#### Scenario: Compact spacing applies reduction

- **WHEN** `spacing` is `"compact"`
- **THEN** `resolvedSpacing` returns spacing values reduced by a factor (e.g., `md: 12` instead of `16`)

---

### Requirement: Theme settings UI renders segmented controls for each dimension

The appearance settings panel (accessible from user menu) SHALL render segmented controls for theme, fontSize, and spacing, and toggle switches for mode, helpers, and complexity.

#### Scenario: Theme selector shows 4 options

- **WHEN** the appearance panel renders
- **THEN** a segmented control with options "Padrão", "Suave", "Alto Contraste", "Escuro" is displayed

#### Scenario: Selecting an option applies immediately

- **WHEN** the user taps "Escuro" in the theme selector
- **THEN** all components re-render with `darkColors` palette immediately (no save button required)

#### Scenario: Mode toggle switches between resume and detail

- **WHEN** the user toggles the mode switch
- **THEN** the value alternates between `"resume"` and `"detail"`, affecting how checklists and task details are displayed

---

### Requirement: Components consume theme via useTheme hook

All presentation components SHALL use `useTheme()` to obtain resolved tokens instead of importing static token objects directly from `@repo/ui/theme`. This ensures theme changes propagate to all components.

#### Scenario: Component re-renders on theme change

- **WHEN** the user switches from default to dark theme
- **THEN** all mounted components using `useTheme()` re-render with the new `resolvedColors`

#### Scenario: No direct static imports of colors

- **WHEN** any presentation component under `apps/mobile/src/presentation/` is inspected
- **THEN** it does NOT directly import `colors` from `@repo/ui/theme` for rendering; it uses `useTheme().resolvedColors` instead

---

### Requirement: Layout waits for theme hydration before rendering children

The `(app)/_layout.tsx` SHALL NOT render its children until `ThemePreferencesContext.isHydrated` is `true`, displaying a loading indicator during hydration.

#### Scenario: Loading state during hydration

- **WHEN** the app layout mounts and `isHydrated` is `false`
- **THEN** a centered `ActivityIndicator` is displayed

#### Scenario: Children render after hydration

- **WHEN** `isHydrated` transitions to `true`
- **THEN** the `Stack` navigator and child screens render with the hydrated theme applied
