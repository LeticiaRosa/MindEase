import { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

const AUTO_DISMISS_MS = 15_000;

interface CognitiveAlertBannerProps {
  message: string;
  onDismiss: () => void;
}

export function CognitiveAlertBanner({
  message,
  onDismiss,
}: CognitiveAlertBannerProps) {
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    timerRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(onDismiss);
    }, AUTO_DISMISS_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fadeAnim, onDismiss]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: resolvedColors.accent,
        borderRadius: resolvedBorderRadius.md,
        padding: resolvedSpacing.md,
        marginBottom: resolvedSpacing.md,
        gap: resolvedSpacing.sm,
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: resolvedFontSizes.base,
          color: resolvedColors.textPrimary,
        }}
        accessibilityRole="alert"
      >
        {message}
      </Text>
      <Pressable
        onPress={onDismiss}
        accessibilityLabel="Dispensar alerta"
        hitSlop={8}
        style={{
          padding: resolvedSpacing.xs,
          borderRadius: resolvedBorderRadius.sm,
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.base,
            color: resolvedColors.mutedForeground,
          }}
        >
          ✕
        </Text>
      </Pressable>
    </Animated.View>
  );
}
