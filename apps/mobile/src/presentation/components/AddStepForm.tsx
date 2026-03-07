import { useState } from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { StepFormModal } from "./StepFormModal";

interface AddStepFormProps {
  onSubmit: (title: string) => void;
}

export function AddStepForm({ onSubmit }: AddStepFormProps) {
  const [open, setOpen] = useState(false);
  const { resolvedColors, resolvedFontSizes, resolvedSpacing } = useTheme();

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Adicionar etapa"
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: resolvedSpacing.xs,
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.xs,
            color: resolvedColors.mutedForeground,
          }}
        >
          + Adicionar etapa
        </Text>
      </Pressable>

      <StepFormModal
        visible={open}
        modalTitle="Adicionar etapa"
        saveLabel="Adicionar"
        initialValue=""
        onSave={(title) => {
          onSubmit(title);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
