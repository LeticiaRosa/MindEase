import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, fontSizes, spacing, borderRadius } from "@repo/ui/theme";

interface CognitiveAlertBannerProps {
  message: string;
  onDismiss: () => void;
}

export function CognitiveAlertBanner({
  message,
  onDismiss,
}: CognitiveAlertBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.message} accessibilityRole="alert">
        {message}
      </Text>
      <TouchableOpacity
        onPress={onDismiss}
        style={styles.dismissButton}
        accessibilityLabel="Dispensar alerta"
      >
        <Text style={styles.dismissText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
  },
  dismissButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  dismissText: {
    fontSize: fontSizes.base,
    color: colors.mutedForeground,
  },
});
