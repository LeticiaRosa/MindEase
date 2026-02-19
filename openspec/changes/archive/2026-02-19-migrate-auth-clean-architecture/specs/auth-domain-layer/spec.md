## ADDED Requirements

### Requirement: User entity type

The system SHALL define a `User` type in `domain/entities/User.ts` that represents an authenticated user. The type SHALL contain `id` (string), `email` (string), and an optional `user_metadata` object with an optional `full_name` string. The type SHALL have zero external dependencies — only plain TypeScript.

#### Scenario: User type is importable without framework dependencies

- **WHEN** a module imports `User` from `domain/entities/User.ts`
- **THEN** the import resolves without requiring React, Supabase, or any runtime dependency

#### Scenario: User type matches existing shape

- **WHEN** comparing the new `User` type to the existing `src/utils/database.types.ts` `User` type
- **THEN** both types are structurally identical (same fields, same optionality)

### Requirement: AuthResult response type

The system SHALL define a generic `AuthResult<T>` type in `domain/entities/AuthResult.ts` that represents the outcome of any auth operation. It SHALL be a discriminated union with `success: true` carrying an optional data payload of type `T`, and `success: false` carrying an `error` object with `message` (string) and `status` (number).

#### Scenario: Successful result shape

- **WHEN** an auth operation succeeds
- **THEN** the result SHALL match `{ success: true; data?: T }`

#### Scenario: Failed result shape

- **WHEN** an auth operation fails
- **THEN** the result SHALL match `{ success: false; error: { message: string; status: number } }`

### Requirement: Auth repository interface

The system SHALL define an `IAuthRepository` interface in `domain/interfaces/IAuthRepository.ts` that declares the contract for all auth operations. The interface SHALL include methods: `signIn(email, password)`, `signUp(email, password, fullName?)`, `signOut()`, `signInWithMagicLink(email, redirectTo?)`, `getUser()`, and `getSession()`. All methods SHALL return Promises. The interface SHALL have zero framework dependencies.

#### Scenario: Repository interface methods

- **WHEN** a class implements `IAuthRepository`
- **THEN** it SHALL implement all six methods: `signIn`, `signUp`, `signOut`, `signInWithMagicLink`, `getUser`, `getSession`

#### Scenario: Framework independence

- **WHEN** the `IAuthRepository` file is analyzed for imports
- **THEN** it SHALL import only from the `domain/` layer (entities and value objects) — no React, Supabase, or third-party imports

### Requirement: Validation schemas as value objects

The system SHALL define Zod validation schemas in `domain/valueObjects/authSchemas.ts`: `loginSchema` (email + password), `signUpSchema` (email + password + confirmPassword + fullName, with password match refinement), and `magicLinkSchema` (email only). Each schema SHALL export its inferred TypeScript type. Zod is the only allowed external dependency in this file.

#### Scenario: Login schema validation

- **WHEN** validating data with `loginSchema`
- **THEN** it SHALL require a valid email and a password with minimum 6 characters

#### Scenario: Sign-up schema validation with password mismatch

- **WHEN** `signUpSchema` receives mismatched `password` and `confirmPassword`
- **THEN** validation SHALL fail with an error on the `confirmPassword` path

#### Scenario: Magic link schema validation

- **WHEN** validating data with `magicLinkSchema`
- **THEN** it SHALL require only a valid email
