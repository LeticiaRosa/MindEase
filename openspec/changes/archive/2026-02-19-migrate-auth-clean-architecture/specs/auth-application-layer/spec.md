## ADDED Requirements

### Requirement: SignIn use case

The system SHALL provide a `signIn` use case function in `application/useCases/signIn.ts` that accepts an `IAuthRepository` instance, an email, and a password. It SHALL call `repository.signIn()` and return an `AuthResult<User>`. On success it SHALL return the user. On failure it SHALL normalize the error into `{ message, status }` format. The function SHALL have no React or infrastructure imports.

#### Scenario: Successful sign-in

- **WHEN** `signIn` is called with valid credentials and the repository returns a user
- **THEN** the use case SHALL return `{ success: true, data: user }`

#### Scenario: Failed sign-in

- **WHEN** `signIn` is called and the repository throws or returns an error
- **THEN** the use case SHALL return `{ success: false, error: { message, status } }`

### Requirement: SignUp use case

The system SHALL provide a `signUp` use case function in `application/useCases/signUp.ts` that accepts an `IAuthRepository` instance, an email, a password, and an optional fullName. It SHALL call `repository.signUp()` and return an `AuthResult<User>`. Error normalization SHALL follow the same pattern as `signIn`.

#### Scenario: Successful sign-up

- **WHEN** `signUp` is called with valid data and the repository creates the user
- **THEN** the use case SHALL return `{ success: true, data: user }`

#### Scenario: Failed sign-up

- **WHEN** `signUp` is called and the repository returns an error
- **THEN** the use case SHALL return `{ success: false, error: { message, status } }`

### Requirement: SignOut use case

The system SHALL provide a `signOut` use case function in `application/useCases/signOut.ts` that accepts an `IAuthRepository` instance. It SHALL call `repository.signOut()` and return an `AuthResult<void>`.

#### Scenario: Successful sign-out

- **WHEN** `signOut` is called and the repository succeeds
- **THEN** the use case SHALL return `{ success: true }`

#### Scenario: Failed sign-out

- **WHEN** `signOut` is called and the repository throws
- **THEN** the use case SHALL return `{ success: false, error: { message, status } }`

### Requirement: SignInWithMagicLink use case

The system SHALL provide a `signInWithMagicLink` use case function in `application/useCases/signInWithMagicLink.ts` that accepts an `IAuthRepository` instance, an email, and an optional redirectTo URL. It SHALL call `repository.signInWithMagicLink()` and then call `repository.trackMagicLinkRequest(email)` on success. It SHALL return an `AuthResult<void>`. If the tracking call fails, it SHALL log a warning but still return success.

#### Scenario: Successful magic link send

- **WHEN** `signInWithMagicLink` is called and the OTP is sent successfully
- **THEN** the use case SHALL return `{ success: true }` and call `trackMagicLinkRequest`

#### Scenario: Magic link tracking failure is non-fatal

- **WHEN** `signInWithMagicLink` succeeds but `trackMagicLinkRequest` throws
- **THEN** the use case SHALL still return `{ success: true }` and log a warning

#### Scenario: Failed magic link send

- **WHEN** `signInWithMagicLink` is called and the repository returns an error
- **THEN** the use case SHALL return `{ success: false, error: { message, status } }`

### Requirement: Auth input DTOs

The system SHALL define input DTO types in `application/dtos/AuthInput.ts`: `SignInInput` (email, password), `SignUpInput` (email, password, fullName?), and `MagicLinkInput` (email, redirectTo?). These types SHALL be plain TypeScript interfaces with no external dependencies.

#### Scenario: DTO types align with use case parameters

- **WHEN** comparing DTO fields to use case function parameters
- **THEN** each use case SHALL accept its corresponding DTO or equivalent parameters
