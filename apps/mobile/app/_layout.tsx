import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ThemePreferencesProvider,
  useTheme,
} from "@/presentation/contexts/ThemePreferencesContext";
import { SystemBarsManager } from "@/presentation/components/SystemBarsManager";
import { AlertProvider } from "@/presentation/contexts/AlertContext";
import { OnboardingProvider } from "@/presentation/contexts/OnboardingContext";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

/**
 * Themed shell that owns both the root view and every navigation screen layer.
 *
 * On Android (RN 0.76+ edge-to-edge) the system nav bar is always transparent —
 * the colour visible behind it comes from the view that is drawn underneath.
 * React Navigation's Stack renders its own background layers on top of
 * GestureHandlerRootView, so setting only the root view is not enough.
 * `contentStyle` propagates the theme background to every screen layer,
 * eliminating the black strip that would otherwise show through the nav bar.
 */
function AppShell() {
  const { resolvedColors } = useTheme();
  const bg = resolvedColors.background;

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: bg }}>
        <AlertProvider>
          <SystemBarsManager />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: bg },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </AlertProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemePreferencesProvider>
        <OnboardingProvider>
          <AppShell />
        </OnboardingProvider>
      </ThemePreferencesProvider>
    </QueryClientProvider>
  );
}
