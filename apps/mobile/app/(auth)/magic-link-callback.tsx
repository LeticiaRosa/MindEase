import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";
import { colors, fontSizes, spacing } from "@repo/ui/theme";

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
  const [error, setError] = useState<string | null>(null);

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

    const { error: sessionError } = await supabaseClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      setError(sessionError.message);
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
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/login")}
          accessibilityLabel="Voltar para a tela de login"
        >
          <Text style={styles.linkText}>Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Validando link…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: fontSizes.base,
    color: colors.destructive,
    textAlign: "center",
  },
  linkText: {
    fontSize: fontSizes.base,
    color: colors.primary,
    marginTop: spacing.md,
  },
});
