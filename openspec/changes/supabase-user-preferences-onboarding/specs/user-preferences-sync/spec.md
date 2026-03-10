## ADDED Requirements

### Requirement: Persistencia central de preferencias por usuario

The system SHALL store cognitive preferences in Supabase with one canonical record per authenticated user. The record SHALL include at least font size preference, spacing preference, contrast preference, and complexity mode preference. The system SHALL enforce user ownership for all preference reads and writes.

#### Scenario: Primeiro salvamento cria registro canonico

- **WHEN** an authenticated user saves preferences for the first time
- **THEN** the system persists a canonical preferences record in Supabase keyed by the user identifier

#### Scenario: Atualizacao sobrescreve preferencias existentes

- **WHEN** an authenticated user changes any preference and confirms save
- **THEN** the system updates the same canonical record without creating duplicate user records

#### Scenario: Isolamento por usuario

- **WHEN** user A attempts to read or update user B preferences through application flows
- **THEN** the system denies access and only allows operations over the authenticated user own record

### Requirement: Aplicacao consistente de preferencias entre aplicacoes

The system SHALL load persisted preferences during bootstrap in web-host, web-mfe-auth, and mobile applications. The system SHALL apply the same persisted values across applications so that cognitive settings remain consistent between sessions and devices.

#### Scenario: Preferencias salvas no host aparecem no mobile

- **WHEN** a user updates preferences in web-host and later opens the mobile app with the same account
- **THEN** the mobile app loads and applies the updated persisted preferences from Supabase

#### Scenario: Preferencias salvas no mobile aparecem no host

- **WHEN** a user updates preferences in the mobile app and then opens web-host with the same account
- **THEN** web-host loads and applies the updated persisted preferences from Supabase

#### Scenario: Sem preferencias existentes aplica defaults acessiveis

- **WHEN** an authenticated user has no persisted preferences record
- **THEN** each application applies the same accessible default preferences and creates persisted state on first explicit save

### Requirement: Bootstrap com fallback local nao intrusivo

The system SHALL attempt to fetch remote preferences at app startup before finalizing preference-dependent UI state. If remote fetch is temporarily unavailable, the system SHALL apply a local fallback and reconcile with Supabase when connectivity is restored.

#### Scenario: Leitura remota bem-sucedida no bootstrap

- **WHEN** the app starts and Supabase preferences fetch succeeds
- **THEN** the system applies remote preferences before rendering preference-dependent controls

#### Scenario: Falha temporaria usa fallback local

- **WHEN** the app starts and Supabase preferences fetch fails due to transient network or service error
- **THEN** the system applies local fallback preferences and presents non-intrusive feedback without blocking app usage

#### Scenario: Reconciliacao apos restaurar conectividade

- **WHEN** connectivity is restored after a bootstrap fallback was used
- **THEN** the system fetches remote preferences, reconciles state, and keeps the canonical Supabase record authoritative
