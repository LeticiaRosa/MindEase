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
import {
  magicLinkSchema,
  type MagicLinkFormData,
} from "@/domain/valueObjects/authSchemas";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { createAuthCallbackUrl } from "@/lib/authDeepLink";

interface SignInWithMagicLinkProps {
  onSwitchToPassword: () => void;
}

export function SignInWithMagicLink({
  onSwitchToPassword,
}: SignInWithMagicLinkProps) {
  const { signInWithMagicLink } = useAuth();
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();
  const [serverError, setServerError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: MagicLinkFormData) {
    setServerError(null);
    const result = await signInWithMagicLink(
      data.email,
      createAuthCallbackUrl(),
    );
    if (result.success) {
      setMagicLinkSent(true);
    } else {
      setServerError(result.error.message);
    }
  }

  if (magicLinkSent) {
    return (
      <View
        style={{
          padding: resolvedSpacing.lg,
          backgroundColor: resolvedColors.muted,
          borderRadius: resolvedBorderRadius.lg,
          marginBottom: resolvedSpacing.lg,
          gap: resolvedSpacing.md,
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.base,
            color: resolvedColors.textPrimary,
            textAlign: "center",
          }}
        >
          ✓ Link enviado! Verifique seu email e clique no link para entrar.
        </Text>
        <TouchableOpacity
          onPress={() => {
            setMagicLinkSent(false);
            onSwitchToPassword();
          }}
          accessibilityLabel="Voltar ao login com senha"
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.primary,
              textAlign: "center",
              padding: resolvedSpacing.sm,
            }}
          >
            Voltar ao login
          </Text>
        </TouchableOpacity>
      </View>
    );
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
              accessibilityLabel="Campo de email para link mágico"
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
        accessibilityLabel="Enviar link mágico"
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
            Enviar link
          </Text>
        )}
      </TouchableOpacity>
      <Text
        style={{
          fontSize: resolvedFontSizes.base,
          color: resolvedColors.textSecondary,
          marginBottom: resolvedSpacing.xs,
        }}
      >
        Como funciona:
      </Text>
      <Text
        style={{
          fontSize: resolvedFontSizes.base,
          color: resolvedColors.textSecondary,
          marginBottom: resolvedSpacing.xs,
        }}
      >
        1. Digite seu email acima
      </Text>
      <Text
        style={{
          fontSize: resolvedFontSizes.base,
          color: resolvedColors.textSecondary,
          marginBottom: resolvedSpacing.xs,
        }}
      >
        2. Receba um link seguro por email
      </Text>
      <Text
        style={{
          fontSize: resolvedFontSizes.base,
          color: resolvedColors.textSecondary,
          marginBottom: resolvedSpacing.lg,
        }}
      >
        3. Clique no link para fazer login
      </Text>
      <Text
        style={{
          fontSize: resolvedFontSizes.sm,
          color: resolvedColors.textSecondary,
          marginBottom: resolvedSpacing.lg,
        }}
      >
        O link é válido por 5 minutos e pode ser usado apenas uma vez.
      </Text>

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
        onPress={onSwitchToPassword}
        accessibilityLabel="Voltar ao login com senha"
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.base,
            color: resolvedColors.primary,
            textAlign: "center",
            padding: resolvedSpacing.sm,
          }}
        >
          Entrar com senha
        </Text>
      </TouchableOpacity>
    </>
  );
}
