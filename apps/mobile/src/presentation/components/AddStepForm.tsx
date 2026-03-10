import { useState } from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { StepFormModal } from "./StepFormModal";

interface AddStepFormProps {
  onSubmit: (title: string) => void;
}

export function AddStepForm({ onSubmit }: AddStepFormProps) {
  const [open, setOpen] = useState(false);
  const { resolvedColors, resolvedSpacing } = useTheme();

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Adicionar step"
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: resolvedSpacing.xs,
        }}
      >
        <Text
          style={{
            color: resolvedColors.mutedForeground,
          }}
        >
          + Adicionar step
        </Text>
      </Pressable>

      <StepFormModal
        visible={open}
        modalTitle="Adicionar step"
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
