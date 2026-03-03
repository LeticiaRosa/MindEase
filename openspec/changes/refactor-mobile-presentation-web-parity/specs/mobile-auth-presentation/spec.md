## ADDED Requirements

### Requirement: Auth screens use decomposed tabbed components

The mobile auth flow SHALL present sign-in via a tabbed interface with two modes: password-based sign-in and magic-link sign-in. Each mode SHALL be implemented as a separate component (`SignInWithPassword`, `SignInWithMagicLink`) rendered within a `SignIn` tab wrapper. The route file `login.tsx` SHALL be a thin wrapper that renders `<SignIn />`.

#### Scenario: Tab wrapper renders two modes

- **WHEN** the login screen mounts
- **THEN** the `SignIn` component renders two selectable tabs labelled "Senha" and "Link Mágico", with "Senha" active by default

#### Scenario: Switching tabs preserves no state leak

- **WHEN** the user types an email in the password tab, switches to the magic-link tab, and switches back
- **THEN** the password form is reset to its initial state (no stale data carried over)

#### Scenario: Route file is a thin wrapper

- **WHEN** `app/(auth)/login.tsx` is loaded
- **THEN** it renders only `<SignIn />` with no inline form logic, no direct repository imports, and no use-case instantiation

---

### Requirement: SignInWithPassword uses react-hook-form with zod validation

The `SignInWithPassword` component SHALL render email and password fields using `react-hook-form` `Controller` pattern with `zodResolver(signInSchema)`. Submission SHALL call `useAuth().signIn(email, password)`.

#### Scenario: Validation errors shown inline

- **WHEN** the user submits with an empty email field
- **THEN** an inline error message "Email inválido" is displayed below the email input

#### Scenario: Successful sign-in navigates to dashboard

- **WHEN** the user submits valid credentials and `signIn` resolves successfully
- **THEN** `router.replace("/(app)/dashboard")` is called

#### Scenario: Server error displayed to user

- **WHEN** `signIn` returns `{ success: false, error: { message } }`
- **THEN** an error message is displayed below the form (not an alert dialog)

#### Scenario: Loading state disables submit

- **WHEN** the sign-in mutation is pending
- **THEN** the submit button is disabled and shows a loading indicator

---

### Requirement: SignInWithMagicLink renders email form with success state

The `SignInWithMagicLink` component SHALL render an email field with `zodResolver(magicLinkSchema)`. After successful submission, it SHALL display a success confirmation with instructions, matching `web-mfe-auth`'s pattern.

#### Scenario: Initial state shows email form

- **WHEN** the magic-link tab is active and no link has been sent
- **THEN** an email input and "Enviar link" button are rendered

#### Scenario: Success state replaces form

- **WHEN** `signInWithMagicLink` resolves successfully
- **THEN** the form is replaced with a checkmark icon, "Link enviado!" heading, and step-by-step instructions explaining to check email

#### Scenario: Resend option available after success

- **WHEN** the success state is displayed
- **THEN** a "Enviar novamente" button allows the user to restart the magic-link flow

---

### Requirement: SignUp component mirrors web-mfe-auth registration form

The `SignUp` component SHALL render four fields (full name, email, password, confirm password) using `react-hook-form` with `zodResolver(signUpSchema)`. The route file `register.tsx` SHALL be a thin wrapper rendering `<SignUp />`.

#### Scenario: Password mismatch shows validation error

- **WHEN** the user enters different values for password and confirmPassword and submits
- **THEN** an inline error "As senhas não coincidem" is shown

#### Scenario: Successful registration navigates to dashboard

- **WHEN** `signUp` resolves successfully
- **THEN** `router.replace("/(app)/dashboard")` is called

#### Scenario: Link to login is present

- **WHEN** the registration screen renders
- **THEN** a "Já tem conta? Entrar" link navigates to the login screen

---

### Requirement: Auth components follow cognitive accessibility standards

All auth form components SHALL use generous spacing between fields, large touch targets (minimum 48dp height for inputs and buttons), clear focus indicators, and no distracting animations.

#### Scenario: Input fields meet minimum touch target

- **WHEN** any auth form renders
- **THEN** every `TextInput` and `TouchableOpacity` has a minimum height of 48 density-independent pixels

#### Scenario: Error messages are non-intrusive

- **WHEN** a validation error is displayed
- **THEN** it appears as inline text below the field in the destructive colour, not as a modal or alert dialog

#### Scenario: Form uses theme tokens for consistent styling

- **WHEN** any auth component renders
- **THEN** it uses `resolvedColors`, `resolvedFontSizes`, and `resolvedSpacing` from `useTheme()` context (not hardcoded values from static imports)
