import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface AddStepFormProps {
  onSubmit: (title: string) => void;
}

export function AddStepForm({ onSubmit }: AddStepFormProps) {
  const [expanded, setExpanded] = useState(false);
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
    setExpanded(false);
  };

  const handleCancel = () => {
    setTitle("");
    setExpanded(false);
  };

  if (!expanded) {
    return (
      <Pressable
        onPress={() => setExpanded(true)}
        accessibilityRole="button"
        accessibilityLabel="Adicionar etapa"
        style={{
          flexDirection: "row",
          paddingVertical: resolvedSpacing.xs,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.sm,
            color: resolvedColors.textSecondary,
            padding: resolvedSpacing.sm,
            backgroundColor: resolvedColors.muted,
            borderRadius: 9999,
          }}
        >
          + Adicionar etapa
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={{ gap: resolvedSpacing.xs }}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Descrição da etapa…"
        placeholderTextColor={resolvedColors.mutedForeground}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        autoFocus
        style={{
          borderWidth: 1,
          borderColor: resolvedColors.ring,
          borderRadius: resolvedBorderRadius.sm,
          paddingHorizontal: resolvedSpacing.sm,
          paddingVertical: resolvedSpacing.xs,
          fontSize: resolvedFontSizes.sm,
          color: resolvedColors.textPrimary,
          backgroundColor: resolvedColors.background,
        }}
      />
      <View style={{ flexDirection: "row", gap: resolvedSpacing.sm }}>
        <Pressable
          onPress={handleSubmit}
          disabled={!title.trim()}
          accessibilityRole="button"
          accessibilityLabel="Adicionar etapa"
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: resolvedSpacing.sm,
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
            Adicionar
          </Text>
        </Pressable>
        <Pressable
          onPress={handleCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: resolvedSpacing.sm,
            borderRadius: resolvedBorderRadius.sm,
            backgroundColor: resolvedColors.muted,
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.mutedForeground,
              fontWeight: "600",
            }}
          >
            Cancelar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
