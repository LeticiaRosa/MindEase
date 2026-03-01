## ADDED Requirements

### Requirement: Supabase client is initialised once with SecureStore session persistence

The mobile app SHALL create a single Supabase client instance configured to use `expo-secure-store` as the storage adapter so that the authenticated session survives app restarts.

#### Scenario: Session survives app restart

- **WHEN** the user has previously authenticated and closes and re-opens the app
- **THEN** `supabaseClient.auth.getSession()` returns a valid session without requiring the user to log in again

#### Scenario: No duplicate client instances

- **WHEN** any module in `apps/mobile` imports the Supabase client
- **THEN** it receives the same singleton instance created in `infrastructure/api/clients/supabaseClient.ts`

---

### Requirement: IAuthRepository interface matches the web contract

The mobile domain SHALL expose an `IAuthRepository` interface identical in shape to the one in `web-mfe-auth`, covering `signIn`, `signUp`, `signOut`, `signInWithMagicLink`, `getUser`, `getSession`, `trackMagicLinkRequest`, and `onAuthStateChange`.

#### Scenario: Interface is satisfied by SupabaseAuthRepository

- **WHEN** `SupabaseAuthRepository` is compiled against `IAuthRepository`
- **THEN** TypeScript reports zero type errors

---

### Requirement: SupabaseAuthRepository implements sign-in with password

The `SupabaseAuthRepository` SHALL implement `signIn(email, password)` and return an `AuthResult<User>` with `success: true` and the authenticated user on success, or `success: false` with an error message on failure.

#### Scenario: Valid credentials

- **WHEN** the user submits correct email and password
- **THEN** `signIn` returns `{ success: true, data: User }`

#### Scenario: Invalid credentials

- **WHEN** the user submits an incorrect password
- **THEN** `signIn` returns `{ success: false, error: { message: string, status: 400 } }`

---

### Requirement: SupabaseAuthRepository implements sign-up

The `SupabaseAuthRepository` SHALL implement `signUp(email, password, fullName?)` and return an `AuthResult<User>`. On success it SHALL also store `full_name` in Supabase user metadata.

#### Scenario: Successful registration

- **WHEN** the user provides a valid email and a password meeting strength rules
- **THEN** `signUp` returns `{ success: true, data: User }` and Supabase creates the account

#### Scenario: Duplicate email

- **WHEN** the user tries to register with an already-registered email
- **THEN** `signUp` returns `{ success: false, error: { message: string } }`

---

### Requirement: SupabaseAuthRepository implements magic-link sign-in

The `SupabaseAuthRepository` SHALL implement `signInWithMagicLink(email, redirectTo?)` that sends a one-time link to the user's email. The default `redirectTo` SHALL be the Expo deep-link `mindease://magic-link-callback`.

#### Scenario: Magic link email sent

- **WHEN** the user submits their email on the magic-link form
- **THEN** `signInWithMagicLink` returns `{ success: true }` and Supabase dispatches the email

#### Scenario: Invalid email

- **WHEN** the user submits a malformed email
- **THEN** `signInWithMagicLink` returns `{ success: false, error: { message: string } }`

---

### Requirement: Magic-link callback screen exchanges the token

The app SHALL register the route `(auth)/magic-link-callback` in expo-router. When the app is opened via the `mindease://magic-link-callback` deep link, that screen SHALL extract the `access_token` and `refresh_token` query parameters and call `supabaseClient.auth.setSession()`, then redirect to `/(app)/dashboard`.

#### Scenario: Valid tokens in deep link

- **WHEN** the app is launched from a magic-link email containing valid tokens
- **THEN** the session is established and the user is redirected to the Dashboard screen

#### Scenario: Missing or expired tokens

- **WHEN** the deep-link URL contains no tokens or expired tokens
- **THEN** the user sees an error message and a link back to the Login screen

---

### Requirement: useAuth hook exposes session state reactively

The mobile app SHALL provide a `useAuth` hook (in `presentation/hooks/useAuth.ts`) that returns `{ user, session, isLoading }` and re-renders consumers whenever the auth state changes.

#### Scenario: Loading state on mount

- **WHEN** the app first mounts
- **THEN** `isLoading` is `true` until the initial session check completes

#### Scenario: User available after sign-in

- **WHEN** authentication succeeds
- **THEN** `useAuth().user` is non-null

#### Scenario: User is null after sign-out

- **WHEN** the user signs out
- **THEN** `useAuth().user` is `null`

---

### Requirement: Unauthenticated users are redirected to the Login screen

The expo-router layout for the `(app)` group SHALL redirect to `/(auth)/login` if no active session exists, preventing access to protected screens.

#### Scenario: Access attempt without session

- **WHEN** an unauthenticated user navigates to `/(app)/dashboard`
- **THEN** expo-router redirects them to `/(auth)/login` before rendering the screen

#### Scenario: Authenticated user is not redirected

- **WHEN** an authenticated user navigates to `/(app)/dashboard`
- **THEN** the Dashboard screen renders normally

---

### Requirement: LoginScreen validates input before submission

The `LoginScreen` SHALL use `react-hook-form` with a `zod` schema requiring a valid email and a non-empty password. Submit is disabled while fields are invalid.

#### Scenario: Empty email

- **WHEN** the user taps "Entrar" with no email entered
- **THEN** an inline validation message is shown beneath the email field and the request is not sent

#### Scenario: Valid form submission

- **WHEN** the user fills both fields correctly and taps "Entrar"
- **THEN** `signIn` use-case is called and a loading indicator is shown while the request is in flight

---

### Requirement: RegisterScreen validates input before submission

The `RegisterScreen` SHALL use `react-hook-form` with a `zod` schema requiring a valid email, a password with minimum 8 characters, and optionally a full name. Submit is disabled while fields are invalid.

#### Scenario: Short password

- **WHEN** the user enters a password shorter than 8 characters
- **THEN** an inline validation message is shown and the request is not sent

#### Scenario: Successful registration

- **WHEN** the user fills all required fields correctly and taps "Criar conta"
- **THEN** `signUp` use-case is called and on success the user is redirected to `/(app)/dashboard`

---

### Requirement: Auth screens meet cognitive accessibility standards

Login and Register screens SHALL use spacious layouts, large readable labels (minimum `fontSizes.base` from `@repo/ui/theme`), visible focus indicators, and non-intrusive inline error messages. No modal dialogs or blocking overlays SHALL be used for validation feedback.

#### Scenario: Error feedback is inline

- **WHEN** a validation or server error occurs
- **THEN** the message appears as text directly below the relevant field, not in a dialog

#### Scenario: No animation on error

- **WHEN** an error is shown
- **THEN** no shake, bounce, or slide animations are applied to the form
