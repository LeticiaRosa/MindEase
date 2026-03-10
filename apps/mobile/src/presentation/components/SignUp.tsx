import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { createAuthCallbackUrl } from "@/lib/authDeepLink";

export function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();
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
      data.email,
      data.password,
      data.fullName || undefined,
      createAuthCallbackUrl(),
    );
    if (result.success) {
      router.replace("/(app)/dashboard");
    } else {
      setServerError(result.error.message);
    }
  }

  const fields: {
    name: keyof SignUpFormData;
    label: string;
    placeholder: string;
    secure?: boolean;
    autoComplete?: string;
    textContentType?: string;
    keyboardType?: string;
  }[] = [
    {
      name: "fullName",
      label: "Nome completo (opcional)",
      placeholder: "Seu nome",
      autoComplete: "name",
      textContentType: "name",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "seu@email.com",
      keyboardType: "email-address",
      autoComplete: "email",
      textContentType: "emailAddress",
    },
    {
      name: "password",
      label: "Senha",
      placeholder: "Mínimo 8 caracteres",
      secure: true,
      autoComplete: "new-password",
      textContentType: "newPassword",
    },
    {
      name: "confirmPassword",
      label: "Confirmar senha",
      placeholder: "Repita a senha",
      secure: true,
      autoComplete: "new-password",
      textContentType: "newPassword",
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: resolvedColors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: resolvedSpacing.lg,
          paddingTop: resolvedSpacing["3xl"],
          justifyContent: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontSize: resolvedFontSizes["3xl"],
            fontWeight: "700",
            color: resolvedColors.textPrimary,
            marginBottom: resolvedSpacing.sm,
          }}
        >
          Criar conta
        </Text>
        <Text
          style={{
            fontSize: resolvedFontSizes.lg,
            color: resolvedColors.textSecondary,
            marginBottom: resolvedSpacing["2xl"],
          }}
        >
          Crie sua conta para começar a usar o MindEase.
        </Text>

        {fields.map((f) => (
          <Controller
            key={f.name}
            control={control}
            name={f.name}
            render={({ field, fieldState }) => (
              <View style={{ marginBottom: resolvedSpacing.md }}>
                <Text
                  style={{
                    fontSize: resolvedFontSizes.base,
                    color: resolvedColors.textPrimary,
                    marginBottom: resolvedSpacing.xs,
                    fontWeight: "500",
                  }}
                >
                  {f.label}
                </Text>
                <TextInput
                  style={[
                    {
                      fontSize: resolvedFontSizes.base,
                      borderWidth: 1,
                      borderColor: resolvedColors.border,
                      borderRadius: resolvedBorderRadius.md,
                      padding: resolvedSpacing.md,
                      color: resolvedColors.textPrimary,
                      backgroundColor: resolvedColors.background,
                    },
                    fieldState.error && {
                      borderColor: resolvedColors.destructive,
                    },
                  ]}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  secureTextEntry={f.secure}
                  autoCapitalize={
                    f.keyboardType === "email-address" ? "none" : "sentences"
                  }
                  placeholder={f.placeholder}
                  placeholderTextColor={resolvedColors.mutedForeground}
                  accessibilityLabel={`Campo de ${f.label.toLowerCase()}`}
                />
                {fieldState.error && (
                  <Text
                    style={{
                      fontSize: resolvedFontSizes.sm,
                      color: resolvedColors.destructive,
                      marginTop: resolvedSpacing.xs,
                    }}
                  >
                    {fieldState.error.message}
                  </Text>
                )}
              </View>
            )}
          />
        ))}

        {serverError && (
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.destructive,
              marginBottom: resolvedSpacing.md,
            }}
          >
            {serverError}
          </Text>
        )}

        <TouchableOpacity
          style={[
            {
              backgroundColor: resolvedColors.primary,
              borderRadius: resolvedBorderRadius.md,
              padding: resolvedSpacing.md,
              alignItems: "center" as const,
              marginTop: resolvedSpacing.sm,
              marginBottom: resolvedSpacing.md,
            },
            isSubmitting && { opacity: 0.6 },
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          accessibilityLabel="Criar conta"
        >
          {isSubmitting ? (
            <ActivityIndicator color={resolvedColors.primaryForeground} />
          ) : (
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                color: resolvedColors.primaryForeground,
              }}
            >
              Criar conta
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={{ marginTop: resolvedSpacing.xl, alignItems: "center" }}
          accessibilityLabel="Ir para login"
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.textSecondary,
            }}
          >
            Já tem conta?{" "}
            <Text style={{ color: resolvedColors.primary, fontWeight: "600" }}>
              Entrar
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
