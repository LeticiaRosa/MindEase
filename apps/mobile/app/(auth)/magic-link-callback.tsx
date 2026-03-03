import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

function extractTokens(url: string): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  try {
    const parsed = Linking.parse(url);
    const params = parsed.queryParams ?? {};
    const accessToken =
      typeof params["access_token"] === "string"
        ? params["access_token"]
        : null;
    const refreshToken =
      typeof params["refresh_token"] === "string"
        ? params["refresh_token"]
        : null;
    return { accessToken, refreshToken };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

export default function MagicLinkCallbackScreen() {
  const router = useRouter();
  const { handleMagicLinkCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { resolvedColors, resolvedFontSizes, resolvedSpacing } = useTheme();

  async function handleUrl(url: string | null) {
    if (!url) {
      setError("Link inválido. Tente novamente.");
      return;
    }

    const { accessToken, refreshToken } = extractTokens(url);

    if (!accessToken || !refreshToken) {
      setError("Tokens não encontrados no link. Tente solicitar um novo link.");
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
    // Handle cold-start
    Linking.getInitialURL().then(handleUrl);

    // Handle warm-start (app already open)
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
        Validando link…
      </Text>
    </View>
  );
}
