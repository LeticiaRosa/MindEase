## 1. Domain Layer

- [x] 1.1 Create `src/domain/valueObjects/BrainState.ts` — export `BrainStateValue` union type and `BRAIN_STATE_OPTIONS` display config (label, colour, emoji)
- [x] 1.2 Create `src/domain/valueObjects/AlertTypes.ts` — export `AlertTone`, `AlertIntensity`, `AlertTrigger`, `AlertChannel` union types
- [x] 1.3 Create `src/domain/entities/AlertPreferences.ts` — export `AlertPreferences` interface and `DEFAULT_ALERT_PREFERENCES` constant
- [x] 1.4 Create `src/domain/entities/AlertPayload.ts` — export `AlertPayload` interface `{ channel: AlertChannel; message: string; trigger: AlertTrigger }`
- [x] 1.5 Create `src/domain/entities/ActivitySignals.ts` — export `ActivitySignals` interface with `taskSwitchCount`, `timeOnCurrentTaskMs`, `lastInteractionMs`, `plannedTaskDurationMs`, `currentTaskIsComplex`
- [x] 1.6 Create `src/domain/interfaces/IAlertPreferencesRepository.ts` — interface with `save(userId, prefs)` and `load(userId)` methods

## 2. Infrastructure Layer

- [x] 2.1 Create `src/infrastructure/adapters/AlertPreferencesLocalStorageAdapter.ts` — implements `IAlertPreferencesRepository`, stores under `mindease:alert-prefs:<userId>`, falls back to `DEFAULT_ALERT_PREFERENCES` on any read error (catch + warn)

## 3. Application Layer

- [x] 3.1 Create `src/application/useCases/RecordBrainState.ts` — writes `BrainStateValue` to `sessionStorage` under key `mindease:brain-state`
- [x] 3.2 Create `src/application/useCases/SaveAlertPreferences.ts` — validates with zod schema, calls `IAlertPreferencesRepository.save`
- [x] 3.3 Create `src/application/useCases/LoadAlertPreferences.ts` — calls `IAlertPreferencesRepository.load`, returns preferences
- [x] 3.4 Create `src/application/services/AlertEngineService.ts` — pure function `evaluate(trigger, brainState, preferences): AlertPayload`; channel determined by intensity; message looked up from `alertMessages.ts`
- [x] 3.5 Create `src/application/dtos/AlertPreferencesDTO.ts` — zod schema `alertPreferencesSchema` mirroring `AlertPreferences` interface (used by form validation)

## 4. Alert Message Copy

- [x] 4.1 Create `src/lib/alertMessages.ts` — lookup table `Record<AlertTrigger, Record<BrainStateValue, Record<AlertTone, string>>>` covering all 5 triggers × 5 brain states × 4 tones (100 entries); include sensible defaults for missing keys

## 5. Context & Providers

- [x] 5.1 Create `src/presentation/contexts/BrainTodayContext.tsx` — `BrainStateValue | null` state, initialised from `sessionStorage`; export `BrainTodayProvider` and `useBrainToday` hook
- [x] 5.2 Create `src/presentation/contexts/AlertPreferencesContext.tsx` — loads preferences via `LoadAlertPreferences` on mount; exposes `preferences` and `savePreferences`; export `AlertPreferencesProvider` and `useAlertPreferences` hook
- [x] 5.3 Create `src/presentation/contexts/ActivitySignalsContext.tsx` — `ActivitySignals` state with updater functions (`recordTaskSwitch`, `setCurrentTask`, `resetSwitchCount`); export `ActivitySignalsProvider` and `useActivitySignals` hook; attach global `pointermove`/`keydown` listener to track `lastInteractionMs`

## 6. Brain Today Check-In Modal

- [x] 6.1 Create `src/presentation/components/BrainTodayModal.tsx` — shadcn `Dialog` (open when `useBrainToday()` returns `null`); renders five `BrainStateOption` buttons; "Pular por hoje" secondary action; fade-in ≤ 150 ms; focus trapped via Dialog; calls `RecordBrainState` on selection
- [x] 6.2 Update `src/presentation/components/ProtectedRoute.tsx` — wrap children with `BrainTodayModal` (renders above dashboard content when brain state is null)

## 7. Alert Engine Hook & UI

