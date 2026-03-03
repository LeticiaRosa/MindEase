import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import type { Task } from "@/domain/entities/Task";

interface TaskEditFormProps {
  task: Task;
  visible: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    params: { title?: string; description?: string },
  ) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
}

export function TaskEditForm({
  task,
  visible,
  onClose,
  onSave,
  onDelete,
  onArchive,
}: TaskEditFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(task.id, {
      title: trimmed,
      description: description.trim() || undefined,
    });
    onClose();
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
        {/* Header */}
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
          <Pressable onPress={onClose}>
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
            Editar Tarefa
          </Text>
          <Pressable onPress={handleSave}>
            <Text
              style={{
                color: resolvedColors.primary,
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
              }}
            >
              Salvar
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: resolvedSpacing.lg,
            gap: resolvedSpacing.lg,
          }}
        >
          {/* Title */}
          <View style={{ gap: resolvedSpacing.xs }}>
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
              placeholder="Nome da tarefa"
              placeholderTextColor={resolvedColors.mutedForeground}
              style={{
                backgroundColor: resolvedColors.card,
                borderWidth: 1,
                borderColor: resolvedColors.border,
                borderRadius: resolvedBorderRadius.md,
                paddingHorizontal: resolvedSpacing.md,
                paddingVertical: resolvedSpacing.sm,
                fontSize: resolvedFontSizes.base,
                color: resolvedColors.textPrimary,
              }}
            />
          </View>

          {/* Description */}
          <View style={{ gap: resolvedSpacing.xs }}>
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                fontWeight: "600",
                color: resolvedColors.mutedForeground,
              }}
            >
              Descrição (opcional)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Detalhes adicionais…"
              placeholderTextColor={resolvedColors.mutedForeground}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                backgroundColor: resolvedColors.card,
                borderWidth: 1,
                borderColor: resolvedColors.border,
                borderRadius: resolvedBorderRadius.md,
                paddingHorizontal: resolvedSpacing.md,
                paddingVertical: resolvedSpacing.sm,
                fontSize: resolvedFontSizes.base,
                color: resolvedColors.textPrimary,
                minHeight: 100,
              }}
            />
          </View>

          {/* Action buttons */}
          <View
            style={{ gap: resolvedSpacing.sm, marginTop: resolvedSpacing.lg }}
          >
            {onArchive && (
              <Pressable
                onPress={() => {
                  onArchive(task.id);
                  onClose();
                }}
                style={{
                  backgroundColor: resolvedColors.muted,
                  borderRadius: resolvedBorderRadius.md,
                  paddingVertical: resolvedSpacing.md,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: resolvedFontSizes.base,
                    color: resolvedColors.mutedForeground,
                    fontWeight: "600",
                  }}
                >
                  📦 Arquivar Tarefa
                </Text>
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                onPress={() => {
                  onDelete(task.id);
                  onClose();
                }}
                style={{
                  backgroundColor: resolvedColors.destructive,
                  borderRadius: resolvedBorderRadius.md,
                  paddingVertical: resolvedSpacing.md,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: resolvedFontSizes.base,
                    color: resolvedColors.destructiveForeground,
                    fontWeight: "600",
                  }}
                >
                  🗑 Excluir Tarefa
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
