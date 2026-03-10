## ADDED Requirements

### Requirement: Estado de onboarding inicial por usuario

The system SHALL persist onboarding progress per authenticated user with explicit states pending, completed, and skipped. The system SHALL use persisted onboarding state to decide whether onboarding is shown at startup.

#### Scenario: Usuario novo inicia com estado pending

- **WHEN** a newly authenticated user has no onboarding state stored
- **THEN** the system initializes onboarding state as pending and routes the user to onboarding entry

#### Scenario: Onboarding concluido marca completed

- **WHEN** the user finishes the onboarding flow
- **THEN** the system persists onboarding state as completed and records completion timestamp

#### Scenario: Onboarding pulado marca skipped

- **WHEN** the user chooses to skip onboarding from an allowed step
- **THEN** the system persists onboarding state as skipped and routes the user to the main experience

### Requirement: Opcao de pular onboarding no fluxo inicial

The system SHALL provide an explicit skip action during initial onboarding. The skip action SHALL be non-blocking and SHALL not require completing all onboarding steps.

#### Scenario: Pular onboarding na primeira etapa

- **WHEN** the user selects Skip on the first onboarding step
- **THEN** the system stores skipped state and grants access to core app navigation immediately

#### Scenario: Pular onboarding em etapa intermediaria

- **WHEN** the user selects Skip on an intermediate onboarding step where skip is allowed
- **THEN** the system stores skipped state and exits onboarding without presenting additional mandatory steps

#### Scenario: Sessao futura respeita skipped

- **WHEN** a user with skipped state logs in again
- **THEN** the system does not auto-start onboarding and opens the main experience directly

### Requirement: Acao de refazer onboarding no menu de usuario

The system SHALL expose a Redo onboarding action in the user menu across supported applications. Triggering this action SHALL reset onboarding state to pending and start onboarding again without requiring account recreation.

#### Scenario: Menu exibe acao de refazer

- **WHEN** an authenticated user opens the user menu
- **THEN** the menu displays a visible Redo onboarding action with predictable label and focus behavior

#### Scenario: Refazer redefine estado para pending

- **WHEN** the user confirms the Redo onboarding action
- **THEN** the system updates onboarding state to pending and navigates to onboarding start

#### Scenario: Refazer apos estado completed ou skipped

- **WHEN** the user previously completed or skipped onboarding and then triggers Redo onboarding
- **THEN** the system allows restart of onboarding and does not block the flow based on prior state

### Requirement: Consistencia cross-app do estado de onboarding

The system SHALL read and honor the same persisted onboarding state in web-host, web-mfe-auth, and mobile applications. State transitions performed in one application SHALL be visible in the others for the same account.

#### Scenario: Pular no host reflete no mobile

- **WHEN** a user skips onboarding in web-host and then signs in on mobile
- **THEN** mobile reads skipped state and avoids auto-starting onboarding

#### Scenario: Refazer no mobile reflete no host

- **WHEN** a user triggers Redo onboarding in mobile and later opens web-host
- **THEN** web-host reads pending state and starts onboarding entry flow

#### Scenario: Concluir no mobile reflete no host

- **WHEN** a user completes onboarding in mobile and later opens web-host
- **THEN** web-host reads completed state and opens the main experience
