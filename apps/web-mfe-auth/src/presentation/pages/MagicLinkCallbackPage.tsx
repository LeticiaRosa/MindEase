import { useEffect } from "react";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function MagicLinkCallbackPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const hostUrl = import.meta.env.VITE_HOST_URL ?? "http://localhost:3000";
      window.location.href = `${hostUrl}/dashboard`;
    }
  }, [user, loading]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground gap-8"
      role="main"
      aria-label="Página de verificação do magic link"
    >
      <div
        className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg"
        role="status"
        aria-label="Verificando autenticação"
        aria-live="polite"
      >
        <div
          className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />

        <p className="text-gray-700 font-medium">
          Verificando seu link de acesso...
        </p>
        <p className="text-sm text-gray-500">Aguarde um momento</p>
      </div>
    </div>
  );
}
