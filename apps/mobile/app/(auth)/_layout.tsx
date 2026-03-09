import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/presentation/hooks/useAuth";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { AppearanceFloatingButton } from "@/presentation/components/AppearanceFloatingButton";

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const { resolvedColors } = useTheme();

  if (loading) {
    return (
      <View
        style={[styles.loader, { backgroundColor: resolvedColors.background }]}
      >
        <ActivityIndicator size="large" color={resolvedColors.primary} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: resolvedColors.background },
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="magic-link-callback" />
      </Stack>
      <AppearanceFloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
