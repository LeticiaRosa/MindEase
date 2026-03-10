# Supabase Preferences Rollout

## Scope

This rollout enables remote persistence of cognitive preferences and onboarding state in table `public.user_cognitive_preferences`.

## Migration Applied

- `create_user_cognitive_preferences`
- `add_onboarding_current_step`

## Rollout Flag

- Web: `VITE_ENABLE_REMOTE_PREFERENCES_SYNC` (`true` by default)
- Mobile: `EXPO_PUBLIC_ENABLE_REMOTE_PREFERENCES_SYNC` (`true` by default)

Set these to `false` to force local fallback only.

## Pre-deploy Checks

1. Confirm table exists and columns are present.
2. Confirm RLS policies exist for `SELECT`, `INSERT`, `UPDATE`.
3. Confirm apps have valid Supabase env variables.
4. Run:
   - `pnpm --filter web-host lint && pnpm --filter web-host check-types`
   - `pnpm --filter web-mfe-auth lint && pnpm --filter web-mfe-auth check-types`
   - `pnpm --filter @mindease/mobile lint && pnpm --filter @mindease/mobile check-types`

## Operational Verification

1. Sign in on web-host, change preferences, reload, confirm persisted values.
2. Sign in on mobile with same account, confirm same values are loaded.
3. Skip onboarding on one app, confirm onboarding is not auto-shown on the other.
4. Trigger "Refazer onboarding" and confirm onboarding state becomes `pending` and flow starts.

## Rollback Plan

1. Set rollout flags to `false` in web and mobile.
2. Redeploy apps.
3. Keep local storage/AsyncStorage fallback active (already implemented).
4. If needed, inspect logs tagged:
   - `[ThemePreferencesContext] remote-hydration-failed`
   - `[ThemePreferencesContext] remote-save-failed`
   - `[OnboardingContext] remote-load-failed`
   - `[OnboardingContext] remote-save-failed`

## Notes

- Current implementation keeps local storage as immediate fallback.
- Remote sync failures are non-blocking and do not prevent core usage.
