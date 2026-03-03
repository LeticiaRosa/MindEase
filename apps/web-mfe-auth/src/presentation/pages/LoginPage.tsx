import { SignIn } from "@/presentation/components/SignIn";

export default function LoginPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground"
      role="main"
      aria-label="Página de login"
    >
      <div
        className="flex flex-col items-center justify-center min-h-md min-w-md gap-6"
        role="region"
        aria-label="Área de autenticação"
      >
        <SignIn />
      </div>
    </div>
  );
}
