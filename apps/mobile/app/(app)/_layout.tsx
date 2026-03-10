import { Redirect, Stack } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { BrainTodayProvider } from "@/presentation/contexts/BrainTodayContext";
import { AlertPreferencesProvider } from "@/presentation/contexts/AlertPreferencesContext";
import { ActivitySignalsProvider } from "@/presentation/contexts/ActivitySignalsContext";
import { ActiveRoutineProvider } from "@/presentation/contexts/ActiveRoutineContext";
import { TimerProvider } from "@/presentation/contexts/TimerContext";
import { useTimerPreferences } from "@/presentation/hooks/useTimerPreferences";
import { useOnboarding } from "@/presentation/contexts/OnboardingContext";
import { GuidedOnboardingScreen } from "@/presentation/components/GuidedOnboardingScreen";

function TimerPreferencesBootstrap() {
  useTimerPreferences();
  return null;
}

export default function AppLayout() {
  const { user, loading } = useAuth();
  const { resolvedColors, isHydrated } = useTheme();
  const { isHydrated: onboardingHydrated, shouldShowOnboarding } =
    useOnboarding();

  if (loading || !isHydrated || !onboardingHydrated) {
    return (
      <View
        style={[styles.loader, { backgroundColor: resolvedColors.background }]}
      >
        <ActivityIndicator size="large" color={resolvedColors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (shouldShowOnboarding) {
    return (
      <ActiveRoutineProvider>
        <GuidedOnboardingScreen />
      </ActiveRoutineProvider>
    );
  }

  return (
    <BrainTodayProvider>
      <AlertPreferencesProvider>
        <ActivitySignalsProvider>
          <ActiveRoutineProvider>
            <TimerProvider>
              <TimerPreferencesBootstrap />
              <View style={{ flex: 1 }}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: resolvedColors.background,
                    },
                  }}
                >
                  <Stack.Screen name="dashboard" />
                  <Stack.Screen name="manage-routines" />
                  <Stack.Screen name="archived-tasks" />
                  <Stack.Screen name="cognitive-alert-config" />
                </Stack>
              </View>
            </TimerProvider>
          </ActiveRoutineProvider>
        </ActivitySignalsProvider>
      </AlertPreferencesProvider>
    </BrainTodayProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
