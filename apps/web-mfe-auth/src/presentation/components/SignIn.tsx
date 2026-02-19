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
import { useAuth } from "@/presentation/hooks/useAuth";
import { Mail, Sparkles } from "lucide-react";
import { SignInWithMagicLink } from "./SignIn/SignInWithMagicLink";
import { SignInWithPassword } from "./SignIn/SignInWithPassword";

interface SignInProps {
  onToggleMode: () => void;
}

export function SignIn({ onToggleMode }: SignInProps) {
  const { loading } = useAuth();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
        <CardDescription>
          Acesse com senha ou link seguro para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-2">
            <TabsTrigger
              value="password"
              className="data-[state=active]:bg-amber-400 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-200 data-[state=active]:hover:text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              E-mail e Senha
            </TabsTrigger>
            <TabsTrigger
              value="magiclink"
              className="data-[state=active]:bg-amber-400 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-200 data-[state=active]:hover:text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Magic Link
            </TabsTrigger>
          </TabsList>

          <SignInWithPassword />
          <SignInWithMagicLink />
        </Tabs>

        <div className="mt-4 text-center">
          <Button variant="link" onClick={onToggleMode} disabled={loading}>
            Não tem conta? Criar conta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
