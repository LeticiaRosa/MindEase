import { View, Text, StyleSheet } from "react-native";
import type { User } from "@/domain/entities/User";
import { UserMenu } from "./UserMenu";
import { CognitiveAlertBanner } from "./CognitiveAlertBanner";
import { colors, fontSizes, spacing } from "@repo/ui/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DashboardHeaderProps {
  user: User;
  alertMessage?: string;
  onDismissAlert?: () => void;
}

export function DashboardHeader({
  user,
  alertMessage,
  onDismissAlert,
}: DashboardHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.row}>
        <Text style={styles.logo}>🧠 MindEase</Text>
        <UserMenu user={user} />
      </View>

      {alertMessage && onDismissAlert && (
        <CognitiveAlertBanner
          message={alertMessage}
          onDismiss={onDismissAlert}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  logo: {
    fontSize: fontSizes.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
