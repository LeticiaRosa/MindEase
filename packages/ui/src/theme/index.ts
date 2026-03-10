/**
 * Design tokens compartilhados entre web e mobile.
 * Compatível com React Native.
 *
 * Todos os valores hex são convertidos diretamente dos CSS custom properties
 * em packages/ui/index.css usando oklch → sRGB via a fórmula OKLab.
 */

// ─── Default (light) — mirrors :root in index.css ─────────────────────────────
export const colors = {
  background: "#FFFFFF", // oklch(1 0 0)
  foreground: "#030712", // oklch(0.13 0.028 261.692)
  card: "#FFFFFF", // oklch(1 0 0)
  cardForeground: "#030712", // oklch(0.13 0.028 261.692)
  popover: "#FFFFFF", // oklch(1 0 0)
  popoverForeground: "#030712", // oklch(0.13 0.028 261.692)
  primary: "#B45309", // oklch(0.5553 0.1455 49)
  primaryForeground: "#F9FAFB", // oklch(0.985 0.002 247.839)
  secondary: "#B45309", // oklch(0.5553 0.1455 49) — same as primary
  secondaryForeground: "#101828", // oklch(0.21 0.034 264.665)
  muted: "#F3F4F6", // oklch(0.967 0.003 264.542)
  mutedForeground: "#6A7282", // oklch(0.551 0.027 264.364)
  accent: "#F3F4F6", // oklch(0.967 0.003 264.542)
  accentForeground: "#101828", // oklch(0.21 0.034 264.665)
  destructive: "#E7000B", // oklch(0.577 0.245 27.325)
  destructiveForeground: "#F9FAFB", // oklch(0.985 0.002 247.839)
  border: "#E5E7EB", // oklch(0.928 0.006 264.531)
  input: "#E5E7EB", // oklch(0.928 0.006 264.531)
  ring: "#6A7282", // oklch(0.551 0.027 264.364)
  textPrimary: "#030712", // = foreground
  textSecondary: "#6A7282", // = mutedForeground
  // Semantic state colors (brain-today / cognitive alerts)
  success: "#22C55E",
  successForeground: "#F9FAFB",
  info: "#3B82F6",
  infoForeground: "#EFF6FF",
  creative: "#A855F7",
  creativeForeground: "#FAF5FF",
} as const;

// ─── Dark — mirrors .dark / :root[data-theme="dark"] in index.css ─────────────
export const darkColors = {
  background: "#030712", // oklch(0.13 0.028 261.692)
  foreground: "#F9FAFB", // oklch(0.985 0.002 247.839)
  card: "#101828", // oklch(0.21 0.034 264.665)
  cardForeground: "#F9FAFB", // oklch(0.985 0.002 247.839)
  popover: "#101828", // oklch(0.21 0.034 264.665)
  popoverForeground: "#F9FAFB", // oklch(0.985 0.002 247.839)
  primary: "#B45309", // oklch(0.5553 0.1455 49) — unchanged in dark
  primaryForeground: "#F9FAFB", // oklch(0.985 0.002 247.839)
  secondary: "#B45309", // oklch(0.5553 0.1455 49)
  secondaryForeground: "#F9FAFB", // oklch(0.985 0.002 247.839)
  muted: "#1E2939", // oklch(0.278 0.033 256.848)
  mutedForeground: "#99A1AF", // oklch(0.707 0.022 261.325)
  accent: "#1E2939", // oklch(0.278 0.033 256.848)
  accentForeground: "#F9FAFB", // oklch(0.985 0.002 247.839)
  destructive: "#FF6467", // oklch(0.704 0.191 22.216)
  destructiveForeground: "#101828", // oklch(0.21 0.034 264.665)
  border: "rgba(255, 255, 255, 0.1)", // oklch(1 0 0 / 10%)
  input: "rgba(255, 255, 255, 0.15)", // oklch(1 0 0 / 15%)
  ring: "#6A7282", // oklch(0.551 0.027 264.364)
  textPrimary: "#F9FAFB", // = foreground
  textSecondary: "#99A1AF", // = mutedForeground
  // Semantic state colors
  success: "#4ADE80",
  successForeground: "#101828",
  info: "#60A5FA",
  infoForeground: "#101828",
  creative: "#C084FC",
  creativeForeground: "#101828",
} as const;

