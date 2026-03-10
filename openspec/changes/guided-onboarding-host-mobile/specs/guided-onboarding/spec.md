## ADDED Requirements

### Requirement: First authenticated access SHALL start guided onboarding before dashboard exploration

On first authenticated access, the system SHALL guide the user through a controlled onboarding flow before normal dashboard exploration, in order to reduce discovery overload.

#### Scenario: First authenticated session starts onboarding

- **WHEN** an authenticated user enters the protected area and onboarding status is `not_started`
- **THEN** the application shows the guided onboarding flow instead of the regular dashboard content

#### Scenario: Returning user skips onboarding gate

- **WHEN** an authenticated user enters the protected area and onboarding status is `completed`
- **THEN** the application bypasses onboarding and renders the normal app flow

### Requirement: Onboarding SHALL provide three mandatory guided steps

The onboarding flow SHALL enforce a progressive three-step sequence with clear progress indication: complexity selection, visual preference setup, and first task creation.

#### Scenario: Step sequence is progressive

- **WHEN** the user is in guided onboarding
- **THEN** the user sees one step at a time, with a visible indicator of current step and total steps

#### Scenario: User cannot complete flow without all mandatory steps

- **WHEN** the user attempts to finish onboarding before completing all mandatory steps
- **THEN** the system keeps onboarding in progress and requires completion of remaining steps

### Requirement: Onboarding progress SHALL persist and resume across app restarts

The system SHALL persist onboarding lifecycle state (`not_started`, `in_progress`, `completed`) and current step so interrupted users can resume without losing progress.

#### Scenario: Resume from interrupted step

- **WHEN** onboarding is `in_progress` and the user reloads or reopens the app
- **THEN** the onboarding flow resumes at the persisted current step

#### Scenario: Completed onboarding is not shown again

- **WHEN** onboarding status is persisted as `completed`
- **THEN** onboarding is not automatically shown again on subsequent authenticated entries

### Requirement: Onboarding actions SHALL reuse existing preference and task domain flows

Onboarding step actions SHALL use the same underlying application/domain contracts as existing app settings and task creation to keep behavior consistent between onboarding and regular usage.

#### Scenario: Complexity and visual settings are applied globally

- **WHEN** the user sets complexity, theme, font size, or spacing during onboarding
- **THEN** those settings are persisted using the same preference flows used outside onboarding

#### Scenario: First task creation follows existing task rules

- **WHEN** the user creates the first task in onboarding
- **THEN** task validation and persistence follow the same task creation rules used by the normal task flow

### Requirement: Guided onboarding SHALL be functionally equivalent on web-host and mobile

The onboarding capability SHALL provide the same mandatory outcomes on web-host and mobile, while allowing platform-specific UI components.

#### Scenario: Equivalent outcomes across platforms

- **WHEN** users complete onboarding on web-host and mobile
- **THEN** both platforms persist equivalent onboarding completion and the same user-configured preferences and first-task result

#### Scenario: Platform-specific UI keeps same sequence contract

- **WHEN** implementation differs between React web components and React Native screens
- **THEN** both implementations still enforce the same three-step progression and completion criteria
