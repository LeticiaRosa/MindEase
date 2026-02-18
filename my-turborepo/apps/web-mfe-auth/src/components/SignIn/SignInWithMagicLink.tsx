import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/userAuth";

const magicLinkSchema = z.object({
  email: z.string().email("Email inválido"),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

export function SignInWithMagicLink() {
  const { signInWithMagicLink, loading, error } = useAuth();
  const toast = useAuthToast();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const magicLinkForm = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const onMagicLinkSubmit = async (data: MagicLinkFormData) => {
    try {
      const magicLinkPromise = signInWithMagicLink(data.email).then(
        (result) => {
          if (result.success) {
            setEmailSent(true);
            setSentEmail(data.email);
            magicLinkForm.reset();
            return result;
          } else {
            throw new Error(
              result.error?.message || "Erro ao enviar magic link",
            );
          }
        },
      );

      await toast.promise(magicLinkPromise, {
        loading: "Enviando link de acesso...",
        success: "Link enviado! Verifique seu email.",
        error: (error) => error.message,
      });
    } catch (error) {
      console.error("Magic link error:", error);
    }
  };

  const handleResendLink = () => {
    setEmailSent(false);
    magicLinkForm.setValue("email", sentEmail);
  };

  return (
    <TabsContent value="magiclink">
      {emailSent ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div className="flex-1 text-sm text-green-800">
              <p className="font-medium mb-1">Link enviado com sucesso!</p>
              <p className="text-green-700">
                Clique no link que enviamos para <strong>{sentEmail}</strong>{" "}
                para fazer login. O link expira em 5 minutos.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Não recebeu o email?</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Verifique sua caixa de spam</li>
              <li>Certifique-se de que o email está correto</li>
              <li>Aguarde alguns minutos</li>
            </ul>
          </div>

          <Button
            onClick={handleResendLink}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            Enviar novamente
          </Button>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md mb-4">
              {error.message}
            </div>
          )}

          <Form {...magicLinkForm}>
            <form
              onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)}
              className="space-y-4"
            >
              <FormField
                control={magicLinkForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                <Sparkles className="w-4 h-4 mr-2" />{" "}
                {loading ? "Enviando..." : "Enviar Magic Link"}
              </Button>

              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">Como funciona:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Digite seu email acima</li>
                  <li>Receba um link seguro por email</li>
                  <li>Clique no link para fazer login</li>
                </ol>
                <p className="text-xs">
                  O link é válido por 5 minutos e pode ser usado apenas uma vez.
                </p>
              </div>
            </form>
          </Form>
        </>
      )}
    </TabsContent>
  );
}
