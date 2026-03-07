import { Modal, View, Text, Pressable } from "react-native";
import { CheckCircle2, XCircle, Info } from "lucide-react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import type { AlertVariant } from "@/presentation/contexts/AlertContext";

interface AppAlertDialogProps {
  open: boolean;
  title: string;
  message: string;
  variant: AlertVariant;
  onDismiss: () => void;
}

const ICONS: Record<AlertVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function AppAlertDialog({
  open,
  title,
  message,
  variant,
  onDismiss,
}: AppAlertDialogProps) {
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const variantColor =
    variant === "error" ? resolvedColors.destructive : resolvedColors.primary;

  const Icon = ICONS[variant];

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      accessibilityViewIsModal
    >
      {/* Backdrop */}
      <Pressable
        onPress={onDismiss}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: resolvedSpacing.md,
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
            maxWidth: 400,
            gap: resolvedSpacing.md,
          }}
        >
          {/* Icon + title */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: resolvedSpacing.sm,
            }}
          >
            <Icon size={22} color={variantColor} strokeWidth={2} />
            <Text
              style={{
                flex: 1,
                fontSize: resolvedFontSizes.lg,
                fontWeight: "600",
                color: variantColor,
              }}
            >
              {title}
            </Text>
          </View>

          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.mutedForeground,
              lineHeight: resolvedFontSizes.base * 1.5,
            }}
          >
            {message}
          </Text>

          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Entendido"
            style={({ pressed }) => ({
              alignSelf: "flex-end",
              paddingVertical: resolvedSpacing.sm,
              paddingHorizontal: resolvedSpacing.lg,
              borderRadius: resolvedBorderRadius.md,
              backgroundColor: pressed ? variantColor + "cc" : variantColor,
            })}
          >
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                color: "#fff",
                fontWeight: "600",
              }}
            >
              Entendido
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
