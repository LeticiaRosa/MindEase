import { View, Text, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { useTimerPreferences } from "@/presentation/hooks/useTimerPreferences";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

export function TimerPreferencesPanel() {
  const { preferences, updatePreferences } = useTimerPreferences();
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const renderSlider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    unit: string,
    onChange: (v: number) => void,
  ) => (
    <View style={{ gap: resolvedSpacing.xs }}>
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
            color: resolvedColors.textPrimary,
            fontWeight: "500",
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: resolvedFontSizes.sm,
            color: resolvedColors.mutedForeground,
          }}
        >
          {value} {unit}
        </Text>
      </View>
      <Slider
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onSlidingComplete={onChange}
        minimumTrackTintColor={resolvedColors.primary}
        maximumTrackTintColor={resolvedColors.muted}
        thumbTintColor={resolvedColors.primary}
        accessibilityLabel={`${label}: ${value} ${unit}`}
      />
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: resolvedColors.card,
        borderRadius: resolvedBorderRadius.lg,
        gap: resolvedSpacing.lg,
      }}
    >
      <Text
        style={{
          fontSize: resolvedFontSizes.lg,
          fontWeight: "600",
          color: resolvedColors.textPrimary,
        }}
      >
        Preferências do Timer
      </Text>

      {renderSlider(
        "Duração do foco",
        preferences.focusDuration,
        5,
        90,
        5,
        "min",
        (v) => updatePreferences({ focusDuration: v }),
      )}

      {renderSlider(
        "Duração da pausa",
        preferences.breakDuration,
        1,
        30,
        1,
        "min",
        (v) => updatePreferences({ breakDuration: v }),
      )}

      {renderSlider(
        "Duração da pausa longa",
        preferences.longBreakDuration,
        5,
        60,
        5,
        "min",
        (v) => updatePreferences({ longBreakDuration: v }),
      )}

      {renderSlider(
        "Ciclos antes da pausa longa",
        preferences.cyclesBeforeLongBreak,
        1,
        8,
        1,
        "ciclos",
        (v) => updatePreferences({ cyclesBeforeLongBreak: v }),
      )}
    </View>
  );
}
