## ADDED Requirements

### Requirement: useAuth presentation hook

The system SHALL provide a `useAuth` hook in `presentation/hooks/useAuth.ts` that serves as the composition root. It SHALL instantiate (or import) a `SupabaseAuthRepository`, wire it to the application use cases, and expose the auth API via React Query. The hook SHALL return `{ user, loading, error, signIn, signUp, signOut, signInWithMagicLink }` — the same shape as the existing `useAuth` hook.

#### Scenario: Hook returns current user via React Query

- **WHEN** `useAuth()` is called
- **THEN** it SHALL use a React Query `useQuery` to fetch the current user via the `getUser` use case, with a 5-minute stale time

#### Scenario: signIn updates cache on success

- **WHEN** `signIn` is called and succeeds
- **THEN** the hook SHALL update the React Query user cache and invalidate the session query

#### Scenario: signOut clears cache

- **WHEN** `signOut` is called and succeeds
- **THEN** the hook SHALL set the user cache to `null` and remove session queries

#### Scenario: Auth state changes sync to cache

- **WHEN** Supabase emits an auth state change (SIGNED_IN or SIGNED_OUT)
- **THEN** the hook SHALL update the React Query user cache accordingly via the adapter's `onAuthStateChange`

#### Scenario: Loading state aggregates all mutations

- **WHEN** any mutation (signIn, signUp, signOut, signInWithMagicLink) is pending
- **THEN** `loading` SHALL be `true`

### Requirement: Auth component relocation

The system SHALL move the `Auth` component to `presentation/components/Auth.tsx`. The component SHALL import `SignIn` and `SignUp` from `presentation/components/` and render a `Toaster` for feedback. Its behavior and layout SHALL remain identical to the current implementation.

#### Scenario: Auth component toggle between SignIn and SignUp

- **WHEN** the user clicks the toggle link
- **THEN** the component SHALL switch between rendering `SignIn` and `SignUp`

#### Scenario: Auth component renders Toaster

- **WHEN** the Auth component mounts
- **THEN** it SHALL render a `Toaster` from `@repo/ui` for toast notifications

### Requirement: SignIn component relocation

The system SHALL move the `SignIn` component to `presentation/components/SignIn.tsx` and its sub-components (`SignInWithPassword`, `SignInWithMagicLink`) to `presentation/components/SignIn/`. All imports SHALL reference the new `presentation/hooks/useAuth` hook and `domain/valueObjects/authSchemas` for validation. The component behavior SHALL remain identical.

#### Scenario: SignIn renders tabs for password and magic link

- **WHEN** `SignIn` is rendered
- **THEN** it SHALL display tabs allowing the user to choose between password and magic link sign-in

#### Scenario: SignInWithPassword uses domain schema

- **WHEN** `SignInWithPassword` initializes its form
- **THEN** it SHALL use `loginSchema` imported from `domain/valueObjects/authSchemas`

#### Scenario: SignInWithMagicLink uses domain schema

- **WHEN** `SignInWithMagicLink` initializes its form
- **THEN** it SHALL use `magicLinkSchema` imported from `domain/valueObjects/authSchemas`

### Requirement: SignUp component relocation

The system SHALL move the `SignUp` component to `presentation/components/SignUp.tsx`. It SHALL import `signUpSchema` from `domain/valueObjects/authSchemas` and `useAuth` from `presentation/hooks/useAuth`. The component behavior SHALL remain identical.

#### Scenario: SignUp uses domain schema

- **WHEN** `SignUp` initializes its form
- **THEN** it SHALL use `signUpSchema` imported from `domain/valueObjects/authSchemas`

#### Scenario: SignUp calls useAuth for registration

- **WHEN** the user submits the sign-up form
- **THEN** the component SHALL call `useAuth().signUp()` from the presentation hook

### Requirement: Entry point imports updated

The system SHALL update `src/export.tsx` to import `Auth` from `presentation/components/Auth` and additionally export `useAuth` as a named export from `presentation/hooks/useAuth`. The `src/App.tsx` and `src/main.tsx` files SHALL update their imports to reference the new paths. The Module Federation exposed module path (`./auth` → `src/export.tsx`) SHALL remain unchanged.

#### Scenario: export.tsx default export unchanged

- **WHEN** the host app imports `auth/auth`
- **THEN** it SHALL receive the `Auth` component as the default export

#### Scenario: export.tsx exposes useAuth

- **WHEN** the host app imports `auth/useAuth` (or uses the named export)
- **THEN** it SHALL receive the `useAuth` hook from `presentation/hooks/useAuth`

### Requirement: Old files removed

The system SHALL delete the following files and directories after migration: `src/components/` (entire directory), `src/hooks/` (entire directory), `src/utils/` (entire directory), and `src/lib/` (entire directory). No code SHALL remain in these locations.

#### Scenario: No residual old files

- **WHEN** the migration is complete
- **THEN** the directories `src/components/`, `src/hooks/`, `src/utils/`, and `src/lib/` SHALL not exist

#### Scenario: Only presentation/ domain/ application/ infrastructure/ remain

- **WHEN** listing `src/` contents after migration
- **THEN** the only code directories SHALL be `domain/`, `application/`, `infrastructure/`, `presentation/`, plus the entry files (`App.tsx`, `main.tsx`, `export.tsx`, `index.css`)
