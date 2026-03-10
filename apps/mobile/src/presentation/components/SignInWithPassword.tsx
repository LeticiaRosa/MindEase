import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import {
  signInSchema,
  type SignInFormData,
} from "@/domain/valueObjects/authSchemas";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface SignInWithPasswordProps {
  onSwitchToMagicLink: () => void;
}

export function SignInWithPassword({
  onSwitchToMagicLink,
}: SignInWithPasswordProps) {
  const router = useRouter();
  const { signIn } = useAuth();
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
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: SignInFormData) {
    setServerError(null);
    const result = await signIn(data.email, data.password);
    if (result.success) {
      router.replace("/(app)/dashboard");
    } else {
      setServerError(result.error.message);
    }
  }

  return (
    <>
      <Controller
        control={control}
        name="email"
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
              Email
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
                fieldState.error && { borderColor: resolvedColors.destructive },
              ]}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              placeholder="seu@email.com"
              placeholderTextColor={resolvedColors.mutedForeground}
              accessibilityLabel="Campo de email"
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

      <Controller
        control={control}
        name="password"
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
              Senha
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
                fieldState.error && { borderColor: resolvedColors.destructive },
              ]}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              secureTextEntry
              autoComplete="current-password"
              textContentType="password"
              placeholder="Sua senha"
              placeholderTextColor={resolvedColors.mutedForeground}
              accessibilityLabel="Campo de senha"
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
        accessibilityLabel="Entrar com senha"
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
            Entrar
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSwitchToMagicLink}
        accessibilityLabel="Entrar com link mágico"
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.base,
            color: resolvedColors.primary,
            textAlign: "center",
            padding: resolvedSpacing.sm,
          }}
        >
          Entrar com link mágico
        </Text>
      </TouchableOpacity>
    </>
  );
}
