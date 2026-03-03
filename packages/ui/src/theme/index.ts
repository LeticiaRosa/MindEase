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

// Approx. hex conversions from oklch — mirrors :root[data-theme="soft"] in index.css
export const softColors = {
  background: "#F9FAFB", // oklch(0.98 0.005 247.839) — near-white, cool-tinted
  foreground: "#3B3D4E", // oklch(0.28 0.02 261.692)  — dark, blue-gray
  card: "#F5F7FA", // oklch(0.97 0.005 247.839)
  cardForeground: "#3B3D4E", // oklch(0.28 0.02 261.692)
  popover: "#F5F7FA", // oklch(0.97 0.005 247.839)
  popoverForeground: "#3B3D4E", // oklch(0.28 0.02 261.692)
  primary: "#b45309", // oklch(0.28 0.02 261.692) — uses foreground as primary
  primaryForeground: "#F9FAFB", // inherited from root oklch(0.985 0.002 247.839)
  secondary: "#3B3D4E", // oklch(0.28 0.02 261.692)
  secondaryForeground: "#F9FAFB",
  muted: "#EDEDF2", // oklch(0.94 0.006 264.542)
  mutedForeground: "#737487", // oklch(0.55 0.018 264.364)
  accent: "#EDEDF2", // inherits --muted
  accentForeground: "#3B3D4E", // inherits --foreground
  destructive: "#EF4444", // inherited from root
  border: "#E1E1E8", // oklch(0.9 0.006 264.531)
  input: "#E1E1E8", // oklch(0.9 0.006 264.531)
  ring: "#A1A1AA", // inherited from root
  textPrimary: "#3B3D4E", // = foreground
  textSecondary: "#737487", // = mutedForeground
} as const;

// Approx. hex conversions from oklch — mirrors :root[data-theme="high-contrast"] in index.css
export const highContrastColors = {
  background: "#FFFFFF", // oklch(1 0 0)
  foreground: "#090909", // oklch(0.04 0 0) — near-black
  card: "#FFFFFF", // oklch(1 0 0)
  cardForeground: "#090909", // oklch(0.04 0 0)
  popover: "#FFFFFF", // oklch(1 0 0)
  popoverForeground: "#090909", // oklch(0.04 0 0)
  primary: "#3D4200", // oklch(0.3 0.18 84.429) — dark olive-amber
  primaryForeground: "#FFFFFF", // oklch(1 0 0)
  secondary: "#090909", // inherits --foreground
  secondaryForeground: "#FFFFFF",
  muted: "#EFEFEF", // oklch(0.94 0 0)
  mutedForeground: "#303030", // oklch(0.2 0 0)
  accent: "#EFEFEF", // inherits --muted
  accentForeground: "#090909", // inherits --foreground
  destructive: "#EF4444", // inherited (WCAG AA on white)
  border: "#303030", // oklch(0.2 0 0)
  input: "#303030", // oklch(0.2 0 0)
  ring: "#090909", // oklch(0.04 0 0)
  textPrimary: "#090909", // = foreground
  textSecondary: "#303030", // = mutedForeground
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
