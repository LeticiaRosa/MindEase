import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  colors,
  darkColors,
  softColors,
  highContrastColors,
  spacing,
  fontSizes,
  borderRadius,
  fontWeights,
} from "@repo/ui/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ColourTheme = "default" | "soft" | "high-contrast" | "dark";
export type FontSize = "sm" | "md" | "lg";
export type SpacingDensity = "compact" | "default" | "relaxed";
export type ThemeMode = "resume" | "detail";
export type HelpersVisibility = "show" | "hide";
export type ComplexityMode = "simple" | "complex";

export interface ThemePreferences {
  theme: ColourTheme;
  fontSize: FontSize;
  spacing: SpacingDensity;
  mode: ThemeMode;
  helpers: HelpersVisibility;
  complexity: ComplexityMode;
}

type ColorTokens = { [K in keyof typeof colors]: string };

interface ThemePreferencesContextValue {
  theme: ColourTheme;
  fontSize: FontSize;
  spacing: SpacingDensity;
  mode: ThemeMode;
  helpers: HelpersVisibility;
  complexity: ComplexityMode;
  isHydrated: boolean;
  resolvedColors: ColorTokens;
  resolvedFontSizes: typeof fontSizes;
  resolvedSpacing: typeof spacing;
  resolvedBorderRadius: typeof borderRadius;
  resolvedFontWeights: typeof fontWeights;
  updatePreferences: (patch: Partial<ThemePreferences>) => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "mindease:theme-preferences";

const DEFAULT_PREFERENCES: ThemePreferences = {
  theme: "default",
  fontSize: "md",
  spacing: "default",
  mode: "resume",
  helpers: "show",
  complexity: "simple",
};

// ─── Colour map ───────────────────────────────────────────────────────────────

const COLOUR_MAP: Record<ColourTheme, ColorTokens> = {
  default: colors,
  dark: darkColors,
  soft: softColors,
  "high-contrast": highContrastColors,
};

// ─── Font-size scaling ────────────────────────────────────────────────────────

const FONT_SCALE: Record<FontSize, number> = {
  sm: 0.875,
  md: 1,
  lg: 1.25,
};

function scaleFontSizes(size: FontSize): typeof fontSizes {
  const factor = FONT_SCALE[size];
  const result = {} as Record<string, number>;
  for (const [key, value] of Object.entries(fontSizes)) {
    result[key] = Math.round(value * factor);
  }
  return result as unknown as typeof fontSizes;
}

// ─── Spacing scaling ─────────────────────────────────────────────────────────

const SPACING_SCALE: Record<SpacingDensity, number> = {
  compact: 0.75,
  default: 1,
  relaxed: 1.5,
};

function scaleSpacing(density: SpacingDensity): typeof spacing {
  const factor = SPACING_SCALE[density];
  const result = {} as Record<string, number>;
  for (const [key, value] of Object.entries(spacing)) {
    result[key] = Math.round(value * factor);
  }
  return result as unknown as typeof spacing;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemePreferencesContext = createContext<
  ThemePreferencesContextValue | undefined
>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemePreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [prefs, setPrefs] = useState<ThemePreferences>(DEFAULT_PREFERENCES);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored = JSON.parse(raw) as Partial<ThemePreferences>;
          setPrefs((prev) => ({ ...prev, ...stored }));
        }
      } catch {
        // Corrupt data — keep defaults
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  const updatePreferences = useCallback((patch: Partial<ThemePreferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const resolvedColors = COLOUR_MAP[prefs.theme] ?? colors;
  const resolvedFontSizes = scaleFontSizes(prefs.fontSize);
  const resolvedSpacing = scaleSpacing(prefs.spacing);

  return (
    <ThemePreferencesContext.Provider
      value={{
        theme: prefs.theme,
        fontSize: prefs.fontSize,
        spacing: prefs.spacing,
        mode: prefs.mode,
        helpers: prefs.helpers,
        complexity: prefs.complexity,
        isHydrated,
        resolvedColors,
        resolvedFontSizes,
        resolvedSpacing,
        resolvedBorderRadius: borderRadius,
        resolvedFontWeights: fontWeights,
        updatePreferences,
      }}
    >
      {children}
    </ThemePreferencesContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTheme(): ThemePreferencesContextValue {
  const ctx = useContext(ThemePreferencesContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemePreferencesProvider");
  }
  return ctx;
}
