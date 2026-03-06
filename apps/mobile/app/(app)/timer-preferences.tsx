import { ScrollView, View, Text, SafeAreaView } from "react-native";
import { PageHeader } from "@/presentation/components/PageHeader";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { TimerPreferencesPanel } from "@/presentation/components/TimerPreferencesPanel";

export default function TimerPreferencesScreen() {
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: resolvedColors.background }}
    >
      <PageHeader title="Preferências do Timer" />

      <ScrollView
        contentContainerStyle={{
          padding: resolvedSpacing.lg,
          gap: resolvedSpacing.lg,
        }}
      >
        <TimerPreferencesPanel />
      </ScrollView>
    </SafeAreaView>
  );
}
