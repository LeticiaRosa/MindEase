## 1. Setup & Dependencies

- [x] 1.1 Verify `react-native-svg` is installed in `@mindease/mobile`; if missing, run `pnpm add react-native-svg --filter @mindease/mobile`
- [x] 1.2 Create a shared `CircularProgress` helper component at `src/presentation/components/CircularProgress.tsx` using `Svg` + `Circle` from `react-native-svg` (accepts `size`, `strokeWidth`, `progress`, `trackColor`, `progressColor`)

## 2. AddStepForm — Expandable Pattern

- [x] 2.1 Refactor `AddStepForm.tsx` to default to a collapsed "+ Adicionar etapa" `Pressable`; on press, expand to show `TextInput` + "Adicionar" + "Cancelar" buttons
- [x] 2.2 Wire keyboard submit (`onSubmitEditing`) to call `onSubmit` and collapse the form
- [x] 2.3 Add `accessibilityLabel` to the collapsed button and both action buttons

## 3. SmartChecklist — Web Parity

- [x] 3.1 Add inline editing state (`editingStepId`, `editingStepValue`) and `startEditing`/`saveEditing`/`cancelEditing` handlers to `SmartChecklist.tsx`
- [x] 3.2 Add edit (pencil ✎) and delete (✕) action buttons to the current step row, with `hitSlop` ≥ 8 and minimum 44×44 touch target
- [x] 3.3 Implement `TextInput` swap for the current step when in edit mode (save on `onSubmitEditing`, cancel button)
- [x] 3.4 Add collapsible "upcoming/pending steps" section below the current step, with "+N etapa(s) restante(s)" toggle button
- [x] 3.5 Render each upcoming step with unchecked indicator, muted text, edit/delete buttons, and inline editing support
- [x] 3.6 Add edit/delete buttons and inline editing to completed steps rows
- [x] 3.7 Wire `useTheme().mode` to control default collapsed/expanded state of completed and upcoming sections (`summary` → collapsed, `detail` → expanded)
- [x] 3.8 Update empty state prompt text to "Divida esta tarefa em etapas menores."
- [x] 3.9 Ensure all interactive elements have `accessibilityRole`, `accessibilityLabel`, and `accessibilityState` props

## 4. FocusTimer (Inline) — SVG Ring & Full Controls

- [x] 4.1 Replace the text-only active badge in `FocusTimer.tsx` with `CircularProgress` ring + formatted time + mode/cycle label
- [x] 4.2 Add play/pause `Pressable` controls with 44×44 minimum touch targets
- [x] 4.3 Add reset and stop `Pressable` controls (visible when timer is active)
- [x] 4.4 Keep the compact "▶ Foco" button for the inactive state
- [x] 4.5 Ensure all controls use `ThemePreferencesContext` colors, spacing, and border radii

## 5. FocusTimerFocus (Full-Screen) — SVG Ring, Descriptions & Checklist

- [x] 5.1 Replace the linear progress bar in `FocusTimerFocus.tsx` with a large `CircularProgress` ring (r≈88) and centered `MM:SS` + cycle indicator overlay
- [x] 5.2 Add contextual mode descriptions below the mode label ("Mantenha o foco…", "Descanse a mente…", "Faça uma pausa mais longa…")
- [x] 5.3 Wrap modal content in `SafeAreaView` for proper safe-area insets
- [x] 5.4 Update close button to show "✕ Sair do foco" label (close without stopping timer)
- [x] 5.5 Add collapsible `SmartChecklist` section below controls with "Mostrar etapas" / "Ocultar etapas" toggle (hidden when `taskId === "dashboard"`)
- [x] 5.6 Wrap the checklist area in `ScrollView` with `keyboardShouldPersistTaps="handled"` for inline editing keyboard support

## 6. TaskCard Integration

- [x] 6.1 Import `FocusTimer` into `TaskCard.tsx` and render it below the metadata row, passing `taskId` and `onExpand` callback
- [x] 6.2 Add `onExpandFocus` prop to `TaskCard` that propagates the expand action to the dashboard

## 7. Dashboard Wiring

- [x] 7.1 Add `focusTaskId` state to `dashboard.tsx`
- [x] 7.2 Pass `onExpandFocus` callback through `TaskGroup` → `TaskCard` that sets `focusTaskId`
- [x] 7.3 Render `FocusTimerFocus` modal conditionally when `focusTaskId` is set, with `onClose` clearing the state
- [x] 7.4 Pass the focused task's title to `FocusTimerFocus`

## 8. Smoke Test & Validation

- [x] 8.1 Verify the app builds without errors (`pnpm turbo run build --filter @mindease/mobile` or Expo bundler)
- [x] 8.2 Run lint and type-check (`pnpm lint --filter @mindease/mobile && pnpm check-types --filter @mindease/mobile`)
- [ ] 8.3 Manual test: start timer from TaskCard → verify inline ring + controls → tap badge → verify full-screen focus mode opens
- [ ] 8.4 Manual test: add/toggle/edit/delete checklist steps inside SmartChecklist (both standalone and inside focus mode)
- [ ] 8.5 Manual test: verify summary/detail mode toggles section default visibility
- [ ] 8.6 Manual test: verify theme changes apply to all new components
