## 1. ThemePreferencesContext

- [x] 1.1 Create `src/presentation/contexts/ThemePreferencesContext.tsx` with `ThemePreferences` type (`theme`, `fontSize`, `spacing`), default values, and `ThemePreferencesContext`
- [x] 1.2 Implement `ThemePreferencesProvider`: read initial state from `localStorage` key `mindease:theme-preferences` with try/catch fallback to defaults
- [x] 1.3 On every preference change, persist to `localStorage` and apply `data-theme`, `data-font-size`, `data-spacing` attributes on `document.documentElement`
- [x] 1.4 Export `useThemePreferences` hook that throws a descriptive error when used outside the provider
- [x] 1.5 Wrap `<App>` (or the root in `main.tsx`) with `<ThemePreferencesProvider>`

## 2. CSS Theme Tokens

- [x] 2.1 Add `data-font-size` rules to `apps/web-host/index.css`: `[data-font-size="sm"] { font-size: 0.875rem }`, `md` → `1rem`, `lg` → `1.125rem` on `:root`
- [x] 2.2 Add `[data-spacing="compact"]` and `[data-spacing="relaxed"]` blocks to `index.css` overriding a `--spacing-scale` custom property (0.8× / 1.25×)
- [x] 2.3 Add `[data-theme="soft"]` overrides to `index.css` with muted foreground/background tokens
- [x] 2.4 Add `[data-theme="high-contrast"]` overrides to `index.css` ensuring minimum 7:1 contrast ratio (WCAG AAA)

## 3. UserMenuDropdown Component

- [x] 3.1 Create `src/presentation/components/UserMenuDropdown.tsx` using `DropdownMenu*` primitives from `@repo/ui`
- [x] 3.2 Implement the trigger button showing user display name (truncated to 20 chars), email fallback, and a generic avatar icon; render icon-only skeleton when user is null/loading
- [x] 3.3 Add a read-only user info section at the top of the dropdown (name in bold, email in muted text, non-interactive)
- [x] 3.4 Add a "Timer" section: embed `TimerPreferencesPanel` inside a non-closing container (use `onSelect={e => e.preventDefault()}` or a custom wrapper `div`) so dropdown stays open on form interaction
- [x] 3.5 Add an "Appearance" section: colour theme segmented control (`default` / `soft` / `high-contrast`), font size selector (`sm` / `md` / `lg`), spacing selector (`compact` / `default` / `relaxed`); wire to `useThemePreferences().updatePreferences` — changes apply live (no Save button)
- [x] 3.6 Add a `Separator` then a "Sign out" `DropdownMenuItem`; on click call `useAuth().signOut`, on success navigate to `/`, on error show a `toast.error` via `sonner`
- [x] 3.7 Ensure every interactive element has a visible focus ring (`focus-visible:ring-2 focus-visible:ring-ring`) and the panel has generous padding between sections

## 4. Dashboard Refactor

- [x] 4.1 Remove `showTimerSettings` state and the inline `TimerPreferencesPanel` block from `Dashboard.tsx`
- [x] 4.2 Replace the standalone `Settings / Timer` button in the header with `<UserMenuDropdown />`
- [x] 4.3 Verify `TimerProvider` still wraps the tree so timer context is available inside the dropdown

## 5. Type Checking & Lint

- [x] 5.1 Run `pnpm turbo run check-types --filter=web-host` and fix any TypeScript errors
- [x] 5.2 Run `pnpm lint --filter=web-host` and fix any ESLint errors

## 6. Tests (deferred — will be done in a dedicated task)

- [ ] 6.1 Add unit tests for `ThemePreferencesContext` in `apps/web-host/src/test/presentation/`: localStorage init, defaults fallback, attribute application, `useThemePreferences` outside-provider error
- [ ] 6.2 Add unit tests for `UserMenuDropdown`: renders trigger with user name, renders email fallback, sign-out calls `signOut` and navigates, dropdown stays open on timer input interaction, focus ring present on trigger
- [ ] 6.3 Run `pnpm turbo run test --filter=web-host` and confirm all tests pass
