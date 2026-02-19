# MindEase — Agent Instructions

## About the project

MindEase is a platform that **makes academic and professional life easier for neurodivergent people or those with cognitive processing challenges**.
All code, documentation, and suggestions must respect the principles of **cognitive accessibility, simplicity, and guided focus**.

Interfaces must have **low visual stimulation** and clear focus. Texts must be short, direct, and predictable. Components must **facilitate comprehension and use by people with ADHD, ASD, dyslexia, or cognitive overload**.

---

## Project architecture

This is a **pnpm monorepo** managed by **Turborepo**.

```
apps/
  web-host/          # Shell host app (React + Vite, port 3000)
  web-mfe-auth/      # Auth micro-frontend (React + Vite, port 3001)
  mobile/            # Mobile app (React Native + Expo)
packages/
  ui/                # Shared UI components (shadcn/ui + Tailwind CSS v4)
  eslint-config/     # Shared ESLint configs
  typescript-config/ # Shared TypeScript configs
```

### Key tech stack

| Layer                 | Technology                                                       |
| --------------------- | ---------------------------------------------------------------- |
| Package manager       | pnpm 9 (`pnpm-workspace.yaml` defines `apps/*` and `packages/*`) |
| Monorepo orchestrator | Turborepo 2.8                                                    |
| Web framework         | React 18 + Vite 7                                                |
| Module Federation     | `@module-federation/vite` — `web-host` consumes `web-mfe-auth`   |
| Mobile                | Expo 52 + React Native 0.76 + expo-router                        |
| UI library            | shadcn/ui (new-york style, non-RSC, Tailwind CSS v4)             |
| CSS                   | Tailwind CSS 4 via `@tailwindcss/vite` plugin                    |
| Forms                 | react-hook-form + zod                                            |
| State / data          | @tanstack/react-query                                            |
| Auth backend          | Supabase (password + magic link)                                 |
| Linting               | ESLint 9 (flat config) + Prettier                                |
| TypeScript            | 5.9                                                              |
| Testing               | Vitest + React Testing Library + Jest DOM                        |
| Routing               | React Router v6 (web), expo-router (mobile)                      |

### Module Federation layout

- **Host** (`web-host`, port 3000): consumes remote `auth` at `http://localhost:3001/remoteEntry.js`. Declares `auth/auth` and `auth/useAuth` via type declarations in `src/auth.d.ts` and `src/@types/federation.d.ts`.
- **Remote** (`web-mfe-auth`, port 3001): exposes `./auth` → `src/export.tsx`. Uses Supabase for sign-in (password + magic link) and sign-up.
- Shared singletons: `react`, `react-dom`, `@tanstack/react-query`.

---

## Dev environment tips

- Run `pnpm install` from the repo root to bootstrap all workspaces.
- Use `pnpm dev` to start **all** apps in parallel via Turborepo.
- Use `pnpm dev:host` to start only `web-host` (port 3000).
- Use `pnpm dev:auth` to start only `web-mfe-auth` (port 3001).
- Use `pnpm dev:sequential` to start auth first, then host after 3 seconds (avoids federation race conditions).
- Check the `name` field inside each package's `package.json` to confirm the right name — the root package is just `my-turborepo`.
- Package names: `web-host`, `web-mfe-auth`, `@mindease/mobile`, `@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config`.
- Path alias `@/` resolves to `./src/` in web apps and `packages/ui`. In mobile it resolves to `./`.
- Run `pnpm install --filter <package_name>` to add a dependency to a specific workspace.
- To add a new dependency: `pnpm add <dep> --filter <package_name>`.

### Environment variables

