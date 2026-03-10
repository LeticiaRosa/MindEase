# Mobile Supabase Deep Link setup

This project uses `mindease://auth/callback` for Supabase email confirmation and magic link flows.

## Required config

1. Expo scheme in `app.json`:

```json
{
  "expo": {
    "scheme": "mindease"
  }
}
```

2. Supabase Dashboard:

- Authentication -> URL Configuration -> Redirect URLs
- Add: `mindease://auth/callback`

## Runtime behavior

- Sign up and magic link both send `emailRedirectTo` using `Linking.createURL("auth/callback", { scheme: "mindease" })`.
- Callback route is `app/auth/callback.tsx`.
- Legacy route `app/(auth)/magic-link-callback.tsx` is still available for backwards compatibility.

## Important note for Expo Go

Custom deep links are unreliable in Expo Go. Use one of these options:

- `npx expo run:android`
- `npx expo start --dev-client`
- EAS build
