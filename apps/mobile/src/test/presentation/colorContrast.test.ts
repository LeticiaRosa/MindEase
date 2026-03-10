import { describe, expect, it } from "vitest";
import {
  colors,
  darkColors,
  highContrastColors,
  softColors,
} from "@repo/ui/theme";

type ThemePalette = typeof colors;

type ContrastPair = {
  foreground: keyof ThemePalette;
  background: keyof ThemePalette;
  minimum: number;
  reason: string;
};

const CONTRAST_PAIRS: ContrastPair[] = [
  {
    foreground: "foreground",
    background: "background",
    minimum: 4.5,
    reason: "Texto principal deve manter legibilidade AA",
  },
  {
    foreground: "mutedForeground",
    background: "background",
    minimum: 4.5,
    reason: "Texto secundario deve permanecer legivel",
  },
  {
    foreground: "primaryForeground",
    background: "primary",
    minimum: 4.5,
    reason: "Botoes primarios precisam contraste suficiente",
  },
  {
    foreground: "destructiveForeground",
    background: "destructive",
    minimum: 4.5,
    reason: "Acoes destrutivas devem ser claras",
  },
  {
    foreground: "ring",
    background: "background",
    minimum: 3,
    reason: "Indicador de foco precisa contraste minimo para UI",
  },
];

const THEMES = {
  default: colors,
  soft: softColors,
  dark: darkColors,
  "high-contrast": highContrastColors,
} as const;

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    throw new Error(`Hex color not supported in contrast test: ${hex}`);
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function srgbToLinear(value: number) {
  const channel = value / 255;
  return channel <= 0.03928
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const [lr, lg, lb] = [r, g, b].map(srgbToLinear);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrastRatio(foreground: string, background: string) {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("theme token contrast (mobile)", () => {
  for (const [themeName, palette] of Object.entries(THEMES)) {
    it(`keeps required contrast ratios for ${themeName}`, () => {
      for (const pair of CONTRAST_PAIRS) {
        const ratio = contrastRatio(
          palette[pair.foreground],
          palette[pair.background],
        );

        expect(
          ratio,
          `${themeName}: ${String(pair.foreground)} on ${String(pair.background)} | ${pair.reason}`,
        ).toBeGreaterThanOrEqual(pair.minimum);
      }
    });
  }
});
