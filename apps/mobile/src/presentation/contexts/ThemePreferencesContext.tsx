import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccessibilityInfo } from "react-native";
import { useAuth } from "@/presentation/hooks/useAuth";
import { SupabaseUserCognitivePreferencesRepository } from "@/infrastructure/adapters/SupabaseUserCognitivePreferencesRepository";
import { mapSupabaseError } from "@/infrastructure/errors/mapSupabaseError";
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
export type ComplexityMode = "simple" | "complex";

export interface ThemePreferences {
  theme: ColourTheme;
  fontSize: FontSize;
  spacing: SpacingDensity;
  mode: ThemeMode;
  complexity: ComplexityMode;
  reduceMotion: boolean;
}

type ColorTokens = { [K in keyof typeof colors]: string };

interface ThemePreferencesContextValue {
  theme: ColourTheme;
  fontSize: FontSize;
  spacing: SpacingDensity;
  mode: ThemeMode;
  complexity: ComplexityMode;
  reduceMotion: boolean;
  isReducedMotion: boolean;
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
const ENABLE_REMOTE_SYNC =
  process.env.EXPO_PUBLIC_ENABLE_REMOTE_PREFERENCES_SYNC !== "false";

const DEFAULT_PREFERENCES: ThemePreferences = {
  theme: "default",
  fontSize: "md",
  spacing: "default",
  mode: "resume",
  complexity: "simple",
  reduceMotion: false,
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
  for (const [key, value] of Object.entries(fontSizes) as [string, number][]) {
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
  for (const [key, value] of Object.entries(spacing) as [string, number][]) {
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
  const { user } = useAuth();
  const repository = useMemo(
    () => new SupabaseUserCognitivePreferencesRepository(),
    [],
  );
  const [prefs, setPrefs] = useState<ThemePreferences>(DEFAULT_PREFERENCES);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const local = raw
          ? ({
              ...DEFAULT_PREFERENCES,
              ...(JSON.parse(raw) as Partial<ThemePreferences>),
            } as ThemePreferences)
          : DEFAULT_PREFERENCES;

        if (!user?.id) {
          if (!cancelled) {
            setPrefs(local);
          }
          return;
        }

        if (!ENABLE_REMOTE_SYNC) {
          if (!cancelled) {
            setPrefs(local);
          }
          return;
        }

        const remote = await repository.load(user.id);
        if (!remote) {
          await repository.upsert(user.id, {
            theme: local.theme,
            fontSize: local.fontSize,
            spacing: local.spacing,
            mode: local.mode,
            complexity: local.complexity,
            reduceMotion: local.reduceMotion,
          });
          if (!cancelled) {
            setPrefs(local);
          }
          return;
        }

        const synced: ThemePreferences = {
          theme: remote.theme,
          fontSize: remote.fontSize,
          spacing: remote.spacing,
          mode: remote.mode,
          complexity: remote.complexity,
          reduceMotion: remote.reduceMotion,
        };

        if (!cancelled) {
          setPrefs(synced);
        }
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
      } catch (error) {
        console.warn("[ThemePreferencesContext] remote-hydration-failed", {
          userId: user?.id ?? null,
          reason: mapSupabaseError(error),
          error,
        });
      } finally {
        if (!cancelled) {
          setIsHydrated(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [repository, user]);

  useEffect(() => {
    let isMounted = true;

    const syncReduceMotion = async () => {
      try {
        const enabled = await AccessibilityInfo.isReduceMotionEnabled();
        if (isMounted) {
          setSystemReduceMotion(enabled);
        }
      } catch {
        if (isMounted) {
          setSystemReduceMotion(false);
        }
      }
    };

    syncReduceMotion();

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setSystemReduceMotion,
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  const updatePreferences = useCallback(
    (patch: Partial<ThemePreferences>) => {
      setPrefs((prev) => {
        const next = { ...prev, ...patch };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});

        if (user?.id && ENABLE_REMOTE_SYNC) {
          repository
            .upsert(user.id, {
              theme: next.theme,
              fontSize: next.fontSize,
              spacing: next.spacing,
              mode: next.mode,
              complexity: next.complexity,
              reduceMotion: next.reduceMotion,
            })
            .catch((error) => {
              console.warn("[ThemePreferencesContext] remote-save-failed", {
                userId: user.id,
                reason: mapSupabaseError(error),
                error,
              });
            });
        }

        return next;
      });
    },
    [repository, user],
  );

  const resolvedColors = COLOUR_MAP[prefs.theme] ?? colors;
  const resolvedFontSizes = scaleFontSizes(prefs.fontSize);
  const resolvedSpacing = scaleSpacing(prefs.spacing);
  const isReducedMotion = prefs.reduceMotion || systemReduceMotion;

  return (
    <ThemePreferencesContext.Provider
      value={{
        theme: prefs.theme,
        fontSize: prefs.fontSize,
        spacing: prefs.spacing,
        mode: prefs.mode,
        complexity: prefs.complexity,
        reduceMotion: prefs.reduceMotion,
        isReducedMotion,
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
