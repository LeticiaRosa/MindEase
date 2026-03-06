import { View, Text } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

type LogoProps = { size?: "small" | "medium" | "large" };

export function Logo({ size = "medium" }: LogoProps) {
  const { resolvedColors, resolvedFontSizes, resolvedSpacing } = useTheme();

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        paddingBottom: resolvedSpacing["2xl"],
      }}
    >
      <Text
        style={{
          fontSize:
            size === "small"
              ? resolvedFontSizes["2xl"]
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
            size === "small" ? resolvedFontSizes.sm : resolvedFontSizes.base,
          color: resolvedColors.mutedForeground,
        }}
      >
        Focus on what matters next
      </Text>
    </View>
  );
}
