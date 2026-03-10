import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Palette } from "lucide-react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import type {
  ColourTheme,
  FontSize,
  SpacingDensity,
} from "@/presentation/contexts/ThemePreferencesContext";

interface AppearanceFloatingButtonProps {
  /** Base distance from screen bottom (safe-area insets are added automatically). Default 32. */
  baseBottom?: number;
}

interface AppearancePreferencesPanelProps {
  title?: string;
  onClose?: () => void;
}

export function AppearancePreferencesPanel({
  title = "Aparência",
  onClose,
}: AppearancePreferencesPanelProps) {
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
    theme,
    fontSize,
    spacing: spacingPref,
    updatePreferences,
  } = useTheme();

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

  return (
    <ScrollView
      contentContainerStyle={{
        padding: resolvedSpacing.lg,
        gap: resolvedSpacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.xl,
            fontWeight: "700",
            color: resolvedColors.textPrimary,
          }}
        >
          {title}
        </Text>
        {onClose ? (
          <Pressable
            onPress={onClose}
            accessibilityLabel="Fechar painel de aparência"
            hitSlop={12}
          >
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
        ) : null}
      </View>

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
              accessibilityLabel={`Tema ${opt.label}`}
              accessibilityState={{ selected: theme === opt.value }}
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
              accessibilityLabel={`Fonte ${opt.label}`}
              accessibilityState={{ selected: fontSize === opt.value }}
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
              accessibilityLabel={`Espaçamento ${opt.label}`}
              accessibilityState={{ selected: spacingPref === opt.value }}
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
    </ScrollView>
  );
}

export function AppearanceFloatingButton({
  baseBottom = 32,
}: AppearanceFloatingButtonProps) {
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { resolvedColors } = useTheme();

  return (
    <>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: baseBottom + insets.bottom,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: resolvedColors.primary,
          alignItems: "center",
          justifyContent: "center",
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.18,
          shadowRadius: 6,
        }}
        onPress={() => setVisible(true)}
        accessibilityLabel="Personalizar aparência"
        accessibilityHint="Abre opções de tema, tamanho de fonte e espaçamento"
      >
        <Palette size={22} color={resolvedColors.primaryForeground} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: resolvedColors.background }}
        >
          <AppearancePreferencesPanel onClose={() => setVisible(false)} />
        </SafeAreaView>
      </Modal>
    </>
  );
}
