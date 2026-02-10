/**
 * MindEase — Design System Theme
 * Shared design tokens for web (CSS-in-JS) and mobile (React Native StyleSheet).
 */

export const colors = {
  background: "#f0f4f8",
  textPrimary: "#1a202c",
  textSecondary: "#718096",
  accent: "#4a90d9",
  accentHover: "#357abd",
  white: "#ffffff",
  border: "#e2e8f0",
  error: "#e53e3e",
  success: "#38a169",
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const theme = {
  colors,
  fontSizes,
  spacing,
  borderRadius,
  fontFamily,
} as const;

export type Theme = typeof theme;
export default theme;