- [x] 7.1 Create `src/presentation/hooks/useAlertEngine.ts` — `useEffect` with 60-second `setInterval`; reads `ActivitySignalsContext` + `useAlertPreferences` + `useBrainToday`; respects per-trigger 15-min cool-down (`useRef` map); calls `AlertEngineService.evaluate`; dispatches via channel; accepts optional `clockFn` param for tests
- [x] 7.2 Create `src/presentation/components/CognitiveAlertBanner.tsx` — pulsing `Bell` icon (Lucide) in the header area; active state driven by `alertBannerActive`; pulse animation ≤ 1 Hz via Tailwind `animate-pulse`; auto-clears after 30 s or on user dismiss
- [x] 7.3 Create `src/presentation/components/CognitiveAlertModal.tsx` — non-blocking shadcn `Dialog`; displays alert message with a soft coloured border matching brain-state colour; single "Fechar" CTA; does NOT freeze background scroll
- [x] 7.4 Update `src/presentation/pages/Dashboard.tsx` — mount `useAlertEngine`; render `CognitiveAlertBanner` and `CognitiveAlertModal`

## 8. Activity Signals Integration

- [x] 8.1 Update `src/presentation/components/KanbanBoard.tsx` — call `useActivitySignals().recordTaskSwitch()` when a task changes columns; call `setCurrentTask({ startedAt: Date.now(), isComplex: task.isComplex })` when an active task is selected
- [x] 8.2 Update `src/App.tsx` — wrap the router with `BrainTodayProvider`, `AlertPreferencesProvider`, and `ActivitySignalsProvider` (in that order, outer to inner)

## 9. Cognitive Alerts Settings Page

- [x] 9.1 Create `src/presentation/pages/CognitiveAlertConfigPage.tsx` — multi-step form (step 1: triggers checkboxes; step 2: tone radio; step 3: intensity radio); "Próximo" / "Anterior" navigation; uses `react-hook-form` + `alertPreferencesSchema`; on final submit calls `useAlertPreferences().savePreferences`; success sonner toast
- [x] 9.2 Add route `/settings/cognitive-alerts` to `src/presentation/router.tsx` — nested inside `ProtectedRoute`, renders `CognitiveAlertConfigPage`
- [x] 9.3 Update `src/presentation/components/UserMenuDropdown.tsx` — add "Alertas Cognitivos" `DropdownMenuItem` that calls `navigate('/settings/cognitive-alerts')`

## 10. Tests

- [ ] ~~10.1 Add unit test `src/test/domain/AlertPreferences.test.ts`~~ (skipped) — covers `DEFAULT_ALERT_PREFERENCES` shape and `alertPreferencesSchema` zod validation (valid, invalid — empty triggers)
- [ ] ~~10.2 Add unit test `src/test/application/AlertEngineService.test.ts`~~ (skipped) — covers all three intensity→channel mappings; verifies message lookup for `ansioso` + `acolhedor` + `same-task-too-long`
- [ ] ~~10.3 Add unit test `src/test/infrastructure/AlertPreferencesLocalStorageAdapter.test.ts`~~ (skipped) — covers save/load round-trip, missing key fallback, corrupt JSON fallback (uses `localStorage` mock via `vitest`)
- [ ] ~~10.4 Add unit test `src/test/application/RecordBrainState.test.ts`~~ (skipped) — verifies `sessionStorage` write and that skipping writes nothing
- [ ] ~~10.5 Add component test `src/test/presentation/BrainTodayModal.test.tsx`~~ (skipped) — renders all five options; selecting one closes modal and calls `RecordBrainState`; "Pular" closes without storing state
- [ ] ~~10.6 Add component test `src/test/presentation/CognitiveAlertConfigPage.test.tsx`~~ (skipped) — step navigation; zod validation error on empty triggers; successful submit calls `savePreferences` and shows toast

## 11. Lint, Types & Final Polish

- [ ] 11.1 Run `pnpm check-types --filter web-host` — fix any TypeScript errors
- [ ] 11.2 Run `pnpm lint --filter web-host` — fix any ESLint errors
- [ ] 11.3 Run `pnpm test --filter web-host` — ensure all tests pass (green)
- [ ] 11.4 Manual smoke test: start `pnpm dev`, log in, verify "Cérebro Hoje" modal appears, select a state, navigate to `/settings/cognitive-alerts`, change intensity, confirm preferences persist on reload
