import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import type { User } from "@/domain/entities/User";
import { signOut } from "@/application/useCases/signOut";
import { SupabaseAuthRepository } from "@/infrastructure/adapters/SupabaseAuthRepository";
import { useRouter } from "expo-router";
import { colors, fontSizes, spacing, borderRadius } from "@repo/ui/theme";

const repository = new SupabaseAuthRepository();

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const displayName = user.user_metadata?.full_name ?? user.email;

  async function handleSignOut() {
    setIsLoading(true);
    await signOut(repository);
    setOpen(false);
    router.replace("/(auth)/login");
  }

  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : "ME";

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.avatar}
        accessibilityLabel={`Menu do usuário ${displayName}`}
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <Text style={styles.email} numberOfLines={1}>
              {user.email}
            </Text>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSignOut}
              disabled={isLoading}
              accessibilityLabel="Sair da conta"
            >
              <Text style={styles.signOutText}>
                {isLoading ? "Saindo…" : "Sair"}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: fontSizes.sm,
    fontWeight: "700",
    color: colors.primaryForeground,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: spacing.lg,
  },
  menu: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 200,
    overflow: "hidden",
  },
  email: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    padding: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  menuItem: {
    padding: spacing.md,
  },
  signOutText: {
    fontSize: fontSizes.base,
    color: colors.destructive,
  },
});