// ─── Soft — mirrors :root[data-theme="soft"] in index.css ─────────────────────
export const softColors = {
  background: "#F6F9FC", // oklch(0.98 0.005 247.839)
  foreground: "#232933", // oklch(0.28 0.02 261.692)
  card: "#F2F5F8", // oklch(0.97 0.005 247.839)
  cardForeground: "#232933", // oklch(0.28 0.02 261.692)
  popover: "#F2F5F8", // oklch(0.97 0.005 247.839)
  popoverForeground: "#232933", // oklch(0.28 0.02 261.692)
  primary: "#232933", // oklch(0.28 0.02 261.692) — uses foreground as primary
  primaryForeground: "#F6F9FC", // oklch(0.98 0.005 247.839) — background as contrast
  secondary: "#232933", // oklch(0.28 0.02 261.692)
  secondaryForeground: "#F6F9FC", // background for contrast
  muted: "#E9EBEF", // oklch(0.94 0.006 264.542)
  mutedForeground: "#6C727C", // oklch(0.55 0.018 264.364)
  accent: "#E9EBEF", // oklch(0.94 0.006 264.542)
  accentForeground: "#232933", // = foreground
  destructive: "#E7000B", // oklch(0.577 0.245 27.325) — inherited from root
  destructiveForeground: "#F6F9FC",
  border: "#DCDEE2", // oklch(0.9 0.006 264.531)
  input: "#DCDEE2", // oklch(0.9 0.006 264.531)
  ring: "#6A7282", // inherited from root
  textPrimary: "#232933", // = foreground
  textSecondary: "#6C727C", // = mutedForeground
  // Semantic state colors
  success: "#16A34A",
  successForeground: "#F6F9FC",
  info: "#2563EB",
  infoForeground: "#F6F9FC",
  creative: "#9333EA",
  creativeForeground: "#F6F9FC",
} as const;

// ─── High contrast — mirrors :root[data-theme="high-contrast"] in index.css ───
export const highContrastColors = {
  background: "#FFFFFF", // oklch(1 0 0)
  foreground: "#000000", // oklch(0.04 0 0)
  card: "#FFFFFF", // oklch(1 0 0)
  cardForeground: "#000000", // oklch(0.04 0 0)
  popover: "#FFFFFF", // oklch(1 0 0)
  popoverForeground: "#000000", // oklch(0.04 0 0)
  primary: "#551800", // oklch(0.3 0.18 84.429)
  primaryForeground: "#FFFFFF", // oklch(1 0 0)
  secondary: "#000000", // inherits foreground
  secondaryForeground: "#FFFFFF",
  muted: "#EBEBEB", // oklch(0.94 0 0)
  mutedForeground: "#161616", // oklch(0.2 0 0)
  accent: "#EBEBEB", // = muted
  accentForeground: "#000000", // = foreground
  destructive: "#E7000B", // oklch(0.577 0.245 27.325) — inherited from root
  destructiveForeground: "#FFFFFF",
  border: "#161616", // oklch(0.2 0 0)
  input: "#161616", // oklch(0.2 0 0)
  ring: "#000000", // oklch(0.04 0 0)
  textPrimary: "#000000", // = foreground
  textSecondary: "#161616", // = mutedForeground
  // Semantic state colors (darkened for WCAG AAA contrast on white)
  success: "#166534",
  successForeground: "#FFFFFF",
  info: "#1D4ED8",
  infoForeground: "#FFFFFF",
  creative: "#7E22CE",
  creativeForeground: "#FFFFFF",
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
