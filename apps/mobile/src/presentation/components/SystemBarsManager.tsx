import { useEffect } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { setStyle } from "expo-navigation-bar";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

/**
 * Syncs the device status bar (top) and navigation bar (bottom) with the
 * current app theme so system chrome always matches the active colour scheme.
 *
 * React Native 0.76+ enforces edge-to-edge on Android: the nav bar is always
 * transparent and draws over content. Its icon/button colour is the only thing
 * we can control via `expo-navigation-bar`; the background colour visible
 * behind it comes from the root view (`ThemedRoot` in _layout.tsx).
 *
 * - Dark theme  → light (white) icons on the transparent dark background
 * - Light themes → dark (black) icons on the transparent light background
 */
export function SystemBarsManager() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (Platform.OS !== "android") return;
    // `setStyle` is the edge-to-edge-safe API in expo-navigation-bar v55.
    // 'dark' style = dark background → light icons; 'light' = light background → dark icons.
    setStyle(isDark ? "dark" : "light");
  }, [isDark]);

  return <StatusBar style={isDark ? "light" : "dark"} translucent />;
}
