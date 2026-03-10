import {
  Tabs,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@repo/ui";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/presentation/hooks/useAuth";
import { Mail, Sparkles } from "lucide-react";
import { SignInWithMagicLink } from "./SignIn/SignInWithMagicLink";
import { SignInWithPassword } from "./SignIn/SignInWithPassword";

export function SignIn() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      const hostUrl = import.meta.env.VITE_HOST_URL ?? window.location.origin;
      window.location.href = `${hostUrl}/dashboard`;
    }
  }, [user]);

  return (
    <Card
      className="w-full max-w-md mx-auto shadow-sm"
      role="main"
      aria-label="Formulário de login"
    >
      <CardHeader
        className="text-center"
        role="banner"
        aria-label="Cabeçalho do formulário de login"
      >
        <CardTitle
          className="text-2xl !font-bold"
          role="heading"
          aria-level={1}
        >
          Bem-vindo de volta
        </CardTitle>
        <CardDescription
          className="text-gray-700"
          role="contentinfo"
          aria-label="Descrição do formulário de login"
        >
          Acesse com senha ou link seguro para continuar
        </CardDescription>
      </CardHeader>
      <CardContent role="form" aria-label="Conteúdo do formulário de login">
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="w-full mb-4 !grid grid-cols-2">
            <TabsTrigger
              value="password"
              className="gap-1.5 overflow-hidden data-[state=active]:border data-[state=active]:border-primary data-[state=active]:shadow-md cursor-pointer min-w-0"
            >
              <Mail className="size-4 shrink-0" />
              <span className="truncate">E-mail e Senha</span>
            </TabsTrigger>
            <TabsTrigger
              value="magiclink"
              className="gap-1.5 overflow-hidden data-[state=active]:border data-[state=active]:border-primary data-[state=active]:shadow-md cursor-pointer min-w-0"
            >
              <Sparkles className="size-4 shrink-0" />
              <span className="truncate">Link Mágico</span>
            </TabsTrigger>
          </TabsList>

          <SignInWithPassword />
          <SignInWithMagicLink />
        </Tabs>

        <div
          className="mt-4 text-center"
          role="group"
          aria-label="Opção para criar conta"
        >
          <Button
            variant="link"
            onClick={() => navigate("/register")}
            disabled={loading}
          >
            <p className="text-muted-foreground hover:underline">
              Não tem conta?{" "}
            </p>
            Criar conta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
