## Why

The Dashboard header currently has a bare "Timer" button and no user presence, forcing users to hunt for settings and sign-out across disconnected surfaces. Neurodivergent users benefit from a single, predictable entry point for identity and personalisation — bringing name display, timer config, theme/appearance preferences, and session exit into one low-stimulation dropdown reduces cognitive load and makes the interface feel complete.

## What Changes

- Replace the standalone `Timer` button in the Dashboard header with a user avatar/name dropdown menu.
- The dropdown exposes: user display name + email (read-only), Timer preferences section, Theme & appearance preferences (colour scheme, font size, spacing density), and a "Sign out" action.
- Timer preferences currently rendered in `TimerPreferencesPanel` are accessible from the dropdown, replacing the inline toggle.
- Theme preferences (colour palette, font size, spacing) are persisted to `localStorage` and applied via CSS custom properties / Tailwind data-attributes.
- Sign-out calls `useAuth().signOut` and redirects to the auth page.

## Capabilities

### New Capabilities

- `user-menu`: Dropdown component anchored to the header, showing user info, grouped settings sections, and sign-out. Keyboard navigable, ARIA-compliant, low visual stimulation.
- `theme-preferences`: User-controlled appearance settings (colour theme, font size, spacing density) stored in `localStorage` and applied globally via a React context + CSS variables.

### Modified Capabilities

<!-- No existing spec-level requirements are changing. -->

## Impact

- **`apps/web-host`**: `Dashboard.tsx` header is refactored; `TimerPreferencesPanel` integration moves inside the dropdown. New components added under `src/presentation/components/`.
- **`packages/ui`**: Likely uses `DropdownMenu` from shadcn/ui (already available or to be added).
- **`apps/web-mfe-auth`**: `useAuth` hook already exposes `user` (name, email) and `signOut` — no changes needed.
- **Dependencies**: `@radix-ui/react-dropdown-menu` (via shadcn), `lucide-react` icons (already present).
- **CSS**: New CSS custom properties for theme tokens added to `index.css` in `web-host`.
