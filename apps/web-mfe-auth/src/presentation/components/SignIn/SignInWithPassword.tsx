import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TabsContent,
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
import { useAuth } from "@/presentation/hooks/useAuth";
import {
  loginSchema,
  type LoginFormData,
} from "@/domain/valueObjects/authSchemas";
import { useNavigate } from "react-router-dom";

export function SignInWithPassword() {
  const { signIn, loading, error } = useAuth();
  const toast = useAuthToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const loginPromise = signIn(data.email, data.password).then((result) => {
        if (result.success) {
          navigate("/register");
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
    <TabsContent value="password">
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
                  <Input placeholder="seu@email.com" type="email" {...field} />
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
                  <Input placeholder="Sua senha" type="password" {...field} />
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
  );
}
