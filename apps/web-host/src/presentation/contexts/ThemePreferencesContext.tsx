import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "auth/auth";
import { SupabaseUserCognitivePreferencesRepository } from "@/infrastructure/adapters/SupabaseUserCognitivePreferencesRepository";
import { mapSupabaseError } from "@/infrastructure/errors/mapSupabaseError";

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
  reduceMotion: boolean;
}

interface ThemePreferencesContextValue {
  theme: ColourTheme;
  fontSize: FontSize;
  spacing: SpacingDensity;
  mode: ThemeMode;
  helpers: HelpersVisibility;
  complexity: ComplexityMode;
  reduceMotion: boolean;
  isReducedMotion: boolean;
  updatePreferences: (patch: Partial<ThemePreferences>) => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "mindease:theme-preferences";
const ENABLE_REMOTE_SYNC =
  import.meta.env.VITE_ENABLE_REMOTE_PREFERENCES_SYNC !== "false";

const DEFAULT_PREFERENCES: ThemePreferences = {
  theme: "default",
  fontSize: "md",
  spacing: "default",
  mode: "resume",
  helpers: "show",
  complexity: "simple",
  reduceMotion: false,
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemePreferencesContext = createContext<
  ThemePreferencesContextValue | undefined
>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readFromStorage(): ThemePreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return {
      ...DEFAULT_PREFERENCES,
      ...(JSON.parse(raw) as Partial<ThemePreferences>),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function writeToStorage(prefs: ThemePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage unavailable (private browsing etc.) — silently ignore
  }
}

function toThemePreferences(
  prefs: Awaited<
    ReturnType<SupabaseUserCognitivePreferencesRepository["load"]>
  >,
): ThemePreferences {
  if (!prefs) {
    return DEFAULT_PREFERENCES;
  }

  return {
    theme: prefs.theme,
    fontSize: prefs.fontSize,
    spacing: prefs.spacing,
    mode: prefs.mode,
    helpers: prefs.helpers,
    complexity: prefs.complexity,
    reduceMotion: prefs.reduceMotion,
  };
}

function applyToDocument(prefs: ThemePreferences): void {
  const root = document.documentElement;
  const isDarkTheme = prefs.theme === "dark";

  if (prefs.theme === "default") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", prefs.theme);
  }

  root.classList.toggle("dark", isDarkTheme);

  root.setAttribute("data-font-size", prefs.fontSize);
  root.setAttribute("data-spacing", prefs.spacing);
  root.setAttribute("data-mode", prefs.mode);
  root.setAttribute("data-helpers", prefs.helpers);

  if (prefs.reduceMotion) {
    root.setAttribute("data-reduce-motion", "true");
  } else {
    root.removeAttribute("data-reduce-motion");
  }
}

function getSystemReduceMotion(): boolean {
  if (typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

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
  const [prefs, setPrefs] = useState<ThemePreferences>(readFromStorage);
  const [systemReduceMotion, setSystemReduceMotion] = useState<boolean>(
    getSystemReduceMotion,
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const local = readFromStorage();

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

      try {
        const remote = await repository.load(user.id);
        if (cancelled) {
          return;
        }

        if (!remote) {
          await repository.upsert(user.id, {
            theme: local.theme,
            fontSize: local.fontSize,
            spacing: local.spacing,
            mode: local.mode,
            helpers: local.helpers,
            complexity: local.complexity,
            reduceMotion: local.reduceMotion,
          });
          setPrefs(local);
          return;
        }

        const mapped = toThemePreferences(remote);
        setPrefs(mapped);
        writeToStorage(mapped);
      } catch (error) {
        if (!cancelled) {
          setPrefs(local);
        }
        console.warn("[ThemePreferencesContext] remote-hydration-failed", {
          userId: user.id,
          reason: mapSupabaseError(error),
          error,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [repository, user]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (event: MediaQueryListEvent) => {
      setSystemReduceMotion(event.matches);
    };

    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  // Apply to document whenever prefs change
  useEffect(() => {
    applyToDocument(prefs);
  }, [prefs]);

  const updatePreferences = useCallback(
    (patch: Partial<ThemePreferences>) => {
      setPrefs((prev) => {
        const next = { ...prev, ...patch };
        writeToStorage(next);

        if (user?.id && ENABLE_REMOTE_SYNC) {
          repository
            .upsert(user.id, {
              theme: next.theme,
              fontSize: next.fontSize,
              spacing: next.spacing,
              mode: next.mode,
              helpers: next.helpers,
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

  return (
    <ThemePreferencesContext.Provider
      value={{
        theme: prefs.theme,
        fontSize: prefs.fontSize,
        spacing: prefs.spacing,
        mode: prefs.mode,
        helpers: prefs.helpers,
        complexity: prefs.complexity,
        reduceMotion: prefs.reduceMotion,
        isReducedMotion: prefs.reduceMotion || systemReduceMotion,
        updatePreferences,
      }}
    >
      {children}
    </ThemePreferencesContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useThemePreferences(): ThemePreferencesContextValue {
  const ctx = useContext(ThemePreferencesContext);
  if (!ctx) {
    throw new Error(
      "useThemePreferences must be used within ThemePreferencesProvider",
    );
  }
  return ctx;
}
