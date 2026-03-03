## ADDED Requirements

### Requirement: Query-based auth state management
The mobile `useAuth` hook SHALL use `@tanstack/react-query` to manage auth state. A `useQuery` call with key `["auth", "user"]` SHALL fetch the current user via the auth repository's `getUser()` method. The hook SHALL NOT use React context for auth state.

#### Scenario: Initial user load on app start
- **WHEN** any component calls `useAuth()` for the first time
- **THEN** the hook SHALL issue a query via `repository.getUser()` and return `{ user: null, loading: true }` until resolved

#### Scenario: User is authenticated
- **WHEN** `getUser()` resolves with a valid `User` object
- **THEN** `useAuth()` SHALL return `{ user: User, loading: false }`

#### Scenario: User is not authenticated
- **WHEN** `getUser()` resolves with `null`
- **THEN** `useAuth()` SHALL return `{ user: null, loading: false }`

### Requirement: Sign-in mutation
The `useAuth` hook SHALL expose a `signIn(email, password)` method that calls the `signIn` use case through a `useMutation`. On success, the hook SHALL update the `["auth", "user"]` query cache with the returned user and invalidate `["auth", "session"]`.

#### Scenario: Successful password sign-in
- **WHEN** `signIn("user@example.com", "validpass")` is called and the use case returns `{ success: true, data: user }`
- **THEN** the mutation SHALL set query data for `["auth", "user"]` to the returned user and return `{ success: true, user }`

#### Scenario: Failed password sign-in
- **WHEN** `signIn("user@example.com", "wrongpass")` is called and the use case returns `{ success: false, error }`
- **THEN** the mutation SHALL return `{ success: false, error }` without modifying the user cache

### Requirement: Sign-up mutation
The `useAuth` hook SHALL expose a `signUp(email, password, fullName?)` method that calls the `signUp` use case through a `useMutation`. On success, the hook SHALL update the user query cache.

#### Scenario: Successful sign-up
- **WHEN** `signUp("new@example.com", "pass123", "Full Name")` is called and succeeds
- **THEN** the mutation SHALL set `["auth", "user"]` cache to the new user and return `{ success: true, user }`

#### Scenario: Failed sign-up
- **WHEN** `signUp` is called and the use case returns a failure
- **THEN** the mutation SHALL return `{ success: false, error }` without modifying the user cache

### Requirement: Sign-out mutation
The `useAuth` hook SHALL expose a `signOut()` method that calls the `signOut` use case through a `useMutation`. On success, the hook SHALL set the user cache to `null` and remove the session cache.

#### Scenario: Successful sign-out
- **WHEN** `signOut()` is called and succeeds
- **THEN** the mutation SHALL set `["auth", "user"]` to `null`, remove `["auth", "session"]` queries, and return `{ success: true }`

### Requirement: Magic-link mutation
The `useAuth` hook SHALL expose a `signInWithMagicLink(email, redirectTo?)` method that calls the `signInWithMagicLink` use case through a `useMutation`.

#### Scenario: Successful magic-link request
- **WHEN** `signInWithMagicLink("user@example.com")` is called and succeeds
- **THEN** the mutation SHALL return `{ success: true }` (no cache update — login completes via deep link callback)

#### Scenario: Failed magic-link request
- **WHEN** `signInWithMagicLink` is called and the use case returns a failure
- **THEN** the mutation SHALL return `{ success: false, error }`

### Requirement: Auth state change subscription
The `useAuth` hook SHALL subscribe to auth state changes via `repository.onAuthStateChange()` in a `useEffect`. When a `SIGNED_IN` event fires, the hook SHALL update the `["auth", "user"]` cache. When a `SIGNED_OUT` event fires, the hook SHALL set the user cache to `null`.

#### Scenario: External sign-in event (e.g., magic-link deep link)
- **WHEN** Supabase fires a `SIGNED_IN` auth event with a user
- **THEN** the hook's subscription SHALL call `queryClient.setQueryData(["auth", "user"], user)`

