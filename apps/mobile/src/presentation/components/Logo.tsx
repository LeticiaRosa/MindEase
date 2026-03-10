import { View, Text } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

type LogoProps = { size?: "small" | "medium" | "large" };

export function Logo({ size = "medium" }: LogoProps) {
  const { resolvedColors, resolvedFontSizes } = useTheme();

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Text
        style={{
          fontSize:
            size === "small"
              ? resolvedFontSizes["xl"]
              : size === "medium"
                ? resolvedFontSizes["3xl"]
                : resolvedFontSizes["4xl"],
          fontWeight: "700",
          color: resolvedColors.primary,
        }}
      >
        MindEase
      </Text>
      <Text
        style={{
          fontSize:
            size === "small" ? resolvedFontSizes.xs : resolvedFontSizes.base,
          color: resolvedColors.mutedForeground,
        }}
      >
        Focus on what matters next
      </Text>
    </View>
  );
}
