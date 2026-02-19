## 1. Domain Layer

- [x] 1.1 Create `src/domain/entities/User.ts` with the `User` type (id, email, user_metadata)
- [x] 1.2 Create `src/domain/entities/AuthResult.ts` with the `AuthResult<T>` discriminated union type
- [x] 1.3 Create `src/domain/interfaces/IAuthRepository.ts` with the `IAuthRepository` interface (signIn, signUp, signOut, signInWithMagicLink, getUser, getSession, trackMagicLinkRequest, onAuthStateChange)
- [x] 1.4 Create `src/domain/valueObjects/authSchemas.ts` with Zod schemas (loginSchema, signUpSchema, magicLinkSchema) and their inferred types

## 2. Application Layer

- [x] 2.1 Create `src/application/dtos/AuthInput.ts` with input DTOs (SignInInput, SignUpInput, MagicLinkInput)
- [x] 2.2 Create `src/application/useCases/signIn.ts` — accepts IAuthRepository, returns AuthResult<User>
- [x] 2.3 Create `src/application/useCases/signUp.ts` — accepts IAuthRepository, returns AuthResult<User>
- [x] 2.4 Create `src/application/useCases/signOut.ts` — accepts IAuthRepository, returns AuthResult<void>
- [x] 2.5 Create `src/application/useCases/signInWithMagicLink.ts` — accepts IAuthRepository, returns AuthResult<void>, calls trackMagicLinkRequest on success

## 3. Infrastructure Layer

- [x] 3.1 Move Supabase client to `src/infrastructure/api/clients/supabaseClient.ts`
- [x] 3.2 Create `src/infrastructure/adapters/SupabaseAuthRepository.ts` implementing IAuthRepository with all methods (signIn, signUp, signOut, signInWithMagicLink, getUser, getSession, trackMagicLinkRequest, onAuthStateChange)

## 4. Presentation Layer — Hooks

- [x] 4.1 Create `src/presentation/hooks/useAuth.ts` — composition root that instantiates SupabaseAuthRepository, wires use cases via React Query, subscribes to onAuthStateChange, and returns { user, loading, error, signIn, signUp, signOut, signInWithMagicLink }

## 5. Presentation Layer — Components

- [x] 5.1 Move `Auth.tsx` to `src/presentation/components/Auth.tsx` — update imports to use `presentation/hooks/useAuth` and `presentation/components/`
- [x] 5.2 Move `SignIn.tsx` to `src/presentation/components/SignIn.tsx` — update imports
- [x] 5.3 Move `SignInWithPassword.tsx` to `src/presentation/components/SignIn/SignInWithPassword.tsx` — update imports to use `domain/valueObjects/authSchemas` and `presentation/hooks/useAuth`
- [x] 5.4 Move `SignInWithMagicLink.tsx` to `src/presentation/components/SignIn/SignInWithMagicLink.tsx` — update imports to use `domain/valueObjects/authSchemas` and `presentation/hooks/useAuth`
- [x] 5.5 Move `SignUp.tsx` to `src/presentation/components/SignUp.tsx` — update imports to use `domain/valueObjects/authSchemas` and `presentation/hooks/useAuth`

## 6. Entry Points & Cleanup

- [x] 6.1 Update `src/export.tsx` to import Auth from `presentation/components/Auth` and add named export of `useAuth` from `presentation/hooks/useAuth`
- [x] 6.2 Update `src/App.tsx` to import Auth from `presentation/components/Auth`
- [x] 6.3 Update `src/main.tsx` imports if needed
- [x] 6.4 Delete `src/components/` directory
- [x] 6.5 Delete `src/hooks/` directory
- [x] 6.6 Delete `src/utils/` directory
- [x] 6.7 Delete `src/lib/` directory

## 7. Validation

- [x] 7.1 Run `pnpm check-types --filter web-mfe-auth` and fix any type errors
- [x] 7.2 Run `pnpm lint --filter web-mfe-auth` and fix any lint errors
- [x] 7.3 Smoke test: `pnpm dev:auth` and verify sign-in, sign-up, magic link flows render correctly
