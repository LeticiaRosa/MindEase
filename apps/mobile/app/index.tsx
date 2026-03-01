import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, fontSizes, spacing } from "@repo/ui/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 MindEase</Text>
      <Text style={styles.subtitle}>Seu assistente de bem-estar cognitivo</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSizes["3xl"],
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