- `web-mfe-auth` requires Supabase env vars. Copy `apps/web-mfe-auth/.env.example` to `apps/web-mfe-auth/.env` and fill in:
  - `VITE_SUPABASE_URL` — your Supabase project URL.
  - `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — your Supabase anon/publishable key.
- All web env vars must be prefixed with `VITE_` to be exposed to the client.

### Adding shadcn/ui components

All three packages (`packages/ui`, `apps/web-host`, `apps/web-mfe-auth`) have a `components.json` for shadcn. Shared components go into `packages/ui`:

```bash
cd packages/ui && pnpm dlx shadcn@latest add <component>
```

App-specific components can be added directly inside the app folder.

---

## Turbo tasks

| Task          | Command            | Description                                              |
| ------------- | ------------------ | -------------------------------------------------------- |
| `dev`         | `pnpm dev`         | Start all apps (persistent, no cache)                    |
| `build`       | `pnpm build`       | Build all packages and apps (outputs: `dist/`, `.next/`) |
| `lint`        | `pnpm lint`        | Run ESLint on all workspaces                             |
| `check-types` | `pnpm check-types` | Run TypeScript type-checking across all workspaces       |
| `format`      | `pnpm format`      | Prettier format all `*.ts`, `*.tsx`, `*.md`              |

Filter to a single package: `pnpm turbo run <task> --filter=<package_name>`.

---

## Testing instructions

- No test framework is currently configured. When adding tests, use **Vitest** (compatible with the Vite + React stack).
- Install with `pnpm add -D vitest @testing-library/react @testing-library/jest-dom --filter <package_name>`.
- Add a `"test": "vitest run"` script to the relevant `package.json` and a `test` task to `turbo.json`.
- Run `pnpm turbo run test --filter <package_name>` to run tests for a specific package.
- From a package root you can just call `pnpm test`.
- To focus on one test, add the Vitest pattern: `pnpm vitest run -t "<test name>"`.
- Fix any lint or type errors until the whole suite is green.
- After moving files or changing imports, run `pnpm lint --filter <package_name>` to be sure ESLint and TypeScript rules still pass.
- Add or update tests for the code you change, even if nobody asked.
- Tests must cover accessibility and cognitive flow rules (e.g. focus indicators, non-intrusive feedback).

---

## PR and commit instructions

- Title format: `[<package_name>] <Title>` (e.g. `[web-mfe-auth] Add password reset flow`).
- Always run `pnpm lint` and `pnpm check-types` before committing.
- Run `pnpm format` to ensure consistent formatting.
- Keep commits small and focused — one logical change per commit.

---

## Coding conventions

### TypeScript and React

- All code must be TypeScript (`.ts` / `.tsx`). No `any` unless absolutely necessary.
- Follow React best practices: functional components, hooks, no class components.
- Use named exports for components and utilities. Use default exports only for page/route components and Module Federation entry points.
- Use the `@/` path alias for internal imports instead of deep relative paths (`../../`).
- State management: prefer `@tanstack/react-query` for server state, React context or Zustand for client state.
- Forms: use `react-hook-form` with `zod` schemas for validation.
- Clean Architecture: separate presentation, domain, and infrastructure concerns.

### File and folder structure

- Components go in `src/components/`.
- Hooks go in `src/hooks/`.
- Utility functions go in `src/lib/` or `src/utils/`.
- Keep one component per file. Name the file exactly like the component.

### Styling

- Use Tailwind CSS v4 utility classes. No custom CSS files unless unavoidable.
- Follow shadcn/ui conventions for component styling (CVA + `cn()` helper from `@repo/ui`).
- Keep layouts clean and spacious — avoid dense, cluttered interfaces.

---

## Cognitive accessibility rules (mandatory)

All UI work **must** follow these rules:

- **Low visual stimulation**: generous whitespace, limited color palette, no distracting animations.
- **Clear focus states**: every interactive element must have a visible, high-contrast focus indicator.
- **Adjustable complexity**: support "summary" and "detailed" modes where applicable.
- **Font sizing**: use relative units (`rem`), default to larger readable sizes.
- **Spacing**: generous padding and margin between elements — never compress layouts.
- **Non-intrusive feedback**: use gentle toasts (like `sonner`), avoid modals and pop-ups that block the user.
- **Progressive disclosure**: show less, focus on the next step. Decompose complex tasks into smaller steps.
- **No autoplay**: avoid animations, auto-scrolling, or sounds that start without user action.
- **Predictable navigation**: consistent layout, clear labels, logical tab order.
- **Persistent preferences**: contrast, font size, spacing, and focus mode settings must persist across sessions.

---

## Feature guidelines

### Cognitive dashboard

- Allow complexity and focus adjustments.
- Expose "summary" and "detailed" view modes.
- Use soft, non-intrusive alerts.

### Task organizer

- Simplified Kanban with smooth transitions.
- Customizable Pomodoro timers adapted to focus profiles.
- Smart checklists that break tasks into smaller visual steps.
- Follow the principle: _show less, focus on the next step_.

### User profile and preferences

- Store focus and navigation settings persistently.
- Contrast, font size, and spacing preferences must survive page reloads.
- Support study/work routine scheduling.

---

## Skills and reference docs

Detailed best-practice guides live under `.agents/skills/`:

| Skill                               | When to use                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| `supabase-postgres-best-practices/` | Writing SQL, designing schemas, optimizing queries, configuring RLS             |
| `vercel-react-best-practices/`      | Writing or refactoring React/Next.js components, optimizing performance         |
| `clean-code/`                       | Writing, reviewing, or refactoring any code for readability and maintainability |
| `turborepo/`                        | Monorepo orchestration, caching, task pipelines                                 |

Read the `SKILL.md` file inside each skill folder for full instructions before applying.
