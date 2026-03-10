import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";
import { CheckCircle2, Info, X, XCircle } from "lucide-react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import type { AlertVariant } from "@/presentation/contexts/AlertContext";

const AUTO_DISMISS_MS = 5000;

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

  const slideY = useRef(new Animated.Value(120)).current;
  const progress = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const variantColor =
    variant === "error" ? resolvedColors.destructive : resolvedColors.primary;

  const Icon = ICONS[variant];

  useEffect(() => {
    if (!open) return;

    slideY.setValue(120);
    progress.setValue(1);

    Animated.spring(slideY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 22,
      stiffness: 200,
    }).start();

    Animated.timing(progress, {
      toValue: 0,
      duration: AUTO_DISMISS_MS,
      useNativeDriver: false,
    }).start();

    timerRef.current = setTimeout(onDismiss, AUTO_DISMISS_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, onDismiss, progress, slideY]);

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      accessibilityViewIsModal
    >
      {/* No backdrop — transparent so the app is visible beneath */}
      <View
        pointerEvents="box-none"
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: resolvedSpacing.md,
          paddingBottom: resolvedSpacing.xl,
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateY: slideY }],
            backgroundColor: resolvedColors.card,
            borderWidth: 1,
            borderColor: resolvedColors.border,
            borderLeftWidth: 4,
            borderLeftColor: variantColor,
            borderRadius: resolvedBorderRadius.lg,
            padding: resolvedSpacing.md,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          {/* Icon + title + close */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: resolvedSpacing.sm,
              marginBottom: resolvedSpacing.xs,
            }}
          >
            <Icon size={18} color={variantColor} strokeWidth={2} />
            <Text
              style={{
                flex: 1,
                fontSize: resolvedFontSizes.base,
                fontWeight: "600",
                color: resolvedColors.foreground,
              }}
            >
              {title}
            </Text>
            <Pressable
              onPress={onDismiss}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={8}
            >
              <X
                size={16}
                color={resolvedColors.mutedForeground}
                strokeWidth={2}
              />
            </Pressable>
          </View>

          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.mutedForeground,
              lineHeight: resolvedFontSizes.sm * 1.5,
              marginBottom: resolvedSpacing.sm,
            }}
          >
            {message}
          </Text>

          {/* Auto-dismiss progress bar */}
          <View
            style={{
              height: 2,
              backgroundColor: resolvedColors.border,
              borderRadius: resolvedBorderRadius.full,
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                height: "100%",
                backgroundColor: variantColor,
                opacity: 0.6,
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              }}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
