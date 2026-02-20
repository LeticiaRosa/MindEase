## Context

The Dashboard header in `web-host` currently exposes a single ad-hoc `Timer` button that toggles an inline panel. There is no user identity present in the UI and no consolidated place for personalisation settings. The auth MFE (`web-mfe-auth`) already exposes `user` (name, email) and `signOut` via the federated `useAuth` hook. `packages/ui` already ships `DropdownMenu` (shadcn/ui), `Separator`, `Button`, `Input`, `Form`, and `Label`, so no new shadcn primitives need to be added.

## Goals / Non-Goals

**Goals:**

- Introduce a `UserMenuDropdown` component in `web-host` anchored to the header.
- Display user name + email (read-only) at the top of the dropdown.
- Embed timer preferences (reusing `TimerPreferencesPanel`) inside the dropdown.
- Introduce `ThemePreferencesContext` managing colour theme, font size, and spacing density — persisted to `localStorage` and applied as CSS custom properties / `data-*` attributes on `<html>`.
- Expose theme controls inside the dropdown.
- Provide an accessible, keyboard-navigable "Sign out" action.

**Non-Goals:**

- Editing user name/email (profile management is a separate change).
- Server-side theme persistence (localStorage only for now).
- Mobile (`@mindease/mobile`) — out of scope.
- Adding new shadcn primitives to `packages/ui`.

## Decisions

### 1. Use `DropdownMenu` from `@repo/ui` rather than building a custom popover

`packages/ui` already has a fully accessible `dropdown-menu.tsx` (Radix UI). Building a custom popover would duplicate accessibility work (focus trap, ARIA, keyboard nav) with no benefit.

**Alternative considered**: `Sheet` (slide-in panel) — rejected because it is higher cognitive cost for quick-access actions. A dropdown has lower perceived weight.

### 2. Timer settings inline in the dropdown via `TimerPreferencesPanel`

`TimerPreferencesPanel` is a self-contained form component. It will be rendered inside a `DropdownMenuSub` or a dedicated collapsible section within the dropdown rather than inline in the page. The existing `onClose` prop is repurposed to close the dropdown.

**Alternative considered**: Keep the current inline toggle and only add user info + sign-out in the dropdown — rejected because it leaves the "two entry points for settings" problem unsolved.

### 3. `ThemePreferencesContext` as a new React context in `web-host`

Theme state (colour scheme: `default | soft | high-contrast`, font size: `sm | md | lg`, spacing: `compact | default | relaxed`) lives in a new `ThemePreferencesContext`. On mount it reads from `localStorage`; on change it writes back and applies `data-theme`, `data-font-size`, `data-spacing` attributes to `document.documentElement`. Tailwind CSS v4 variant selectors (`[data-theme="soft"] &`) drive the visual changes.

**Alternative considered**: CSS `prefers-color-scheme` only — rejected because it doesn't cover font size or spacing, and doesn't allow per-user override independent of OS setting.

### 4. `UserMenuDropdown` is a standalone presentational component wired in `Dashboard`

The component receives `user` (from `useAuth`), `onSignOut`, and uses `useThemePreferences()` + `useTimerPreferences()` internally. `Dashboard.tsx` removes the `showTimerSettings` state and the `TimerPreferencesPanel` inline block entirely, replacing the Settings button with `<UserMenuDropdown>`.

**Alternative considered**: Putting all logic in `Dashboard.tsx` — rejected because it would bloat the page component and violate single-responsibility.

### 5. Colour theme tokens via CSS custom properties, not multiple Tailwind config themes

`index.css` in `web-host` already defines tokens. Theme variants are expressed as additional `:root[data-theme="soft"]` and `:root[data-theme="high-contrast"]` blocks overriding the relevant tokens. This works with Tailwind v4 and requires no build-time changes.

## Risks / Trade-offs

- **Dropdown scroll on small viewports** → The dropdown content (timer form + theme controls) may overflow on short screens. Mitigation: cap dropdown max-height with `overflow-y-auto` and ensure the timer form is compact.
- **DropdownMenu closes on any interaction inside** → Radix `DropdownMenu` closes on item click by default. Form fields inside need `onSelect={e => e.preventDefault()}` on their wrapper `DropdownMenuItem`, or the panel must use `DropdownMenuSub` / custom non-closing container. Mitigation: wrap settings sections in `DropdownMenuSub` or use `asChild` with a custom div that prevents close-on-click.
- **`useAuth` federation timing** → If the auth MFE hasn't loaded, `user` may be `null`. The dropdown trigger should show a generic avatar/icon as fallback and gracefully disable the sign-out item.
- **localStorage on private/incognito** → May be unavailable. Mitigation: wrap all `localStorage` calls in try/catch; fall back to in-memory state.

## Migration Plan

1. Add `ThemePreferencesContext` + `useThemePreferences` hook to `web-host`.
2. Wrap `<App>` (or `<DashboardContent>`) in `<ThemePreferencesProvider>`.
3. Add theme token overrides to `apps/web-host/index.css`.
4. Build `UserMenuDropdown` component.
5. Refactor `Dashboard.tsx`: remove inline timer toggle, render `<UserMenuDropdown>`.
6. Smoke-test keyboard navigation and sign-out flow.
7. No rollback strategy needed (pure additive UI change; the old button is simply replaced).

## Open Questions

- Should "soft" and "high-contrast" colour themes be modelled as light/dark variants or as independent palettes? (Currently assumed: independent `data-theme` palettes alongside the existing light/dark support.)
- Should timer preferences save-on-change (live) or require an explicit "Save" button inside the dropdown? (Currently assumed: explicit Save, consistent with the existing `TimerPreferencesPanel` UX.)
