## Why

The web-host app offers a fully integrated Focus Mode (full-screen Pomodoro timer with collapsible checklist), an inline per-task FocusTimer widget, and a Smart Checklist for breaking tasks into smaller steps — all key features for neurodivergent users who need guided focus and progressive task decomposition. The mobile app has the foundational layers (domain entities, use cases, repository adapters, contexts, and hooks) already in place, but the presentation components need to reach full feature parity with the web to deliver the same cognitive accessibility experience on mobile.

## What Changes

- **Focus Timer inline widget**: Ensure `FocusTimer.tsx` on mobile matches the web's circular progress ring, play/pause/reset/stop controls, and mode/cycle display. Adapt layout for React Native (SVG via `react-native-svg`, pressable controls).
- **Focus Mode full-screen overlay**: Ensure `FocusTimerFocus.tsx` on mobile delivers the same immersive full-screen experience — large progress ring, contextual mode descriptions, start/pause/reset/stop controls, task title, and a collapsible `SmartChecklist` panel. Adapt for mobile with safe-area insets and gesture-based exit.
- **Smart Checklist (task steps)**: Ensure `SmartChecklist.tsx` and `AddStepForm.tsx` on mobile match the web's progressive disclosure pattern — current step highlighted, completed steps collapsible, upcoming steps collapsible, inline editing, and "all steps complete" feedback. Add step creation via `AddStepForm`.
- **Timer Preferences panel**: Ensure `TimerPreferencesPanel.tsx` allows configuring focus/break/long-break durations and cycles-before-long-break, persisted to Supabase, matching the web's settings.
- **TaskCard integration**: Wire the checklist progress indicator and focus timer entry point into `TaskCard.tsx`, so users can launch focus mode and see step completion at a glance — matching the web's Kanban card UX.
- **Navigation**: Add a way to enter/exit full-screen Focus Mode from the dashboard or task detail, with proper back-navigation handling on mobile.

## Capabilities

### New Capabilities

- `mobile-focus-mode`: Full-screen immersive Pomodoro focus overlay for mobile, with timer ring, contextual descriptions, task title, controls, and collapsible smart checklist — matching web-host's `FocusTimerFocus`.
- `mobile-inline-timer`: Inline per-task Pomodoro timer widget visible on task cards or detail views — matching web-host's `FocusTimer`.
- `mobile-smart-checklist`: Progressive-disclosure task step checklist with create/toggle/edit/delete, current-step highlighting, and completion feedback — matching web-host's `SmartChecklist` and `AddStepForm`.

### Modified Capabilities

_(none — no existing spec-level requirements are changing)_

## Impact

- **Affected code**: `apps/mobile/src/presentation/components/` (FocusTimer, FocusTimerFocus, SmartChecklist, AddStepForm, TimerPreferencesPanel, TaskCard), `apps/mobile/src/presentation/hooks/` (useFocusTimer, useSmartChecklist, useTimerPreferences), `apps/mobile/src/presentation/contexts/TimerContext.tsx`, `apps/mobile/app/(app)/dashboard.tsx`.
- **Dependencies**: `react-native-svg` (circular progress ring), existing Supabase adapters (`SupabaseTaskRepository`, `SupabaseTimerPreferencesRepository`), `@tanstack/react-query`, `expo-router`.
- **No backend changes**: All Supabase tables (`checklist_steps`, `timer_preferences`, `tasks.total_time_spent`) and RPC endpoints already exist and are consumed by the mobile infrastructure layer.
- **Accessibility**: All interactive elements must have accessible labels, adequate touch targets (≥ 44pt), and respect the user's theme/spacing/font-size preferences from `ThemePreferencesContext`.
