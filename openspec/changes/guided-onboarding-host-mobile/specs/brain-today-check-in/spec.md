## MODIFIED Requirements

### Requirement: Session check-in modal is shown once per browser session

Once a user is authenticated and enters a protected flow, the system SHALL evaluate guided onboarding status before rendering check-in. If onboarding is not completed, onboarding SHALL run first; after onboarding is completed, the system SHALL display the "Cerebro Hoje" modal once per browser session unless already answered.

#### Scenario: First visit with onboarding pending

- **WHEN** an authenticated user enters a protected flow and onboarding status is not `completed`
- **THEN** guided onboarding is shown first and `BrainTodayModal` is deferred until onboarding completion

#### Scenario: First visit with onboarding completed and no brain state in session

- **WHEN** an authenticated user enters a protected flow with onboarding status `completed` and no `sessionStorage` entry for `mindease:brain-state`
- **THEN** the `BrainTodayModal` is rendered before regular dashboard exploration

#### Scenario: Already answered this session

- **WHEN** the user navigates away and returns to the dashboard within the same browser session after already answering check-in
- **THEN** the `BrainTodayModal` is NOT shown again

#### Scenario: New session after page close

- **WHEN** the user closes the browser and reopens the app with onboarding already completed
- **THEN** `sessionStorage` is cleared and the modal appears again on the first protected-flow visit
