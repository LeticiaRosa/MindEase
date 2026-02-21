## Why

Neurodivergent users need more than passive notifications — they need adaptive, real-time executive support that responds to their cognitive state. MindEase currently lacks mechanisms to sense user mental load and deliver timely, personalised interventions that prevent distraction spirals, task-switching overload, and burnout cycles.

## What Changes

- Introduce a **"Cérebro Hoje" (Brain Today) check-in modal** shown once per session before the dashboard loads, asking the user how their brain feels today with five mood options. The app adapts alert behaviour for the day based on the answer.
- Add a **Cognitive Alerts engine** that monitors user activity patterns (time on task, task-switching frequency, inactivity, planned-time overrun, task complexity) and fires personalised alerts.
- Add a **Cognitive Alerts configuration UI** accessible from the main navigation menu, allowing the user to customise alert triggers, message tone, and intensity level.
- Persist both the daily brain state and alert preferences to local storage / user profile so they survive page reloads.

## Capabilities

### New Capabilities

- `brain-today-check-in`: Lightweight session-start modal that collects the user's cognitive state (Focado / Cansado / Sobrecarregado / Ansioso / Disperso) and exposes it as context that drives alert calibration for the session.
- `cognitive-alert-config`: Settings UI and underlying domain model for personalising **when** alerts fire (trigger rules), **how** they are phrased (tone: direct / acolhedora / reflexiva / sugestão), and **how loud** they are (intensity: discreto / moderado / ativo).
- `cognitive-alert-engine`: Runtime service that evaluates trigger conditions against user-activity signals and dispatches the appropriate alert format (pulsing icon / toast / light modal) using the current brain state and saved preferences.

### Modified Capabilities

_(none — no existing spec-level requirements are changing)_

## Impact

- **apps/web-host** — new presentation components (`BrainTodayModal`, `CognitiveAlertConfigPage`, `CognitiveAlertBanner`), new domain entities (`BrainState`, `AlertPreferences`, `AlertTrigger`), new use cases (`RecordBrainState`, `EvaluateAlertTriggers`, `SaveAlertPreferences`), new infrastructure adapter (`AlertPreferencesLocalStorageAdapter`).
- **packages/ui** — may need a new `PulseIcon` or `LightModal` primitive; reuses `Dialog`, `Toast` (sonner), `Select`, `RadioGroup`, `Switch` from shadcn/ui.
- **Navigation/routing** — a new `/settings/cognitive-alerts` route in `web-host`, and a menu item in the main nav.
- **Dependencies** — no new npm packages required; reuses `zod`, `react-hook-form`, `sonner`, `lucide-react`, `@tanstack/react-query`.
