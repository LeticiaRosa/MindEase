## 1. Database and security foundation

- [x] 1.1 Create Supabase migration for user preferences and onboarding state (pending/completed/skipped) with user_id primary key, timestamps, and supporting indexes
- [x] 1.2 Add and validate RLS policies so users can select/insert/update only their own preferences record
- [x] 1.3 Add database constraints/defaults to keep onboarding state valid and backward-compatible for existing users
- [x] 1.4 Run migration in development and verify schema + RLS with targeted SQL checks and advisor scan

## 2. Shared domain and infrastructure contracts

- [x] 2.1 Define shared TypeScript domain models for cognitive preferences and onboarding state transitions
- [x] 2.2 Implement Supabase repository methods for get preferences, upsert preferences, and update onboarding state
- [x] 2.3 Implement bootstrap reconciliation strategy (remote-first with temporary local fallback and canonical remote recovery)
- [x] 2.4 Add error mapping and non-intrusive feedback contracts for read/write failures

## 3. Web-host integration

- [x] 3.1 Load persisted preferences during authenticated bootstrap and apply them before preference-dependent UI state
- [x] 3.2 Persist user preference changes via repository upsert and invalidate stale local cache after remote success
- [x] 3.3 Add skip onboarding action in initial onboarding flow and persist skipped state
- [x] 3.4 Add redo onboarding menu action that resets state to pending and routes user to onboarding start

## 4. Web-mfe-auth integration

- [x] 4.1 Sync onboarding state checks in auth flow so login redirects respect pending/completed/skipped
- [x] 4.2 Ensure onboarding completion and skip transitions are persisted through shared repository contracts
- [ ] 4.3 Verify auth boundary behavior does not regress when onboarding is reset from other apps

## 5. Mobile integration

- [x] 5.1 Load and apply persisted preferences on mobile bootstrap with the same defaults and fallback behavior as web
- [x] 5.2 Persist preference updates from mobile using upsert and confirm cross-app consistency with web-host
- [x] 5.3 Add skip onboarding behavior in mobile onboarding flow and persist skipped state
- [x] 5.4 Add redo onboarding action in mobile user menu and restart onboarding from pending state

## 6. Cross-app validation and quality

- [ ] 6.1 Add tests for preferences persistence and synchronization across web-host, web-mfe-auth, and mobile
- [x] 6.2 Add tests for onboarding transitions: pending -> completed, pending -> skipped, and completed/skipped -> pending via redo
- [ ] 6.3 Add tests for bootstrap fallback and remote reconciliation without blocking core app usage
- [x] 6.4 Run lint, type-check, and targeted test suites for changed packages and fix regressions

## 7. Rollout and observability

- [x] 7.1 Introduce guarded rollout strategy (feature flag or staged enablement) for remote preference bootstrap
- [x] 7.2 Add telemetry/logging for preference read/write failures and onboarding transition errors
- [x] 7.3 Document migration, rollback steps, and operational checks for production rollout
