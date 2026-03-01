/**
 * Design tokens compartilhados entre web e mobile
 * Compatível com React Native
 */

export const colors = {
  // Light theme
  background: "#FFFFFF",
  foreground: "#18181B",
  primary: "#F59E0B",
  primaryForeground: "#FEFCE8",
  secondary: "#EAB308",
  secondaryForeground: "#27272A",
  muted: "#F4F4F5",
  mutedForeground: "#71717A",
  accent: "#F4F4F5",
  accentForeground: "#27272A",
  destructive: "#EF4444",
  border: "#E4E4E7",
  input: "#E4E4E7",
  ring: "#A1A1AA",
  textPrimary: "#18181B",
  textSecondary: "#71717A",
} as const;

export const darkColors = {
  background: "#18181B",
  foreground: "#FAFAFA",
  primary: "#EAB308",
  primaryForeground: "#27272A",
  secondary: "#EAB308",
  secondaryForeground: "#FAFAFA",
  muted: "#3F3F46",
  mutedForeground: "#A1A1AA",
  accent: "#3F3F46",
  accentForeground: "#FAFAFA",
  destructive: "#F87171",
  border: "rgba(255, 255, 255, 0.1)",
  input: "rgba(255, 255, 255, 0.15)",
  ring: "#71717A",
  textPrimary: "#FAFAFA",
  textSecondary: "#A1A1AA",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const fontWeights = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
  "2xl": 18,
  full: 9999,
} as const;