#### Scenario: External sign-out event
- **WHEN** Supabase fires a `SIGNED_OUT` auth event
- **THEN** the hook's subscription SHALL call `queryClient.setQueryData(["auth", "user"], null)`

### Requirement: AppState token refresh management
The `useAuth` hook SHALL manage Supabase auto-refresh based on React Native `AppState` transitions. When the app moves to foreground, auto-refresh SHALL start. When the app moves to background, auto-refresh SHALL stop.

#### Scenario: App comes to foreground
- **WHEN** `AppState` transitions from `inactive` or `background` to `active`
- **THEN** the hook SHALL call `supabaseClient.auth.startAutoRefresh()`

#### Scenario: App goes to background
- **WHEN** `AppState` transitions from `active` to `inactive` or `background`
- **THEN** the hook SHALL call `supabaseClient.auth.stopAutoRefresh()`

### Requirement: Aggregated loading state
The `useAuth` hook SHALL expose a `loading` boolean that is `true` when the user query is loading OR any auth mutation is pending.

#### Scenario: Loading during initial fetch
- **WHEN** the initial `getUser()` query is in-flight
- **THEN** `loading` SHALL be `true`

#### Scenario: Loading during sign-in
- **WHEN** the `signIn` mutation is pending
- **THEN** `loading` SHALL be `true`

#### Scenario: No operations pending
- **WHEN** neither the user query nor any mutation is in-flight
- **THEN** `loading` SHALL be `false`

### Requirement: AuthProvider removal
The `AuthProvider` context provider SHALL be removed from `app/_layout.tsx`. Auth state SHALL be accessed exclusively through the `useAuth()` hook.

#### Scenario: Root layout renders without AuthProvider
- **WHEN** the app root layout mounts
- **THEN** it SHALL render `QueryClientProvider > Stack` without an `AuthProvider` wrapper

### Requirement: Route screens use useAuth exclusively
Auth route screens (`login.tsx`, `register.tsx`, `magic-link-callback.tsx`) SHALL NOT instantiate `SupabaseAuthRepository` or call use cases directly. They SHALL use only `useAuth()` hook methods.

#### Scenario: Login screen submits password sign-in
- **WHEN** the user submits the password form on the login screen
- **THEN** the screen SHALL call `useAuth().signIn(email, password)` — not import the `signIn` use case directly

#### Scenario: Register screen submits sign-up
- **WHEN** the user submits the registration form
- **THEN** the screen SHALL call `useAuth().signUp(email, password, fullName)` — not import the `signUp` use case directly

#### Scenario: Magic-link callback processes deep link
- **WHEN** the magic-link callback screen receives a deep link URL
- **THEN** it SHALL use `useAuth()` to handle session establishment — not import `supabaseClient` directly

### Requirement: UserMenu uses useAuth for sign-out
The `UserMenu` component SHALL NOT instantiate `SupabaseAuthRepository` or call the `signOut` use case directly. It SHALL call `useAuth().signOut()`.

#### Scenario: User taps sign-out in UserMenu
- **WHEN** the user taps the sign-out option in `UserMenu`
- **THEN** the component SHALL call `useAuth().signOut()` and navigate to the login screen on success

### Requirement: setSession added to IAuthRepository
The `IAuthRepository` interface SHALL include a `setSession(accessToken: string, refreshToken: string): Promise<AuthResult<User>>` method. The `SupabaseAuthRepository` SHALL implement it by calling `supabaseClient.auth.setSession()`.

#### Scenario: Magic-link callback sets session via repository
- **WHEN** the magic-link callback screen extracts tokens from a deep link URL
- **THEN** it SHALL call the repository's `setSession` method (via a use case) instead of `supabaseClient.auth.setSession` directly

#### Scenario: setSession succeeds
- **WHEN** `setSession` is called with valid tokens
- **THEN** it SHALL return `{ success: true, data: user }` with the authenticated user

#### Scenario: setSession fails with invalid tokens
- **WHEN** `setSession` is called with invalid or expired tokens
- **THEN** it SHALL return `{ success: false, error: { message, status } }`
