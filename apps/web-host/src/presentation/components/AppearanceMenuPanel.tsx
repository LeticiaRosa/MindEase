import { Palette, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@repo/ui";
import { useState } from "react";
import {
  useThemePreferences,
  type ColourTheme,
  type FontSize,
  type SpacingDensity,
} from "@/presentation/contexts/ThemePreferencesContext";
import { SegmentedControl } from "@/presentation/components/UserMenuDropdown";

// ─── AppearanceMenuPanel ───────────────────────────────────────────────────────
//
// Standalone panel that exposes the three appearance controls available in the
// auth screen (Colour Theme, Font Size, Spacing).  It reuses the same
// SegmentedControl primitive from UserMenuDropdown and the shared
// ThemePreferencesContext so settings are persisted and reflected globally.

interface AppearanceMenuPanelProps {
  /** When true the controls are always visible (no collapse toggle). */
  alwaysOpen?: boolean;
  className?: string;
}

export function AppearanceMenuPanel({
  alwaysOpen = false,
  className,
}: AppearanceMenuPanelProps) {
  const { theme, fontSize, spacing, updatePreferences } = useThemePreferences();
  const [open, setOpen] = useState(false);

  const isOpen = alwaysOpen || open;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Header / toggle */}
      {alwaysOpen ? null : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center gap-2 rounded px-0.5 py-0.5",
            "text-muted-foreground hover:text-foreground transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring  cursor-pointer",
          )}
          aria-expanded={open}
          aria-label={
            open ? "Hide appearance settings" : "Show appearance settings"
          }
        >
          <Palette className="size-3.5 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Aparência
          </span>
          {open ? (
            <ChevronUp className="size-3 ml-auto" />
          ) : (
            <ChevronDown className="size-3 ml-auto" />
          )}
        </button>
      )}

      {/* Controls */}
      {isOpen && (
        <div className="flex flex-col gap-3 pt-1">
          <SegmentedControl<ColourTheme>
            label="Tema de cores"
            value={theme}
            options={[
              { value: "default", label: "Padrão" },
              { value: "dark", label: "Escuro" },
              { value: "soft", label: "Suave" },
              { value: "high-contrast", label: "Alto contraste" },
            ]}
            onChange={(value) => updatePreferences({ theme: value })}
          />

          <SegmentedControl<FontSize>
            label="Tamanho da fonte"
            value={fontSize}
            options={[
              { value: "sm", label: "S" },
              { value: "md", label: "M" },
              { value: "lg", label: "L" },
            ]}
            onChange={(value) => updatePreferences({ fontSize: value })}
          />

          <SegmentedControl<SpacingDensity>
            label="Espaçamento"
            value={spacing}
            options={[
              { value: "compact", label: "Compacto" },
              { value: "default", label: "Padrão" },
              { value: "relaxed", label: "Relaxado" },
            ]}
            onChange={(value) => updatePreferences({ spacing: value })}
          />
        </div>
      )}
    </div>
  );
}
