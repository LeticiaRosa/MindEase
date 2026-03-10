import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  ThemePreferencesProvider,
  useThemePreferences,
} from "@/presentation/contexts/ThemePreferencesContext";

const STORAGE_KEY = "mindease:theme-preferences";

describe("ThemePreferencesContext", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset document attributes
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-font-size");
    document.documentElement.removeAttribute("data-spacing");
    document.documentElement.removeAttribute("data-reduce-motion");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    it("defaults to default/md/default when localStorage is empty", () => {
      const { result } = renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      expect(result.current.theme).toBe("default");
      expect(result.current.fontSize).toBe("md");
      expect(result.current.spacing).toBe("default");
      expect(result.current.reduceMotion).toBe(false);
    });

    it("reads persisted values from localStorage on mount", () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          theme: "soft",
          fontSize: "lg",
          spacing: "relaxed",
          reduceMotion: true,
        }),
      );

      const { result } = renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      expect(result.current.theme).toBe("soft");
      expect(result.current.fontSize).toBe("lg");
      expect(result.current.spacing).toBe("relaxed");
      expect(result.current.reduceMotion).toBe(true);
    });

    it("falls back to defaults when localStorage throws", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("Storage unavailable");
      });

      const { result } = renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      expect(result.current.theme).toBe("default");
      expect(result.current.fontSize).toBe("md");
      expect(result.current.spacing).toBe("default");
      expect(result.current.reduceMotion).toBe(false);
    });
  });

  describe("updatePreferences", () => {
    it("persists changes to localStorage", () => {
      const { result } = renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      act(() => {
        result.current.updatePreferences({ theme: "high-contrast" });
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
      expect(stored.theme).toBe("high-contrast");
    });

    it("persists reduceMotion changes to localStorage", () => {
      const { result } = renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      act(() => {
        result.current.updatePreferences({ reduceMotion: true });
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
      expect(stored.reduceMotion).toBe(true);
    });

    it("merges partial updates without losing other values", () => {
      const { result } = renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      act(() => result.current.updatePreferences({ fontSize: "sm" }));
      act(() => result.current.updatePreferences({ spacing: "compact" }));

      expect(result.current.theme).toBe("default");
      expect(result.current.fontSize).toBe("sm");
      expect(result.current.spacing).toBe("compact");
    });
  });

  describe("document attribute application", () => {
    it("applies data-font-size and data-spacing on mount", () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          theme: "default",
          fontSize: "lg",
          spacing: "relaxed",
        }),
      );

      renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      expect(document.documentElement.getAttribute("data-font-size")).toBe(
        "lg",
      );
      expect(document.documentElement.getAttribute("data-spacing")).toBe(
        "relaxed",
      );
    });

    it("sets data-reduce-motion attribute when reduceMotion is enabled", () => {
      const { result } = renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      act(() => {
        result.current.updatePreferences({ reduceMotion: true });
      });

      expect(document.documentElement.getAttribute("data-reduce-motion")).toBe(
        "true",
      );
    });

    it("removes data-theme attribute when theme is 'default'", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: "default" }));

      renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    });

    it("sets data-theme attribute for non-default themes", () => {
      const { result } = renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      act(() => {
        result.current.updatePreferences({ theme: "soft" });
      });

      expect(document.documentElement.getAttribute("data-theme")).toBe("soft");
    });

    it("updates data-font-size attribute when fontSize changes", () => {
      const { result } = renderHook(() => useThemePreferences(), {
        wrapper: ThemePreferencesProvider,
      });

      act(() => {
        result.current.updatePreferences({ fontSize: "sm" });
      });

      expect(document.documentElement.getAttribute("data-font-size")).toBe(
        "sm",
      );
    });
  });

  describe("useThemePreferences hook", () => {
    it("throws a descriptive error when used outside ThemePreferencesProvider", () => {
      expect(() => renderHook(() => useThemePreferences())).toThrow(
        "useThemePreferences must be used within ThemePreferencesProvider",
      );
    });
  });
});
