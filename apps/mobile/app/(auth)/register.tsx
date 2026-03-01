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
  signUpSchema,
  type SignUpFormData,
} from "@/domain/valueObjects/authSchemas";
import { signUp } from "@/application/useCases/signUp";
import { SupabaseAuthRepository } from "@/infrastructure/adapters/SupabaseAuthRepository";
import { colors, fontSizes, spacing, borderRadius } from "@repo/ui/theme";

const repository = new SupabaseAuthRepository();

export default function RegisterScreen() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  async function onSubmit(data: SignUpFormData) {
    setServerError(null);
    const result = await signUp(
      repository,
      data.email,
      data.password,
      data.fullName || undefined,
    );
    if (result.success) {
      router.replace("/(app)/dashboard");
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
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>
          Crie sua conta para começar a usar o MindEase.
        </Text>

        <Controller
          control={control}
          name="fullName"
          render={({ field, fieldState }) => (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Nome completo (opcional)</Text>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                autoComplete="name"
                textContentType="name"
                placeholder="Seu nome"
                placeholderTextColor={colors.mutedForeground}
                accessibilityLabel="Campo de nome completo"
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
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
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
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                placeholder="Mínimo 8 caracteres"
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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Confirmar senha</Text>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                placeholder="Repita a senha"
                placeholderTextColor={colors.mutedForeground}
                accessibilityLabel="Campo de confirmação de senha"
              />
              {fieldState.error && (
                <Text style={styles.fieldError}>
                  {fieldState.error.message}
                </Text>
              )}
            </View>
          )}
        />

        {serverError && <Text style={styles.serverError}>{serverError}</Text>}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          accessibilityLabel="Criar conta"
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={styles.buttonText}>Criar conta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={styles.loginLink}
          accessibilityLabel="Ir para login"
        >
          <Text style={styles.mutedText}>
            Já tem conta? <Text style={styles.linkInline}>Entrar</Text>
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
  loginLink: {
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
