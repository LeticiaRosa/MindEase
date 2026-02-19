import React, { useEffect, useState } from "react";
import { useAuth } from "auth/useAuth";
import { useToast } from "@repo/ui";
import { getAuthUrl } from "../lib/config";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const toast = useToast();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Só executa a verificação após o loading inicial terminar
    if (!loading && !hasCheckedAuth) {
      setHasCheckedAuth(true);

      // Verifica se há algum token no localStorage (padrão do Supabase)
      const hasToken = checkForAuthTokens();

      // Se não há usuário E não há token, redireciona
      if (!user && !hasToken) {
        setIsRedirecting(true);

        toast.warning("Acesso negado", {
          description: "Você precisa estar logado para acessar esta área.",
          duration: 3000,
        });

        // Redireciona para a tela de login após mostrar o toast
        setTimeout(() => {
          window.location.href = getAuthUrl();
        }, 1000);
      }
    }
  }, [user, loading, hasCheckedAuth, toast]);

  // Função auxiliar para verificar tokens
  const checkForAuthTokens = (): boolean => {
    try {
      // Verifica várias chaves possíveis onde o Supabase pode armazenar tokens
      const possibleKeys = [
        "sb-access-token",
        "supabase.auth.token",
        "sb-auth-token",
      ];

      // Verifica localStorage
      for (const key of possibleKeys) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed.access_token || parsed.session?.access_token) {
              return true;
            }
          } catch {
            // Se não é JSON válido, verifica se é uma string de token
            if (item && item.length > 20) {
              return true;
            }
          }
        }
      }

      // Verifica todas as chaves do localStorage que começam com 'sb-'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("sb-") && key.includes("auth")) {
          const item = localStorage.getItem(key);
          if (item && item.length > 20) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error("Erro ao verificar tokens:", error);
      return false;
    }
  };

  // Mostra loading enquanto verifica a autenticação
  if (loading || !hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se está redirecionando, mostra tela de redirecionamento
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Redirecionando...</h2>
          <p className="text-muted-foreground">
            Você será redirecionado para a tela de login.
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  // Verifica novamente após o loading se há autenticação
  const hasToken = checkForAuthTokens();

  // Se não há usuário e nem token, inicia o redirecionamento
  if (!user && !hasToken && hasCheckedAuth) {
    if (!isRedirecting) {
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = getAuthUrl();
      }, 500);
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">Redirecionando para login...</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  // Se há usuário autenticado ou token válido, renderiza o conteúdo
  return <>{children}</>;
};
