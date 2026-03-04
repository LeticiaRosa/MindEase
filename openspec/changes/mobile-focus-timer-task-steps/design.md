## Context

The mobile app (`apps/mobile`) already has a full Clean Architecture stack for Focus Timer and Smart Checklist features:

- **Domain**: `ChecklistStep`, `TimerPreferences`, `Task` entities; `ITaskRepository`, `ITimerPreferencesRepository` interfaces
- **Application**: `AddChecklistStep`, `ToggleChecklistStep`, `UpdateChecklistStep`, `DeleteChecklistStep`, `AddTaskTimeSpent` use cases
- **Infrastructure**: `SupabaseTaskRepository` (checklist CRUD + `addTaskTimeSpent`), `SupabaseTimerPreferencesRepository`
- **Contexts/Hooks**: `TimerContext` (useReducer with `BACKGROUND_CORRECTION`), `useFocusTimer`, `useSmartChecklist`, `useTimerPreferences`

Presentation components exist but lack web-parity features. The web-host counterparts are the reference implementation.

### Current mobile vs web gaps

| Component                       | Mobile state                      | Web features missing on mobile                                              |
| ------------------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| `FocusTimer` (inline)           | Text-only badge, no progress ring | SVG circular ring, reset/stop controls, mode+cycle indicator                |
| `FocusTimerFocus` (full-screen) | Linear progress bar, no checklist | SVG circular ring, contextual mode descriptions, collapsible SmartChecklist |
| `SmartChecklist`                | Current step + completed toggle   | Inline editing, upcoming/pending steps section, summary/detail mode         |
| `AddStepForm`                   | Always-visible input              | Expandable "+ Add step" → form + Cancel pattern                             |
| `TaskCard`                      | Checklist count + time badge      | Inline FocusTimer widget, launch focus mode action                          |

### Constraints

- React Native: no HTML/CSS — use `react-native-svg` for circular progress, `Pressable` for buttons, `StyleSheet`/inline styles
- Touch targets ≥ 44pt for accessibility
- Must respect `ThemePreferencesContext` (colors, font sizes, spacing, border radii, mode/complexity)
- Timer must handle app backgrounding (already handled via `BACKGROUND_CORRECTION` action)
- Portuguese (pt-BR) labels for consistency with existing mobile UI

## Goals / Non-Goals

**Goals:**

- Bring `FocusTimer`, `FocusTimerFocus`, `SmartChecklist`, `AddStepForm`, and `TaskCard` to full feature parity with web-host
- Add SVG circular progress ring to both timer components using `react-native-svg`
- Add collapsible `SmartChecklist` inside `FocusTimerFocus`
- Add inline step editing to `SmartChecklist` with edit/delete actions on every step
- Add upcoming/pending steps section with show/hide toggle
- Wire `FocusTimer` inline widget into `TaskCard` for in_progress tasks
- Add focus mode entry from `TaskCard` press, launching `FocusTimerFocus` modal
- Make `AddStepForm` use the expandable pattern (collapsed "+ Adicionar etapa" → expanded form)

**Non-Goals:**

- Backend/Supabase schema changes (all tables and RPCs already exist)
- Changes to domain entities, use cases, or repository adapters (all complete)
- Changes to `TimerContext`, `useFocusTimer`, `useSmartChecklist`, or `useTimerPreferences` hooks (all functionally complete)
- Timer preferences UI redesign (the existing `TimerPreferencesPanel` is already at parity)
- Web-host changes
- Adding tests (separate change)

## Decisions

### D1: SVG circular progress via `react-native-svg`

**Decision**: Use `react-native-svg` (`Svg`, `Circle`) for the timer progress ring, matching the web's SVG approach.

**Rationale**: The web uses raw `<svg>` + `<circle>` with `strokeDasharray`/`strokeDashoffset`. React Native has no native SVG support, but `react-native-svg` provides the same primitives. This keeps the visual and math logic identical.

**Alternatives considered**:

