import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";
import { TASK_STATUS_LABELS } from "@/domain/valueObjects/TaskStatus";

interface CreateTaskFABProps {
  onSubmit: (title: string, status: TaskStatus) => void;
  /** The kanban column where the task will be created. Default "todo". */
  defaultStatus?: TaskStatus;
  /**
   * Base distance from the bottom of the screen (safe-area insets are added
   * automatically). Default 96 — sits just above the AppearanceFloatingButton.
   */
  baseBottom?: number;
}

export function CreateTaskFAB({
  onSubmit,
  defaultStatus = "todo",
  baseBottom = 96,
}: CreateTaskFABProps) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const handleOpen = () => {
    setTitle("");
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setTitle("");
  };

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed, defaultStatus);
    handleClose();
  };

  return (
    <>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: baseBottom + insets.bottom,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: resolvedColors.primary,
          alignItems: "center",
          justifyContent: "center",
          elevation: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
        }}
        onPress={handleOpen}
        accessibilityLabel="Criar nova tarefa"
        accessibilityHint="Abre um painel para adicionar uma nova tarefa"
      >
        <Plus size={24} color={resolvedColors.primaryForeground} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={handleClose}
        onShow={() => inputRef.current?.focus()}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "flex-end" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={handleClose}
            accessibilityLabel="Fechar"
          />
          <View
            style={{
              backgroundColor: resolvedColors.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: resolvedSpacing.xl,
              paddingBottom: resolvedSpacing.xl + insets.bottom,
              gap: resolvedSpacing.md,
              borderTopWidth: 1,
              borderTopColor: resolvedColors.border,
            }}
          >
            {/* Handle bar */}
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: resolvedColors.muted,
                alignSelf: "center",
                marginBottom: resolvedSpacing.xs,
              }}
            />

            <Text
              style={{
                fontSize: resolvedFontSizes.lg,
                fontWeight: "700",
                color: resolvedColors.textPrimary,
              }}
            >
              Nova tarefa em{" "}
              <Text style={{ color: resolvedColors.primary }}>
                {TASK_STATUS_LABELS[defaultStatus]}
              </Text>
            </Text>

            <TextInput
              ref={inputRef}
              value={title}
              onChangeText={setTitle}
              placeholder="Qual é a tarefa?"
              placeholderTextColor={resolvedColors.mutedForeground}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              style={{
                fontSize: resolvedFontSizes.base,
                borderWidth: 1,
                borderColor: resolvedColors.border,
                borderRadius: resolvedBorderRadius.md,
                paddingHorizontal: resolvedSpacing.md,
                paddingVertical: resolvedSpacing.md,
                color: resolvedColors.textPrimary,
                backgroundColor: resolvedColors.background,
              }}
              accessibilityLabel="Campo de título da tarefa"
            />

            <View style={{ flexDirection: "row", gap: resolvedSpacing.sm }}>
              <Pressable
                onPress={handleClose}
                style={{
                  flex: 1,
                  paddingVertical: resolvedSpacing.md,
                  borderRadius: resolvedBorderRadius.md,
                  borderWidth: 1,
                  borderColor: resolvedColors.border,
                  alignItems: "center",
                }}
                accessibilityLabel="Cancelar"
              >
                <Text
                  style={{
                    fontSize: resolvedFontSizes.base,
                    color: resolvedColors.textSecondary,
                  }}
                >
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={!title.trim()}
                style={{
                  flex: 2,
                  paddingVertical: resolvedSpacing.md,
                  borderRadius: resolvedBorderRadius.md,
                  backgroundColor: title.trim()
                    ? resolvedColors.primary
                    : resolvedColors.muted,
                  alignItems: "center",
                }}
                accessibilityLabel="Adicionar tarefa"
              >
                <Text
                  style={{
                    fontSize: resolvedFontSizes.base,
                    fontWeight: "600",
                    color: title.trim()
                      ? resolvedColors.primaryForeground
                      : resolvedColors.mutedForeground,
                  }}
                >
                  Adicionar
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
