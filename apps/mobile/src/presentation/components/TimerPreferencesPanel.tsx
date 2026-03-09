import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useTimerPreferences } from "@/presentation/hooks/useTimerPreferences";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface NumberInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}

function NumberInput({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: NumberInputProps) {
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const commit = (raw: string) => {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      const clamped = clamp(parsed);
      onChange(clamped);
      setText(String(clamped));
    } else {
      setText(String(value));
    }
  };

  const borderColor = focused
    ? resolvedColors.primary
    : (resolvedColors.border ?? resolvedColors.muted);

  return (
    <View style={{ gap: resolvedSpacing.xs, width: "60%" }}>
      <Text
        style={{
          fontSize: resolvedFontSizes.sm,
          fontWeight: "500",
          color: resolvedColors.textPrimary,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          gap: resolvedSpacing.sm,
        }}
      >
        {/* Text input */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1.5,
            borderColor,
            borderRadius: resolvedBorderRadius.md,
            backgroundColor: resolvedColors.background,
            paddingHorizontal: resolvedSpacing.md,
            gap: resolvedSpacing.xs,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            onBlur={() => {
              setFocused(false);
              commit(text);
            }}
            onFocus={() => setFocused(true)}
            onSubmitEditing={() => commit(text)}
            keyboardType="number-pad"
            returnKeyType="done"
            selectTextOnFocus
            accessibilityLabel={`${label}: ${value} ${unit}`}
            style={{
              flex: 1,
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.textPrimary,
              paddingVertical: resolvedSpacing.sm,
              minHeight: 60,
            }}
          />
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.mutedForeground,
            }}
          >
            {unit}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: resolvedFontSizes.xs,
          color: resolvedColors.mutedForeground,
        }}
      >
        Entre {min} e {max} {unit}
      </Text>
    </View>
  );
}

export function TimerPreferencesPanel() {
  const { preferences, updatePreferences, isUpdating } = useTimerPreferences();
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const [draft, setDraft] = useState({
    focusDuration: preferences.focusDuration,
    breakDuration: preferences.breakDuration,
    longBreakDuration: preferences.longBreakDuration,
    cyclesBeforeLongBreak: preferences.cyclesBeforeLongBreak,
  });

  const update = (field: keyof typeof draft) => (v: number) =>
    setDraft((prev) => ({ ...prev, [field]: v }));

  const handleSave = () => updatePreferences(draft);

  return (
    <View
      style={{
        backgroundColor: resolvedColors.card,
        borderRadius: resolvedBorderRadius.lg,
        gap: resolvedSpacing.lg,
      }}
    >
      <NumberInput
        label="Duração do foco"
        value={draft.focusDuration}
        min={1}
        max={120}
        unit="min"
        onChange={update("focusDuration")}
      />

      <NumberInput
        label="Duração da pausa"
        value={draft.breakDuration}
        min={1}
        max={60}
        unit="min"
        onChange={update("breakDuration")}
      />

      <NumberInput
        label="Duração da pausa longa"
        value={draft.longBreakDuration}
        min={1}
        max={120}
        unit="min"
        onChange={update("longBreakDuration")}
      />

      <NumberInput
        label="Ciclos antes da pausa longa"
        value={draft.cyclesBeforeLongBreak}
        min={1}
        max={10}
        unit="ciclos"
        onChange={update("cyclesBeforeLongBreak")}
      />

      <Pressable
        onPress={handleSave}
        disabled={isUpdating}
        accessibilityRole="button"
        accessibilityLabel="Salvar preferências"
        style={({ pressed }) => ({
          backgroundColor:
            isUpdating || pressed
              ? resolvedColors.primary + "cc"
              : resolvedColors.primary,
          borderRadius: resolvedBorderRadius.md,
          paddingVertical: resolvedSpacing.md,
          alignItems: "center",
          opacity: isUpdating ? 0.7 : 1,
        })}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.base,
            fontWeight: "600",
            color: resolvedColors.primaryForeground,
          }}
        >
          {isUpdating ? "Salvando..." : "Salvar"}
        </Text>
      </Pressable>
    </View>
  );
}
