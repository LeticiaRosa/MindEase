import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SignInWithPassword } from "./SignInWithPassword";
import { SignInWithMagicLink } from "./SignInWithMagicLink";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

type Mode = "password" | "magic-link";

export function SignIn() {
  const router = useRouter();
  const { resolvedColors, resolvedFontSizes, resolvedSpacing } = useTheme();
  const [mode, setMode] = useState<Mode>("password");

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
          MindEase
        </Text>
        <Text
          style={{
            fontSize: resolvedFontSizes.lg,
            color: resolvedColors.textSecondary,
            marginBottom: resolvedSpacing["2xl"],
          }}
        >
          Entrar na sua conta
        </Text>

        {/* Tab selector */}
        <TabSelector
          mode={mode}
          onModeChange={setMode}
          resolvedColors={resolvedColors}
          resolvedFontSizes={resolvedFontSizes}
          resolvedSpacing={resolvedSpacing}
        />

        {mode === "password" ? (
          <SignInWithPassword
            onSwitchToMagicLink={() => setMode("magic-link")}
          />
        ) : (
          <SignInWithMagicLink onSwitchToPassword={() => setMode("password")} />
        )}

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={{ marginTop: resolvedSpacing.xl, alignItems: "center" }}
          accessibilityLabel="Criar uma conta"
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.textSecondary,
            }}
          >
            Não tem conta?{" "}
            <Text style={{ color: resolvedColors.primary, fontWeight: "600" }}>
              Criar conta
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Tab selector ─────────────────────────────────────────────────────────────

function TabSelector({
  mode,
  onModeChange,
  resolvedColors,
  resolvedFontSizes,
  resolvedSpacing,
}: {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  resolvedColors: Record<string, string>;
  resolvedFontSizes: Record<string, number>;
  resolvedSpacing: Record<string, number>;
}) {
  const tabs: { key: Mode; label: string }[] = [
    { key: "password", label: "Senha" },
    { key: "magic-link", label: "Link Mágico" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: resolvedSpacing.lg }}
      contentContainerStyle={{ gap: resolvedSpacing.sm }}
    >
      {tabs.map((tab) => {
        const isActive = mode === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onModeChange(tab.key)}
            style={{
              paddingVertical: resolvedSpacing.sm,
              paddingHorizontal: resolvedSpacing.md,
              borderBottomWidth: 2,
              borderBottomColor: isActive
                ? resolvedColors.primary
                : "transparent",
            }}
            accessibilityLabel={`Tab ${tab.label}`}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                fontWeight: isActive ? "600" : "400",
                color: isActive
                  ? resolvedColors.textPrimary
                  : resolvedColors.mutedForeground,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
