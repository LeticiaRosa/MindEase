import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useAuthToast,
} from "@repo/ui";
import { useAuth } from "../hooks/userAuth";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface SignInProps {
  onToggleMode: () => void;
}

export function SignIn({ onToggleMode }: SignInProps) {
  const { signIn, loading, error } = useAuth();
  const toast = useAuthToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMagicLinkForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      // Criando uma promise que rejeita em caso de erro
      const loginPromise = signIn(data.email, data.password).then((result) => {
        if (result.success) {
          return result;
        } else {
          throw new Error(result.error?.message || "Erro ao fazer login");
        }
      });

      await toast.promise(loginPromise, {
        loading: "Fazendo login...",
        success: "Login realizado com sucesso!",
        error: (error) => error.message,
      });
    } catch {
      // O toast.promise já mostra a mensagem de erro
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
        <CardDescription>
          Acesse com senha ou link seguro para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="emailandpassword" className="flex w-full h-full ">
          <TabsList className="w-full mb-4 justify-start rounded-md bg-muted p-1">
            <TabsTrigger
              value="emailandpassword"
              className="data-[state=active]:bg-amber-400 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-200 data-[state=active]:hover:text-white"
            >
              E-mail e Senha
            </TabsTrigger>
            <TabsTrigger
              value="magiclink"
              className="data-[state=active]:bg-amber-400 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-200 data-[state=active]:hover:text-white"
            >
              Magic Link
            </TabsTrigger>
          </TabsList>
          <TabsContent value="emailandpassword">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md mb-4">
                {error.message}
              </div>
            )}

            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sua senha"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="magiclink">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md mb-4">
                {error.message}
              </div>
            )}

            <Form {...loginMagicLinkForm}>
              <form
                onSubmit={loginMagicLinkForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginMagicLinkForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Enviando link..." : "Enviar Magic Link"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Enviaremos um link de acesso seguro para seu email. Ele expira
                  em 5 minutos.
                </p>
              </form>
            </Form>
          </TabsContent>
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
