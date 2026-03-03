## ADDED Requirements

### Requirement: GetTasks use case with constructor DI
A `GetTasks` class-based use case SHALL exist at `src/application/useCases/GetTasks.ts`. It SHALL accept an `ITaskRepository` via constructor injection and expose an `execute()` method that delegates to `repository.getTasks()`.

#### Scenario: GetTasks returns task list
- **WHEN** `getTasks.execute()` is called
- **THEN** it SHALL return the array of `Task` entities from the repository

#### Scenario: GetTasks repository throws error
- **WHEN** the underlying repository throws an error during `getTasks()`
- **THEN** the error SHALL propagate to the caller (no silent swallowing)

### Requirement: GetRoutines use case with constructor DI
A `GetRoutines` class-based use case SHALL exist at `src/application/useCases/GetRoutines.ts`. It SHALL accept an `IRoutineRepository` via constructor injection and expose an `execute()` method that delegates to `repository.getRoutines()`.

#### Scenario: GetRoutines returns routine list
- **WHEN** `getRoutines.execute()` is called
- **THEN** it SHALL return the array of `Routine` entities from the repository

#### Scenario: GetRoutines repository throws error
- **WHEN** the underlying repository throws an error during `getRoutines()`
- **THEN** the error SHALL propagate to the caller

### Requirement: HandleMagicLinkCallback use case
A `handleMagicLinkCallback` function-based use case SHALL exist at `src/application/useCases/handleMagicLinkCallback.ts`. It SHALL accept an `IAuthRepository`, `accessToken`, and `refreshToken`, then delegate to `repository.setSession()`.

#### Scenario: Successful session establishment
- **WHEN** `handleMagicLinkCallback(repository, accessToken, refreshToken)` is called with valid tokens
- **THEN** it SHALL return `{ success: true, data: user }` from the repository

#### Scenario: Failed session establishment
- **WHEN** `handleMagicLinkCallback` is called with invalid tokens
- **THEN** it SHALL return `{ success: false, error: { message, status } }`

#### Scenario: Unexpected error during callback
- **WHEN** an unexpected exception occurs during `setSession`
- **THEN** the use case SHALL catch it and return `{ success: false, error: { message: "<descriptive message>", status: 500 } }`

### Requirement: AuthInput DTO
An `AuthInput.ts` file SHALL exist at `src/application/dtos/AuthInput.ts` with interfaces `SignInInput`, `SignUpInput`, and `MagicLinkInput`, matching the structure of `web-mfe-auth/src/application/dtos/AuthInput.ts`.

#### Scenario: DTO types match web-mfe-auth
- **WHEN** a developer imports from `@/application/dtos/AuthInput`
- **THEN** `SignInInput` SHALL have `email: string` and `password: string`
- **THEN** `SignUpInput` SHALL have `email: string`, `password: string`, and `fullName?: string`
- **THEN** `MagicLinkInput` SHALL have `email: string` and `redirectTo?: string`

### Requirement: TaskDTOs
A `TaskDTOs.ts` file SHALL exist at `src/application/dtos/TaskDTOs.ts` with a `TaskDTO` interface and a `ChecklistStepDTO` interface, matching the structure of `web-host/src/application/dtos/TaskDTOs.ts`.

#### Scenario: TaskDTO structure
- **WHEN** a developer imports `TaskDTO` from `@/application/dtos/TaskDTOs`
- **THEN** it SHALL include `id`, `title`, `description?`, `status`, `position`, `createdAt`, `updatedAt`, and `statusUpdatedAt` fields

#### Scenario: ChecklistStepDTO structure
- **WHEN** a developer imports `ChecklistStepDTO` from `@/application/dtos/TaskDTOs`
- **THEN** it SHALL include `id`, `taskId`, `title`, `completed`, `position`, and `createdAt` fields

### Requirement: RoutineDTOs
A `RoutineDTOs.ts` file SHALL exist at `src/application/dtos/RoutineDTOs.ts` with a `RoutineDTO` interface, matching the structure of `web-host/src/application/dtos/RoutineDTOs.ts`.

#### Scenario: RoutineDTO structure
- **WHEN** a developer imports `RoutineDTO` from `@/application/dtos/RoutineDTOs`
- **THEN** it SHALL include `id`, `name`, `icon?`, `position`, `isActive`, `createdAt`, and `updatedAt` fields

### Requirement: useTasks hook wired through GetTasks use case
The `useTasks` hook SHALL instantiate `SupabaseTaskRepository` and `GetTasks` at module scope. The `useQuery` call SHALL delegate to `getTasks.execute()` instead of calling the repository directly.

#### Scenario: useTasks delegates to use case
- **WHEN** `useTasks()` is called
- **THEN** the hook's `queryFn` SHALL call `getTasks.execute()` — not `repository.getTasks()` directly

#### Scenario: useTasks returns query result
- **WHEN** `getTasks.execute()` resolves with a task array
- **THEN** `useTasks()` SHALL return the standard react-query result with `data`, `isLoading`, `refetch`, etc.

### Requirement: useRoutines hook wired through GetRoutines use case
The `useRoutines` hook SHALL instantiate `SupabaseRoutineRepository` and `GetRoutines` at module scope. The `useQuery` call SHALL delegate to `getRoutines.execute()` instead of calling the repository directly.

#### Scenario: useRoutines delegates to use case
- **WHEN** `useRoutines()` is called
- **THEN** the hook's `queryFn` SHALL call `getRoutines.execute()` — not `repository.getRoutines()` directly

#### Scenario: useRoutines returns query result
- **WHEN** `getRoutines.execute()` resolves with a routine array
- **THEN** `useRoutines()` SHALL return the standard react-query result with `data`, `isLoading`, `refetch`, etc.

### Requirement: No direct repository or supabaseClient imports in presentation layer
No file under `src/presentation/` or `app/` SHALL import from `@/infrastructure/api/clients/supabaseClient` or instantiate any repository class directly (except within hooks at module scope for wiring). Components and route screens SHALL only consume data through hooks.

#### Scenario: UserMenu does not import repository
- **WHEN** reviewing `UserMenu.tsx` imports
- **THEN** there SHALL be no import of `SupabaseAuthRepository` or `signOut` use case — only `useAuth`

#### Scenario: Login screen does not import repository
- **WHEN** reviewing `login.tsx` imports
- **THEN** there SHALL be no import of `SupabaseAuthRepository` — only `useAuth`

#### Scenario: Magic-link callback does not import supabaseClient
- **WHEN** reviewing `magic-link-callback.tsx` imports
- **THEN** there SHALL be no import of `supabaseClient` — only `useAuth`
