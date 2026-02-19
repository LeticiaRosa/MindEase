## ADDED Requirements

### Requirement: Supabase client configuration

The system SHALL provide a Supabase client instance in `infrastructure/api/clients/supabaseClient.ts`. It SHALL read `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` from environment variables and create a single `SupabaseClient` instance via `createClient()`. The module SHALL export this client as the default export.

#### Scenario: Client creation with environment variables

- **WHEN** the module is imported
- **THEN** it SHALL create a Supabase client using the `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` environment variables

#### Scenario: Singleton behavior

- **WHEN** multiple modules import the Supabase client
- **THEN** they SHALL all receive the same client instance (ES module singleton)

### Requirement: SupabaseAuthRepository adapter

The system SHALL provide a `SupabaseAuthRepository` class in `infrastructure/adapters/SupabaseAuthRepository.ts` that implements the `IAuthRepository` interface from the domain layer. It SHALL use the Supabase client from `infrastructure/api/clients/supabaseClient.ts` for all operations.

#### Scenario: signIn delegates to Supabase

- **WHEN** `signIn(email, password)` is called
- **THEN** the adapter SHALL call `supabase.auth.signInWithPassword({ email, password })` and return the auth response

#### Scenario: signUp delegates to Supabase

- **WHEN** `signUp(email, password, fullName)` is called
- **THEN** the adapter SHALL call `supabase.auth.signUp()` with the email, password, and `data: { full_name: fullName }` in options

#### Scenario: signOut delegates to Supabase

- **WHEN** `signOut()` is called
- **THEN** the adapter SHALL call `supabase.auth.signOut()`

#### Scenario: signInWithMagicLink delegates to Supabase OTP

- **WHEN** `signInWithMagicLink(email, redirectTo)` is called
- **THEN** the adapter SHALL call `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } })`

#### Scenario: getUser returns domain User

- **WHEN** `getUser()` is called
- **THEN** the adapter SHALL call `supabase.auth.getUser()` and return the user mapped to the domain `User` type, or `null`

#### Scenario: getSession returns session

- **WHEN** `getSession()` is called
- **THEN** the adapter SHALL call `supabase.auth.getSession()` and return the session or `null`

#### Scenario: trackMagicLinkRequest inserts tracking record

- **WHEN** `trackMagicLinkRequest(email)` is called
- **THEN** the adapter SHALL insert a row into the `magic_link_requests` table with the email and `used: false`

### Requirement: Auth state change listener

The system SHALL provide an `onAuthStateChange` method or utility in the infrastructure adapter that wraps `supabase.auth.onAuthStateChange`. This SHALL allow the presentation layer to subscribe to auth state transitions (SIGNED_IN, SIGNED_OUT) without directly importing Supabase.

#### Scenario: Auth state subscription

- **WHEN** the presentation layer calls `onAuthStateChange(callback)`
- **THEN** the adapter SHALL register the callback with Supabase's `onAuthStateChange` and return an unsubscribe function

#### Scenario: SIGNED_IN event

- **WHEN** a user signs in and Supabase emits a SIGNED_IN event
- **THEN** the callback SHALL receive the event type and the user (mapped to domain `User` type)

#### Scenario: SIGNED_OUT event

- **WHEN** a user signs out and Supabase emits a SIGNED_OUT event
- **THEN** the callback SHALL receive the event type and `null` for the user
