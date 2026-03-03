import { View, Text, ScrollView, Pressable } from "react-native";
import type { Routine } from "@/domain/entities/Routine";
import { RoutineIcon } from "./RoutineIcon";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface RoutineSelectorProps {
  routines: Routine[];
  activeRoutineId: string | null;
  onSelect: (id: string) => void;
  onManage?: () => void;
}

export function RoutineSelector({
  routines,
  activeRoutineId,
  onSelect,
  onManage,
}: RoutineSelectorProps) {
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  return (
    <View style={{ gap: resolvedSpacing.sm }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.sm,
            fontWeight: "600",
            color: resolvedColors.mutedForeground,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Kambans
        </Text>
        {onManage && (
          <Pressable onPress={onManage} accessibilityLabel="Gerenciar rotinas">
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                color: resolvedColors.primary,
                fontWeight: "500",
              }}
            >
              Gerenciar
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: resolvedSpacing.sm }}
      >
        {routines.map((routine) => {
          const isActive = routine.id === activeRoutineId;
          return (
            <Pressable
              key={routine.id}
              onPress={() => onSelect(routine.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={routine.name}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: resolvedSpacing.xs,
                backgroundColor: isActive
                  ? resolvedColors.primary
                  : resolvedColors.card,
                borderWidth: 1,
                borderColor: isActive
                  ? resolvedColors.primary
                  : resolvedColors.border,
                borderRadius: resolvedBorderRadius.full,
                paddingHorizontal: resolvedSpacing.md,
                paddingVertical: resolvedSpacing.sm,
              }}
            >
              <RoutineIcon
                name={routine.icon ?? "notebook-pen"}
                size={16}
                color={
                  isActive
                    ? resolvedColors.primaryForeground
                    : resolvedColors.textPrimary
                }
              />
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  fontWeight: isActive ? "600" : "400",
                  color: isActive
                    ? resolvedColors.primaryForeground
                    : resolvedColors.textPrimary,
                }}
              >
                {routine.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
