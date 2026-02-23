import {
  User,
  LogOut,
  Timer,
  Palette,
  ChevronUp,
  ChevronDown,
  Bell,
  LayoutGrid,
  GamepadDirectional,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  buttonVariants,
  Separator,
} from "@repo/ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "auth/auth";
import {
  useThemePreferences,
  type ColourTheme,
  type FontSize,
  type SpacingDensity,
} from "@/presentation/contexts/ThemePreferencesContext";
import { TimerPreferencesPanel } from "@/presentation/components/TimerPreferencesPanel";
import { cn } from "@repo/ui";
import { useToast } from "@repo/ui";
import { useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

function getDisplayName(
  user: { email?: string; user_metadata?: { full_name?: string } } | null,
): string {
  if (!user) return "";
  const name = user.user_metadata?.full_name;
  if (name && name.trim()) return truncate(name.trim(), 20);
  return truncate(user.email ?? "", 20);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface SegmentedControlProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              value === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── UserMenuDropdown ─────────────────────────────────────────────────────────

export function UserMenuDropdown() {
  const { user, loading, signOut } = useAuth();
  const { theme, fontSize, spacing, updatePreferences } = useThemePreferences();
  const toast = useToast();
  const navigate = useNavigate();
  const displayName = getDisplayName(user);
  const [mode, setMode] = useState<string | null>("resume");
  const [showConfigTimer, setShowConfigTimer] = useState(false);
  const [showConfigAppearance, setShowConfigAppearance] = useState(false);

  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.success) {
      toast.error("Couldn't sign out. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      {/* ── Trigger ─────────────────────────────────────────────────────── */}
      <DropdownMenuTrigger
        disabled={loading && !user}
        aria-label="User menu"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-2 text-muted-foreground hover:text-foreground",
          "focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <User className="size-4 shrink-0" />
        {loading && !user ? (
          <span className="h-3 w-20 animate-pulse rounded bg-muted" />
        ) : (
          <span className="max-w-40 truncate text-sm">{displayName}</span>
        )}
      </DropdownMenuTrigger>

      {/* ── Panel ───────────────────────────────────────────────────────── */}
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[85vh] overflow-y-auto p-0"
        sideOffset={8}
      >
        {/* User info — read-only, not a MenuItem */}
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {user?.user_metadata?.full_name ?? user?.email ?? "—"}
          </p>
          {user?.user_metadata?.full_name && (
            <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
          )}
        </div>

        <Separator />

        {/* Timer settings — plain div, stays open on form interaction */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <Timer className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Timer
            </span>
          </div>
          <button
            onClick={() => setShowConfigTimer((v) => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
            aria-expanded={showConfigTimer}
            aria-label={
              showConfigTimer ? "Hide timer settings" : "Show timer settings"
            }
          >
            {showConfigTimer ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
            {showConfigTimer ? "Hide timer settings" : "Show timer settings"}
          </button>

          {showConfigTimer && (
            <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:p-0 [&>div]:w-full [&>div]:bg-transparent pt-2">
              <TimerPreferencesPanel />
            </div>
          )}
        </div>

        <Separator />

        {/* Appearance — live apply, no Save needed */}
        <div className="px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-0.5">
            <Palette className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Appearance
            </span>
          </div>
          <button
            onClick={() => setShowConfigAppearance((v) => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
            aria-expanded={showConfigAppearance}
            aria-label={
              showConfigAppearance
                ? "Hide appearance settings"
                : "Show appearance settings"
            }
          >
            {showConfigAppearance ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
            {showConfigAppearance
              ? "Hide appearance settings"
              : "Show appearance settings"}
          </button>

          {showConfigAppearance && (
            <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:p-0 [&>div]:w-full [&>div]:bg-transparent gap-2 flex flex-col pt-2">
              <SegmentedControl<ColourTheme>
                label="Colour theme"
                value={theme}
                options={[
                  { value: "default", label: "Default" },
                  { value: "dark", label: "Dark" },
                  { value: "soft", label: "Soft" },
                  { value: "high-contrast", label: "High contrast" },
                ]}
                onChange={(value) => updatePreferences({ theme: value })}
              />

              <SegmentedControl<FontSize>
                label="Font size"
                value={fontSize}
                options={[
                  { value: "sm", label: "S" },
                  { value: "md", label: "M" },
                  { value: "lg", label: "L" },
                ]}
                onChange={(value) => updatePreferences({ fontSize: value })}
              />

              <SegmentedControl<SpacingDensity>
                label="Spacing"
                value={spacing}
                options={[
                  { value: "compact", label: "Compact" },
                  { value: "default", label: "Default" },
                  { value: "relaxed", label: "Relaxed" },
                ]}
                onChange={(value) => updatePreferences({ spacing: value })}
              />
              <SegmentedControl<string>
                label="Mode"
                value={mode ?? "resume"}
                options={[
                  { value: "resume", label: "Resume" },
                  { value: "detail", label: "Detail" },
                ]}
                onChange={(value) => setMode(value)}
              />
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Gerenciar Kanbans */}
        <DropdownMenuItem
          className={cn(
            "mx-1 gap-2 cursor-pointer",
            "focus-visible:ring-2 focus-visible:ring-ring",
          )}
          onSelect={() => navigate("/settings/routines")}
        >
          <LayoutGrid className="size-4 text-muted-foreground" />
          Gerenciar Kanbans
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Cognitive Alerts settings */}
        <DropdownMenuItem
          className={cn(
            "mx-1 gap-2 cursor-pointer",
            "focus-visible:ring-2 focus-visible:ring-ring",
          )}
          onSelect={() => navigate("/settings/cognitive-alerts")}
        >
          <Bell className="size-4 text-muted-foreground" />
          Alertas Cognitivos
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuItem
          className={cn(
            "mx-1 mb-1 gap-2 text-destructive focus:text-destructive",
            "focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
          )}
          onSelect={handleSignOut}
        >
          <LogOut className="size-4" color="red" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
