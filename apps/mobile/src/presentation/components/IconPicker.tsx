import { View, Text, Pressable, ScrollView } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

const ICONS = [
  "📋",
  "🎯",
  "📚",
  "💼",
  "🏋️",
  "🧘",
  "🎨",
  "💻",
  "🏠",
  "🌅",
  "🌙",
  "☀️",
  "📝",
  "🧠",
  "❤️",
  "⭐",
  "🔥",
  "🎵",
  "🌿",
  "🐾",
  "✈️",
  "🎮",
  "📱",
  "🧪",
];

interface IconPickerProps {
  selected?: string;
  onSelect: (icon: string) => void;
}

export function IconPicker({ selected, onSelect }: IconPickerProps) {
  const { resolvedColors, resolvedSpacing, resolvedBorderRadius } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: resolvedSpacing.sm,
      }}
    >
      {ICONS.map((icon) => {
        const isSelected = icon === selected;
        return (
          <Pressable
            key={icon}
            onPress={() => onSelect(icon)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Ícone ${icon}`}
            style={{
              width: 44,
              height: 44,
              borderRadius: resolvedBorderRadius.md,
              borderWidth: 2,
              borderColor: isSelected
                ? resolvedColors.primary
                : resolvedColors.border,
              backgroundColor: isSelected
                ? resolvedColors.accent
                : resolvedColors.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 22 }}>{icon}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
