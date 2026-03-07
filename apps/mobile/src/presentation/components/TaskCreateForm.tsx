import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface TaskCreateFormProps {
  onSubmit: (title: string) => void;
}

export function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
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
        gap: resolvedSpacing.sm,
        alignItems: "center",
      }}
    >
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Nova tarefa…"
        placeholderTextColor={resolvedColors.mutedForeground}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        style={{
          flex: 1,
          backgroundColor: resolvedColors.background,
          borderWidth: 1,
          borderColor: resolvedColors.border,
          borderRadius: resolvedBorderRadius.md,
          paddingHorizontal: resolvedSpacing.sm,
          paddingVertical: resolvedSpacing.sm,
          fontSize: resolvedFontSizes.base,
          color: resolvedColors.textPrimary,
        }}
      />
      <Pressable
        onPress={handleSubmit}
        disabled={!title.trim()}
        style={{
          backgroundColor: title.trim()
            ? resolvedColors.primary
            : resolvedColors.muted,
          borderRadius: resolvedBorderRadius.md,
          paddingHorizontal: resolvedSpacing.md,
          paddingVertical: resolvedSpacing.sm,
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.base,
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
