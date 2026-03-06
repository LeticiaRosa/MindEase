import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  const { resolvedColors, resolvedFontSizes, resolvedSpacing } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: resolvedSpacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: resolvedColors.border,
      }}
    >
      <Text
        style={{
          fontSize: resolvedFontSizes.xl,
          fontWeight: "700",
          color: resolvedColors.textPrimary,
          lineHeight: resolvedFontSizes.xl * 1.3,
          flex: 1,
        }}
      >
        {title}
      </Text>
      <Pressable
        onPress={onBack ?? (() => router.back())}
        accessibilityLabel="Voltar"
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.base,
            color: resolvedColors.primary,
          }}
        >
          ← Voltar
        </Text>
      </Pressable>
    </View>
  );
}
