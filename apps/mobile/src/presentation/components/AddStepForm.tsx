import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface AddStepFormProps {
  onSubmit: (title: string) => void;
}

export function AddStepForm({ onSubmit }: AddStepFormProps) {
  const [title, setTitle] = useState("");
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setTitle("");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        gap: resolvedSpacing.xs,
        alignItems: "center",
        marginTop: resolvedSpacing.xs,
      }}
    >
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Nova etapa…"
        placeholderTextColor={resolvedColors.mutedForeground}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: resolvedColors.border,
          borderRadius: resolvedBorderRadius.sm,
          paddingHorizontal: resolvedSpacing.sm,
          paddingVertical: resolvedSpacing.xs,
          fontSize: resolvedFontSizes.sm,
          color: resolvedColors.textPrimary,
          backgroundColor: resolvedColors.background,
        }}
      />
      <Pressable
        onPress={handleSubmit}
        disabled={!title.trim()}
        style={{
          paddingHorizontal: resolvedSpacing.sm,
          paddingVertical: resolvedSpacing.xs,
          borderRadius: resolvedBorderRadius.sm,
          backgroundColor: title.trim()
            ? resolvedColors.primary
            : resolvedColors.muted,
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.sm,
            color: title.trim()
              ? resolvedColors.primaryForeground
              : resolvedColors.mutedForeground,
            fontWeight: "600",
          }}
        >
          +
        </Text>
      </Pressable>
    </View>
  );
}
