import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import {
  signInSchema,
  magicLinkSchema,
  type SignInFormData,
  type MagicLinkFormData,
} from "@/domain/valueObjects/authSchemas";
import { signIn } from "@/application/useCases/signIn";
import { signInWithMagicLink } from "@/application/useCases/signInWithMagicLink";
import { SupabaseAuthRepository } from "@/infrastructure/adapters/SupabaseAuthRepository";
import { colors, fontSizes, spacing, borderRadius } from "@repo/ui/theme";

const repository = new SupabaseAuthRepository();

type Mode = "password" | "magic-link";

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [serverError, setServerError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const passwordForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const magicLinkForm = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  async function onPasswordSubmit(data: SignInFormData) {
    setServerError(null);
    const result = await signIn(repository, data.email, data.password);
    if (result.success) {
      router.replace("/(app)/dashboard");
    } else {
      setServerError(result.error.message);
    }
  }

  async function onMagicLinkSubmit(data: MagicLinkFormData) {
    setServerError(null);
    const result = await signInWithMagicLink(repository, data.email);
    if (result.success) {
      setMagicLinkSent(true);
    } else {
      setServerError(result.error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>MindEase</Text>
        <Text style={styles.subtitle}>Entrar na sua conta</Text>

        {mode === "password" ? (
          <>
            <Controller
              control={passwordForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <View style={styles.fieldWrapper}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[
                      styles.input,
                      fieldState.error && styles.inputError,
                    ]}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    placeholder="seu@email.com"
                    placeholderTextColor={colors.mutedForeground}
                    accessibilityLabel="Campo de email"
                  />
                  {fieldState.error && (
                    <Text style={styles.fieldError}>
                      {fieldState.error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={passwordForm.control}
              name="password"
              render={({ field, fieldState }) => (
                <View style={styles.fieldWrapper}>
                  <Text style={styles.label}>Senha</Text>
                  <TextInput
                    style={[
                      styles.input,
                      fieldState.error && styles.inputError,
                    ]}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    secureTextEntry
                    autoComplete="current-password"
                    textContentType="password"
                    placeholder="Sua senha"
                    placeholderTextColor={colors.mutedForeground}
                    accessibilityLabel="Campo de senha"
                  />
                  {fieldState.error && (
                    <Text style={styles.fieldError}>
                      {fieldState.error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {serverError && (
              <Text style={styles.serverError}>{serverError}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                passwordForm.formState.isSubmitting && styles.buttonDisabled,
              ]}
              onPress={passwordForm.handleSubmit(onPasswordSubmit)}
              disabled={passwordForm.formState.isSubmitting}
              accessibilityLabel="Entrar com senha"
            >
              {passwordForm.formState.isSubmitting ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setServerError(null);
                setMode("magic-link");
              }}
              accessibilityLabel="Entrar com link mágico"
            >
              <Text style={styles.linkText}>Entrar com link mágico</Text>
            </TouchableOpacity>
          </>
        ) : magicLinkSent ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              Link enviado! Verifique seu email e clique no link para entrar.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setMagicLinkSent(false);
                setMode("password");
              }}
              accessibilityLabel="Voltar ao login com senha"
            >
              <Text style={styles.linkText}>Voltar ao login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.modeDescription}>
              Enviaremos um link mágico para o seu email.
            </Text>
            <Controller
              control={magicLinkForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <View style={styles.fieldWrapper}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[
                      styles.input,
                      fieldState.error && styles.inputError,
                    ]}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    placeholder="seu@email.com"
                    placeholderTextColor={colors.mutedForeground}
                    accessibilityLabel="Campo de email para link mágico"
                  />
                  {fieldState.error && (
                    <Text style={styles.fieldError}>
                      {fieldState.error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {serverError && (
              <Text style={styles.serverError}>{serverError}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                magicLinkForm.formState.isSubmitting && styles.buttonDisabled,
              ]}
              onPress={magicLinkForm.handleSubmit(onMagicLinkSubmit)}
              disabled={magicLinkForm.formState.isSubmitting}
              accessibilityLabel="Enviar link mágico"
            >
              {magicLinkForm.formState.isSubmitting ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text style={styles.buttonText}>Enviar link</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setServerError(null);
                setMode("password");
              }}
              accessibilityLabel="Voltar ao login com senha"
            >
              <Text style={styles.linkText}>Usar senha</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={styles.registerLink}
          accessibilityLabel="Criar uma conta"
        >
          <Text style={styles.mutedText}>
            Não tem conta? <Text style={styles.linkInline}>Criar conta</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing["3xl"],
    justifyContent: "center",
  },
  title: {
    fontSize: fontSizes["3xl"],
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    marginBottom: spacing["2xl"],
  },
  modeDescription: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  fieldWrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  input: {
    fontSize: fontSizes.base,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.destructive,
  },
  fieldError: {
    fontSize: fontSizes.sm,
    color: colors.destructive,
    marginTop: spacing.xs,
  },
  serverError: {
    fontSize: fontSizes.sm,
    color: colors.destructive,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: fontSizes.base,
    fontWeight: "600",
    color: colors.primaryForeground,
  },
  linkText: {
    fontSize: fontSizes.base,
    color: colors.primary,
    textAlign: "center",
    padding: spacing.sm,
  },
  successBox: {
    padding: spacing.lg,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  successText: {
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    textAlign: "center",
  },
  registerLink: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  mutedText: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
  },
  linkInline: {
    color: colors.primary,
    fontWeight: "600",
  },
});
