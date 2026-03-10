import { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface StepFormModalProps {
  visible: boolean;
  modalTitle: string;
  saveLabel?: string;
  initialValue?: string;
  onSave: (title: string) => void;
  onClose: () => void;
}

export function StepFormModal({
  visible,
  modalTitle,
  saveLabel = "Salvar",
  initialValue = "",
  onSave,
  onClose,
}: StepFormModalProps) {
  const [title, setTitle] = useState(initialValue);
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave(title.trim());
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: resolvedColors.background }}
      >
        {/* iOS nav-bar style header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: resolvedSpacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: resolvedColors.border,
          }}
        >
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
            hitSlop={8}
            style={{ minWidth: 70 }}
          >
            <Text
              style={{
                color: resolvedColors.mutedForeground,
                fontSize: resolvedFontSizes.base,
              }}
            >
              Cancelar
            </Text>
          </Pressable>

          <Text
            style={{
              fontSize: resolvedFontSizes.lg,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
            }}
          >
            {modalTitle}
          </Text>

          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityLabel={saveLabel}
            hitSlop={8}
            style={{ minWidth: 70, alignItems: "flex-end" }}
          >
            <Text
              style={{
                color: resolvedColors.primary,
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                opacity: canSave ? 1 : 0.4,
              }}
            >
              {saveLabel}
            </Text>
          </Pressable>
        </View>

        {/* Body */}
        <View
          style={{
            padding: resolvedSpacing.lg,
            gap: resolvedSpacing.xs,
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              fontWeight: "600",
              color: resolvedColors.mutedForeground,
            }}
          >
            Título
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Descrição da etapa…"
            placeholderTextColor={resolvedColors.mutedForeground}
            multiline
            numberOfLines={12}
            textAlignVertical="top"
            autoFocus
            style={{
              backgroundColor: resolvedColors.card,
              borderWidth: 1,
              borderColor: resolvedColors.border,
              borderRadius: resolvedBorderRadius.md,
              paddingHorizontal: resolvedSpacing.md,
              paddingVertical: resolvedSpacing.sm,
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.textPrimary,
              minHeight: 200,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
