## Context

`web-host` already follows Clean Architecture with four layers (`domain`, `application`, `infrastructure`, `presentation`). Existing entities (`Task`, `TimerPreferences`) are plain TypeScript interfaces with no OOP overhead. Infrastructure adapters talk to Supabase; user preferences are persisted there. Presentation uses React Router v6 with a `ProtectedRoute` wrapper.

The cognitive-alert feature is **purely client-side at launch**: it reads activity signals from in-browser state and fires UI interventions. No new backend table is needed for MVP, though preferences may migrate to Supabase later. This keeps iteration fast and avoids auth-gating the setup flow.

## Goals / Non-Goals

**Goals:**

- A once-per-session "Cérebro Hoje" modal that records the user's cognitive state and gates the dashboard.
- A preference model (`AlertPreferences`) covering triggers, tone, and intensity.
- A runtime engine (`AlertEngineService`) that evaluates triggers and dispatches alerts at the correct intensity.
- A settings page at `/settings/cognitive-alerts` reachable from the user menu.
- Full persistence via `localStorage` so preferences survive page reloads (Supabase sync deferred).
- Zero new npm dependencies — reuse `zod`, `react-hook-form`, `sonner`, `lucide-react`, shadcn/ui.

**Non-Goals:**

- Real-time telemetry sent to a server (privacy by design).
- Push / OS-level notifications.
- Mobile (React Native) implementation — kept in scope for a follow-up.
- Supabase-backed sync of preferences (deferred past MVP).

## Decisions

### Decision 1 — Brain state stored in React Context, not URL or server

**Choice**: a `BrainTodayContext` (React Context + `useState`) holds the selected `BrainState` for the session. It is initialised from `sessionStorage` so it survives hard-refresh within the tab but resets on a new tab/session.

**Alternatives considered**:

- _URL query param_ (`?brain=focado`): leaks mental state into shareable URLs — rejected on privacy grounds.
- _Supabase row per user per day_: requires network round-trip before the modal is shown — rejected to keep first-paint fast.

**Rationale**: Session-scoped context is private, instantaneous, and matches the "once per session" UX intent.

---

### Decision 2 — Alert preferences persisted to `localStorage`, keyed by user ID

**Choice**: `AlertPreferencesLocalStorageAdapter` serialises `AlertPreferences` to `localStorage` under key `mindease:alert-prefs:<userId>`.

**Alternatives considered**:

- _Supabase profile column_: couples this feature to a schema migration — deferred.
- _In-memory only_: preferences reset on every reload, creating repeated configuration friction for neurodivergent users — rejected.

**Rationale**: `localStorage` is synchronous, works offline, and is trivially replaceable with a Supabase adapter behind the `IAlertPreferencesRepository` interface without changing any use-case code.

---

### Decision 3 — Alert engine as a custom hook, not a global background timer

**Choice**: `useAlertEngine(activitySignals)` is a React hook that:

1. Subscribes to activity signals passed as props/context.
2. Uses `useEffect` with `setInterval` (1-minute tick) to evaluate trigger conditions.
3. Dispatches alerts via `sonner` (toast), a pulsing `CognitiveAlertBanner` icon, or a `LightModal`.

**Alternatives considered**:

- _Web Worker_: overkill for 1-minute polling, adds complexity and cross-origin restrictions with Module Federation.
- _Global `setInterval` in `main.tsx`_: breaks React's lifecycle model, hard to test.

**Rationale**: A hook keeps the engine co-located with the component that owns activity signals, is easy to unit-test by injecting mock signals, and shuts down cleanly with `useEffect` cleanup.

---

### Decision 4 — Intensity determines dispatch channel, brain state tunes message content

**Choice**: The `AlertEngineService.evaluate()` pure function maps `(trigger, brainState, preferences)` → `AlertPayload { channel: 'icon' | 'toast' | 'modal', message: string }`.

- `intensity: discreto` → `channel: 'icon'` (pulsing `BellOff` Lucide icon in header)
- `intensity: moderado` → `channel: 'toast'` (sonner toast, bottom-right, 6 s)
- `intensity: ativo` → `channel: 'modal'` (shadcn `Dialog`, non-blocking, focus-trapped)

