import { SignUp } from "@/presentation/components/SignUp";

export default function RegisterPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground"
      role="main"
      aria-label="Página de cadastro"
    >
      <div
        className="flex flex-col items-center justify-center min-h-md min-w-md gap-6"
        role="region"
        aria-label="Área de criação de conta"
      >
        <SignUp />
      </div>
    </div>
  );
}
