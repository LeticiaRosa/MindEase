import { View, Pressable } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import {
  getLucideIcon,
  ROUTINE_ICON_NAMES,
  ROUTINE_ICON_LABELS,
} from "@/lib/routineIcons";

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
      {ROUTINE_ICON_NAMES.map((name) => {
        const LucideIcon = getLucideIcon(name)!;
        const isSelected = name === selected;
        return (
          <Pressable
            key={name}
            onPress={() => onSelect(name)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={ROUTINE_ICON_LABELS[name] ?? name}
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
            <LucideIcon
              size={22}
              color={
                isSelected ? resolvedColors.primary : resolvedColors.textPrimary
              }
            />
          </Pressable>
        );
      })}
    </View>
  );
}