Brain state biases the message from a lookup table keyed by `(trigger, brainState, tone)`.

**Rationale**: Separating channel selection (intensity) from message copy (brain state × tone) makes both independently configurable and testable without mocking UI.

---

### Decision 5 — Settings route integrated into existing `UserMenuDropdown`

**Choice**: Add a "Alertas Cognitivos" item to the existing `UserMenuDropdown` component, routing to `/settings/cognitive-alerts` via React Router.

**Rationale**: The user menu is already the home for user-specific settings (logout, theme). Adding the alerts config there is predictable and avoids introducing a second navigation pattern.

---

### Decision 6 — Domain value objects use discriminated union types, not enums

**Choice**:

```typescript
type BrainStateValue =
  | "focado"
  | "cansado"
  | "sobrecarregado"
  | "ansioso"
  | "disperso";
type AlertTone = "direto" | "acolhedor" | "reflexivo" | "sugestao";
type AlertIntensity = "discreto" | "moderado" | "ativo";
type AlertTrigger =
  | "same-task-too-long"
  | "task-switching"
  | "inactivity"
  | "time-overrun"
  | "complex-task";
```

**Rationale**: TypeScript string unions are serialisable to JSON without a mapping step, work with `zod` natively, and avoid the numeric-enum pitfalls that cause subtle bugs.

## Risks / Trade-offs

| Risk                                                                                                                                                             | Mitigation                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Activity signals (task-switch count, time-on-task) are only available if the Kanban/task components expose them via context. If they don't, triggers can't fire. | `ActivitySignalsContext` will be introduced alongside the engine; Kanban components updated to write into it. Tasks artifact will track this dependency explicitly.        |
| `localStorage` cleared by the browser (private mode, storage quota).                                                                                             | On read failure, fall back to `DEFAULT_ALERT_PREFERENCES`. Never throw — degrade gracefully.                                                                               |
| Modal at `intensity: ativo` could itself cause cognitive overload if poorly timed.                                                                               | Modal is non-blocking (`DialogContent` without `modal` prop), has a clear "Fechar" CTA, and is throttled to at most once every 15 minutes regardless of trigger frequency. |
| Brain state modal delays access to the dashboard on every session.                                                                                               | Modal is skippable ("Pular por hoje") and its answer is cached in `sessionStorage` so it only appears once per browser session.                                            |
| Message copy lookup table grows large as triggers × brain states × tones expand.                                                                                 | Extract to a separate `alertMessages.ts` data file; keep the engine logic free of copy.                                                                                    |

## Migration Plan

1. Implement all new files without touching existing routes or components.
2. Add `/settings/cognitive-alerts` route to `router.tsx`.
3. Add `BrainTodayProvider` and `AlertPreferencesProvider` to the root tree in `App.tsx`.
4. Wire `BrainTodayModal` into `ProtectedRoute` (shows modal before rendering children if no brain state for session).
5. Add "Alertas Cognitivos" menu item to `UserMenuDropdown`.
6. Wire `ActivitySignalsContext` into `Dashboard` and `KanbanBoard`.
7. Mount `useAlertEngine` in `Dashboard`.
8. Rollback: each step is additive. Removing the `BrainTodayProvider` and `useAlertEngine` call reverts to pre-feature state with no data loss.

## Open Questions

- **Q1**: Should `BrainTodayModal` block the entire viewport (full-screen overlay) or appear as a centred `Dialog`? A centred `Dialog` is less jarring for `sobrecarregado` / `ansioso` states; full-screen feels more intentional. Lean towards `Dialog` unless UX review says otherwise.
- **Q2**: Should triggering an alert while another is already visible be suppressed (debounce) or queued? Initial implementation: suppress (only one alert visible at a time, 15-min cool-down per trigger type).
- **Q3**: Activity signals for "time on same task" require knowing when the user navigated to a task. Does the Kanban board track "active task" state? If not, scope this trigger to the Focus Timer cycle count as a proxy.
