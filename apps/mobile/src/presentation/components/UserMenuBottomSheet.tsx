import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import type { User } from "@/domain/entities/User";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useRouter } from "expo-router";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import type {
  ColourTheme,
  ComplexityMode,
  FontSize,
  SpacingDensity,
  ThemeMode,
} from "@/presentation/contexts/ThemePreferencesContext";

interface UserMenuBottomSheetProps {
  user: User;
  visible: boolean;
  onClose: () => void;
}

export function UserMenuBottomSheet({
  user,
  visible,
  onClose,
}: UserMenuBottomSheetProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
    theme,
    fontSize,
    spacing: spacingPref,
    mode,
    complexity,
    reduceMotion,
    updatePreferences,
  } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const displayName = user.user_metadata?.full_name ?? user.email;
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : "ME";

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    onClose();
    router.replace("/(auth)/login");
  };

  const themeOptions: Array<{ label: string; value: ColourTheme }> = [
    { label: "Padrão", value: "default" },
    { label: "Escuro", value: "dark" },
    { label: "Suave", value: "soft" },
    { label: "Alto contraste", value: "high-contrast" },
  ];

  const fontOptions: Array<{ label: string; value: FontSize }> = [
    { label: "P", value: "sm" },
    { label: "M", value: "md" },
    { label: "G", value: "lg" },
  ];

  const spacingOptions: Array<{ label: string; value: SpacingDensity }> = [
    { label: "Compacto", value: "compact" },
    { label: "Normal", value: "default" },
    { label: "Confortável", value: "relaxed" },
  ];

  const complexityOptions: Array<{ label: string; value: ComplexityMode }> = [
    { label: "Simples", value: "simple" },
    { label: "Completa", value: "complex" },
  ];

  const modeOptions: Array<{ label: string; value: ThemeMode }> = [
    { label: "Resumo", value: "resume" },
    { label: "Detalhe", value: "detail" },
  ];

  const motionOptions: Array<{ label: string; value: boolean }> = [
    { label: "Padrão", value: false },
    { label: "Reduzidas", value: true },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: resolvedColors.background }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: resolvedSpacing.md,
            gap: resolvedSpacing.md,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: resolvedSpacing.md,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: resolvedColors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: resolvedFontSizes.lg,
                    fontWeight: "700",
                    color: resolvedColors.primaryForeground,
                  }}
                >
                  {initials}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: resolvedFontSizes.sm,
                    fontWeight: "600",
                    color: resolvedColors.textPrimary,
                  }}
                  numberOfLines={1}
                >
                  {displayName}
                </Text>
                <Text
                  style={{
                    fontSize: resolvedFontSizes.xs,
                    color: resolvedColors.mutedForeground,
                  }}
                  numberOfLines={1}
                >
                  {user.email}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} accessibilityLabel="Fechar menu">
              <Text
                style={{
                  fontSize: resolvedFontSizes.xl,
                  color: resolvedColors.mutedForeground,
                  paddingLeft: resolvedSpacing.sm,
                }}
              >
                ✕
              </Text>
            </Pressable>
          </View>

          {/* Appearance: Theme */}
          <View style={{ gap: resolvedSpacing.sm }}>
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                color: resolvedColors.textPrimary,
              }}
            >
              Tema Visual
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: resolvedSpacing.sm,
              }}
            >
              {themeOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => updatePreferences({ theme: opt.value })}
                  style={{
                    backgroundColor:
                      theme === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.card,
                    borderWidth: 1,
                    borderColor:
                      theme === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.border,
                    borderRadius: resolvedBorderRadius.md,
                    paddingHorizontal: resolvedSpacing.md,
                    paddingVertical: resolvedSpacing.sm,
                  }}
                >
                  <Text
                    style={{
                      color:
                        theme === opt.value
                          ? resolvedColors.primaryForeground
                          : resolvedColors.textPrimary,
                      fontSize: resolvedFontSizes.sm,
                      fontWeight: theme === opt.value ? "600" : "400",
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Appearance: Font size */}
          <View style={{ gap: resolvedSpacing.sm }}>
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                color: resolvedColors.textPrimary,
              }}
            >
              Tamanho da Fonte
            </Text>
            <View style={{ flexDirection: "row", gap: resolvedSpacing.sm }}>
              {fontOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => updatePreferences({ fontSize: opt.value })}
                  style={{
                    flex: 1,
                    backgroundColor:
                      fontSize === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.card,
                    borderWidth: 1,
                    borderColor:
                      fontSize === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.border,
                    borderRadius: resolvedBorderRadius.md,
                    paddingVertical: resolvedSpacing.sm,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        fontSize === opt.value
                          ? resolvedColors.primaryForeground
                          : resolvedColors.textPrimary,
                      fontSize: resolvedFontSizes.sm,
                      fontWeight: fontSize === opt.value ? "600" : "400",
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Appearance: Spacing */}
          <View style={{ gap: resolvedSpacing.sm }}>
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                color: resolvedColors.textPrimary,
              }}
            >
              Espaçamento
            </Text>
            <View style={{ flexDirection: "row", gap: resolvedSpacing.sm }}>
              {spacingOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => updatePreferences({ spacing: opt.value })}
                  style={{
                    flex: 1,
                    backgroundColor:
                      spacingPref === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.card,
                    borderWidth: 1,
                    borderColor:
                      spacingPref === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.border,
                    borderRadius: resolvedBorderRadius.md,
                    paddingVertical: resolvedSpacing.sm,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        spacingPref === opt.value
                          ? resolvedColors.primaryForeground
                          : resolvedColors.textPrimary,
                      fontSize: resolvedFontSizes.sm,
                      fontWeight: spacingPref === opt.value ? "600" : "400",
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Mode */}
          <View style={{ gap: resolvedSpacing.sm }}>
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                color: resolvedColors.textPrimary,
              }}
            >
              Modo
            </Text>
            <View style={{ flexDirection: "row", gap: resolvedSpacing.sm }}>
              {modeOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => updatePreferences({ mode: opt.value })}
                  style={{
                    flex: 1,
                    backgroundColor:
                      mode === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.card,
                    borderWidth: 1,
                    borderColor:
                      mode === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.border,
                    borderRadius: resolvedBorderRadius.md,
                    paddingVertical: resolvedSpacing.sm,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        mode === opt.value
                          ? resolvedColors.primaryForeground
                          : resolvedColors.textPrimary,
                      fontSize: resolvedFontSizes.sm,
                      fontWeight: mode === opt.value ? "600" : "400",
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Motion */}
          <View style={{ gap: resolvedSpacing.sm }}>
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                color: resolvedColors.textPrimary,
              }}
            >
              Animações
            </Text>
            <View style={{ flexDirection: "row", gap: resolvedSpacing.sm }}>
              {motionOptions.map((opt) => (
                <Pressable
                  key={opt.label}
                  onPress={() =>
                    updatePreferences({ reduceMotion: opt.value })
                  }
                  style={{
                    flex: 1,
                    backgroundColor:
                      reduceMotion === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.card,
                    borderWidth: 1,
                    borderColor:
                      reduceMotion === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.border,
                    borderRadius: resolvedBorderRadius.md,
                    paddingVertical: resolvedSpacing.sm,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        reduceMotion === opt.value
                          ? resolvedColors.primaryForeground
                          : resolvedColors.textPrimary,
                      fontSize: resolvedFontSizes.sm,
                      fontWeight: reduceMotion === opt.value ? "600" : "400",
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Complexity mode */}
          <View style={{ gap: resolvedSpacing.sm }}>
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                color: resolvedColors.textPrimary,
              }}
            >
              Complexidade
            </Text>
            <View style={{ flexDirection: "row", gap: resolvedSpacing.sm }}>
              {complexityOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => updatePreferences({ complexity: opt.value })}
                  style={{
                    flex: 1,
                    backgroundColor:
                      complexity === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.card,
                    borderWidth: 1,
                    borderColor:
                      complexity === opt.value
                        ? resolvedColors.primary
                        : resolvedColors.border,
                    borderRadius: resolvedBorderRadius.md,
                    paddingVertical: resolvedSpacing.sm,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        complexity === opt.value
                          ? resolvedColors.primaryForeground
                          : resolvedColors.textPrimary,
                      fontSize: resolvedFontSizes.sm,
                      fontWeight: complexity === opt.value ? "600" : "400",
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Sign out */}
          <Pressable
            onPress={handleSignOut}
            disabled={isLoading}
            accessibilityLabel="Sair da conta"
            style={{
              backgroundColor: resolvedColors.destructive,
              borderRadius: resolvedBorderRadius.md,
              paddingVertical: resolvedSpacing.md,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                color: resolvedColors.destructiveForeground,
              }}
            >
              {isLoading ? "Saindo…" : "Sair da Conta"}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
