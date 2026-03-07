import { Modal, View, Text, Pressable } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal
    >
      {/* Backdrop */}
      <Pressable
        onPress={onCancel}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: resolvedSpacing.lg,
        }}
      >
        {/* Card — stop propagation so tapping inside doesn't close */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: resolvedColors.card,
            borderWidth: 1,
            borderColor: resolvedColors.border,
            borderRadius: resolvedBorderRadius.xl ?? resolvedBorderRadius.lg,
            padding: resolvedSpacing.lg,
            width: "100%",
            maxWidth: 360,
            gap: resolvedSpacing.md,
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.mutedForeground,
              lineHeight: resolvedFontSizes.sm * 1.5,
            }}
          >
            {description}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: resolvedSpacing.sm,
            }}
          >
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
              style={{
                paddingVertical: resolvedSpacing.xs,
                paddingHorizontal: resolvedSpacing.md,
                borderRadius: resolvedBorderRadius.md,
                backgroundColor: resolvedColors.muted,
              }}
            >
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.mutedForeground,
                  fontWeight: "500",
                }}
              >
                Cancelar
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel="Excluir"
              style={{
                paddingVertical: resolvedSpacing.xs,
                paddingHorizontal: resolvedSpacing.md,
                borderRadius: resolvedBorderRadius.md,
                backgroundColor: resolvedColors.destructive,
              }}
            >
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                Excluir
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
