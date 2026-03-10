import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { extractAuthCallbackParams } from "@/lib/authDeepLink";

export function AuthCallback() {
  const router = useRouter();
  const { handleMagicLinkCallback, exchangeAuthCodeForSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { resolvedColors, resolvedFontSizes, resolvedSpacing } = useTheme();

  async function handleUrl(url: string | null) {
    if (!url) {
      setError("Link invalido. Tente novamente.");
      return;
    }

    const { accessToken, refreshToken, code } = extractAuthCallbackParams(url);

    if (code) {
      const result = await exchangeAuthCodeForSession(code);
      if (!result.success) {
        setError(result.error.message);
        return;
      }

      router.replace("/(app)/dashboard");
      return;
    }

    if (!accessToken || !refreshToken) {
      setError("Tokens nao encontrados no link. Tente solicitar um novo link.");
      return;
    }

    const result = await handleMagicLinkCallback(accessToken, refreshToken);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    router.replace("/(app)/dashboard");
  }

  useEffect(() => {
    Linking.getInitialURL().then(handleUrl);

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: resolvedColors.background,
          alignItems: "center",
          justifyContent: "center",
          padding: resolvedSpacing.lg,
          gap: resolvedSpacing.md,
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.base,
            color: resolvedColors.destructive,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
        <Pressable
          onPress={() => router.replace("/(auth)/login")}
          accessibilityLabel="Voltar para a tela de login"
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.primary,
              marginTop: resolvedSpacing.md,
            }}
          >
            Voltar ao login
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: resolvedColors.background,
        alignItems: "center",
        justifyContent: "center",
        padding: resolvedSpacing.lg,
        gap: resolvedSpacing.md,
      }}
    >
      <ActivityIndicator size="large" color={resolvedColors.primary} />
      <Text
        style={{
          fontSize: resolvedFontSizes.base,
          color: resolvedColors.textSecondary,
          marginTop: resolvedSpacing.md,
        }}
      >
        Validando link...
      </Text>
    </View>
  );
}