- `Animated.View` with border tricks — limited to 180° arcs without complex stitching
- Canvas (`react-native-skia`) — heavier dependency, overkill for a single ring
- Linear progress bar (current) — doesn't match web, less engaging

### D2: FocusTimerFocus uses React Native `Modal` (retained)

**Decision**: Keep the existing `Modal` + `presentationStyle="fullScreen"` approach.

**Rationale**: Already works. The web uses a fixed-position `div`; the RN `Modal` is the direct equivalent. Safe-area handling comes from `SafeAreaView` inside the modal.

**Alternatives considered**:

- Expo Router modal route — adds routing complexity for a transient overlay
- Bottom sheet — doesn't deliver the immersive focus experience

### D3: SmartChecklist inline editing via TextInput swap

**Decision**: When the user taps an edit icon on a step, swap the step title `Text` for a `TextInput` with save/cancel actions (identical to web's pattern).

**Rationale**: The web uses `<Input>` swap with Enter to save and Escape to cancel. On React Native, `TextInput` with `onSubmitEditing` (save) and a cancel button achieves the same UX. The `updateStep` function already exists in the hook.

**Alternatives considered**:

- Bottom sheet editor — too heavy for a quick inline edit
- Alert.prompt (iOS only) — not cross-platform

### D4: FocusTimer inline widget on TaskCard

**Decision**: Render a compact `FocusTimer` widget inside `TaskCard` for tasks with status `in_progress`. For other statuses, show a small "▶ Foco" button that starts the timer and switches the task to `in_progress`.

**Rationale**: The web shows the timer inline in the Kanban card. On mobile, the card has limited space, so we keep the compact badge style (already the mobile pattern) but add it. Tapping the badge when active opens `FocusTimerFocus`.

### D5: Focus mode entry via TaskCard tap + state management on dashboard

**Decision**: Manage `focusTaskId` state in the dashboard screen. When a user taps the FocusTimer badge on a `TaskCard`, set `focusTaskId` which renders `FocusTimerFocus` as a modal overlay. Closing the modal clears `focusTaskId`.

**Rationale**: Simple state management at the dashboard level, matching the web pattern where `FocusTimerFocus` is rendered conditionally. No new context or routing needed.

### D6: AddStepForm expandable pattern

**Decision**: Default to a collapsed "+ Adicionar etapa" `Pressable`. On press, expand to show `TextInput` + "Adicionar" + "Cancelar" buttons. On submit or cancel, collapse back.

**Rationale**: Matches web's progressive disclosure pattern. Keeps the checklist clean until the user actively wants to add a step. Reduces cognitive load.

### D7: Summary/detail mode awareness

**Decision**: Use the existing `useTheme().mode` (`summary` | `detail`) to control default visibility of completed steps and upcoming steps in `SmartChecklist`. In `summary` mode, both sections start collapsed. In `detail` mode, both start expanded.

**Rationale**: Mirrors web's `ThemePreferences` behavior. The mobile already exposes `mode` from `ThemePreferencesContext`.

## Risks / Trade-offs

**[Risk] `react-native-svg` not installed** → Check `package.json`; if missing, add via `pnpm add react-native-svg --filter @mindease/mobile`. Expo includes it by default in SDK 52.

**[Risk] Performance of SVG ring re-renders every second** → The ring only updates `strokeDashoffset` on tick. `react-native-svg` uses native rendering, so this is lightweight. Can wrap in `React.memo` if profiling shows issues.

**[Risk] Inline editing keyboard overlap on SmartChecklist inside FocusTimerFocus** → Use `KeyboardAvoidingView` or `ScrollView` with `keyboardShouldPersistTaps="handled"` around the checklist area.

**[Risk] Touch target size on step edit/delete buttons** → Ensure `hitSlop` of at least 8 on all icon buttons, and minimum `44×44` touch area per accessibility guidelines.

**[Trade-off] Portuguese labels hardcoded** → Matches existing mobile convention. Internationalization is a future concern.

**[Trade-off] No Reanimated animations** → Using `LayoutAnimation` (already in SmartChecklist) for transitions. Reanimated would be smoother but adds complexity.
