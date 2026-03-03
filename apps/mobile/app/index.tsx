import { Redirect } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const { resolvedColors } = useTheme();

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: resolvedColors.background },
        ]}
      >
        <ActivityIndicator size="large" color={resolvedColors.primary} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
