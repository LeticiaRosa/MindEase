import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { User } from "@/domain/entities/User";
import { UserMenuBottomSheet } from "./UserMenuBottomSheet";
import { CognitiveAlertBanner } from "./CognitiveAlertBanner";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "./Logo";

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
  const { resolvedColors, resolvedFontSizes, resolvedSpacing } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user.user_metadata?.full_name ?? user.email;
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : "ME";

  return (
    <View
      style={{
        backgroundColor: resolvedColors.background,
        borderBottomWidth: 1,
        borderBottomColor: resolvedColors.border,
        paddingHorizontal: resolvedSpacing.md,
        paddingBottom: resolvedSpacing.md,
        paddingTop: insets.top + resolvedSpacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo size="small" />
        <Pressable
          onPress={() => setMenuOpen(true)}
          accessibilityLabel={`Menu do usuário ${displayName}`}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: resolvedColors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              fontWeight: "700",
              color: resolvedColors.primaryForeground,
            }}
          >
            {initials}
          </Text>
        </Pressable>
      </View>

      {alertMessage && onDismissAlert && (
        <CognitiveAlertBanner
          message={alertMessage}
          onDismiss={onDismissAlert}
        />
      )}

      <UserMenuBottomSheet
        user={user}
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </View>
  );
}
