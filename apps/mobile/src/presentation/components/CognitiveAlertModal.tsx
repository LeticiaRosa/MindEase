import { View, Text, Pressable, Modal } from "react-native";
import type { AlertPayload } from "@/domain/entities/AlertPayload";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface CognitiveAlertModalProps {
  payload: AlertPayload;
  onDismiss: () => void;
}

export function CognitiveAlertModal({
  payload,
  onDismiss,
}: CognitiveAlertModalProps) {
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
          padding: resolvedSpacing.xl,
        }}
      >
        <View
          style={{
            backgroundColor: resolvedColors.background,
            borderRadius: resolvedBorderRadius.lg,
            padding: resolvedSpacing.xl,
            width: "100%",
            maxWidth: 360,
            gap: resolvedSpacing.lg,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 48 }}>🧠</Text>
          <Text
            style={{
              fontSize: resolvedFontSizes.lg,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
              textAlign: "center",
            }}
          >
            Alerta Cognitivo
          </Text>
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.textPrimary,
              textAlign: "center",
              lineHeight: resolvedFontSizes.base * 1.5,
            }}
          >
            {payload.message}
          </Text>
          <Pressable
            onPress={onDismiss}
            accessibilityLabel="Entendi"
            style={{
              backgroundColor: resolvedColors.primary,
              borderRadius: resolvedBorderRadius.md,
              paddingHorizontal: resolvedSpacing.xl,
              paddingVertical: resolvedSpacing.md,
            }}
          >
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                color: resolvedColors.primaryForeground,
              }}
            >
              Entendi
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
