## 1. Project Setup & Dependencies

- [x] 1.1 Install `@dnd-kit/core` and `@dnd-kit/sortable` in `web-host`
- [x] 1.2 Install Vitest and testing libraries (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`) in `web-host`
- [x] 1.3 Add shadcn/ui components needed: `checkbox`, `progress`, `dialog`, `dropdown-menu`, `separator` to `@repo/ui`

## 2. Supabase Schema & Migrations

- [x] 2.1 Create `tasks` table with columns: `id`, `user_id`, `title`, `description`, `status`, `position`, `created_at`, `updated_at`
- [x] 2.2 Create `checklist_steps` table with columns: `id`, `task_id`, `title`, `completed`, `position`, `created_at`
- [x] 2.3 Create `timer_preferences` table with columns: `user_id`, `focus_duration`, `break_duration`, `long_break_duration`, `cycles_before_long_break`, `updated_at`
- [x] 2.4 Add RLS policies on all three tables scoping data to `auth.uid() = user_id`
- [x] 2.5 Add foreign key cascade delete on `checklist_steps.task_id → tasks.id`

## 3. Domain Layer

- [x] 3.1 Create `TaskStatus` value object (enum: `todo`, `in_progress`, `done`)
- [x] 3.2 Create `Task` entity with `id`, `userId`, `title`, `description`, `status`, `position`, `createdAt`, `updatedAt`
- [x] 3.3 Create `ChecklistStep` entity with `id`, `taskId`, `title`, `completed`, `position`, `createdAt`
- [x] 3.4 Create `TimerPreferences` entity with `userId`, `focusDuration`, `breakDuration`, `longBreakDuration`, `cyclesBeforeLongBreak`
- [x] 3.5 Create `ITaskRepository` interface with methods: `getTasks`, `createTask`, `updateTask`, `deleteTask`, `reorderTasks`, `getChecklistSteps`, `createChecklistStep`, `updateChecklistStep`, `deleteChecklistStep`, `getTimerPreferences`, `updateTimerPreferences`

## 4. Infrastructure Layer

- [x] 4.1 Implement `SupabaseTaskRepository` class implementing `ITaskRepository`
- [x] 4.2 Implement task CRUD operations against Supabase `tasks` table
- [x] 4.3 Implement checklist step CRUD operations against Supabase `checklist_steps` table
- [x] 4.4 Implement timer preferences read/upsert against Supabase `timer_preferences` table
- [x] 4.5 Implement `reorderTasks` method with batch position updates

## 5. Application Layer (DTOs & Use Cases)

- [x] 5.1 Create `TaskDTO` and `ChecklistStepDTO` data transfer objects
- [x] 5.2 Create `CreateTask` use case
- [x] 5.3 Create `UpdateTaskStatus` use case
- [x] 5.4 Create `ReorderTasks` use case
- [x] 5.5 Create `DeleteTask` use case
- [x] 5.6 Create `ToggleChecklistStep` use case
- [x] 5.7 Create `CreateChecklistStep` use case
- [x] 5.8 Create `DeleteChecklistStep` use case
- [x] 5.9 Create `UpdateTimerPreferences` use case

## 6. Presentation Layer — Context & Hooks

- [x] 6.1 Create `TimerContext` with `useReducer` for timer state (active task, seconds remaining, timer status, current cycle)
- [x] 6.2 Create `useFocusTimer` hook with start/pause/reset logic and `setInterval` countdown
- [x] 6.3 Create `useTaskKanban` hook wrapping React Query mutations for task CRUD and reordering with optimistic updates
- [x] 6.4 Create `useSmartChecklist` hook wrapping React Query mutations for step CRUD with auto-focus logic
- [x] 6.5 Create `useTimerPreferences` hook for fetching/updating preferences via React Query

## 7. Presentation Layer — Kanban Components

- [x] 7.1 Create `KanbanBoard` component composing three `KanbanColumn` instances with `@dnd-kit` `DndContext`
- [x] 7.2 Create `KanbanColumn` component with `SortableContext`, column header, and task list
- [x] 7.3 Create `TaskCard` component with title, status indicator, focus indicator, and action buttons (delete, expand checklist, start timer)
- [x] 7.4 Create `TaskCreateForm` inline component with title input and zod validation
- [x] 7.5 Implement drag-and-drop between columns with `@dnd-kit` sensors (Pointer + Keyboard)
- [x] 7.6 Implement reorder within column via `@dnd-kit/sortable`
- [x] 7.7 Add drag overlay with translucent card preview

## 8. Presentation Layer — Smart Checklist Components

- [x] 8.1 Create `SmartChecklist` component with progressive disclosure (prominent current step, dimmed completed, collapsed remaining)
- [x] 8.2 Create `ChecklistStep` component with checkbox, title, and remove action
- [x] 8.3 Create `AddStepForm` inline input for adding new steps
- [x] 8.4 Implement auto-focus on next step after completion with smooth transition (~300ms fade)
- [x] 8.5 Create `ChecklistProgress` indicator component (e.g., "2 / 5" or thin progress bar)

## 9. Presentation Layer — Focus Timer Components

- [x] 9.1 Create `FocusTimer` component with circular progress ring or soft progress bar
- [x] 9.2 Implement start/pause/reset button controls with clear iconography (lucide-react)
- [x] 9.3 Display remaining time (MM:SS) and current cycle ("Cycle 2 of 4")
- [x] 9.4 Implement focus/break cycle transitions with gentle sonner toasts
- [x] 9.5 Create `TimerPreferencesPanel` settings component for adjusting durations (form with zod validation)

## 10. Dashboard Integration & Transitions

- [x] 10.1 Replace existing empty `Dashboard.tsx` with `KanbanBoard` + `TimerContext` provider composition
- [x] 10.2 Apply Tailwind CSS transitions (`transition-all duration-300 ease-in-out`) to all state changes
- [x] 10.3 Configure sonner toasts: bottom-right, 3s duration, no sound, non-blocking
- [x] 10.4 Ensure logical tab order: columns left-to-right, tasks top-to-bottom, interactive elements within cards
- [x] 10.5 Add visible high-contrast focus rings (2px outline, ≥3:1 contrast) to all interactive elements
- [x] 10.6 Ensure columns maintain stable width when tasks are added/removed

## 11. Testing

- [x] 11.1 Configure Vitest in `web-host` with `vitest.config.ts` and test script
- [x] 11.2 Write unit tests for domain entities (`Task`, `ChecklistStep`, `TimerPreferences`, `TaskStatus`)
- [x] 11.3 Write unit tests for use cases (`CreateTask`, `UpdateTaskStatus`, `ToggleChecklistStep`, etc.)
- [ ] 11.4 Write integration tests for `KanbanBoard` rendering and column display
- [ ] 11.5 Write integration tests for `SmartChecklist` progressive disclosure and auto-focus
- [ ] 11.6 Write integration tests for `FocusTimer` start/pause/reset and cycle transitions
- [ ] 11.7 Write accessibility tests: focus indicators, tab order, keyboard navigation
