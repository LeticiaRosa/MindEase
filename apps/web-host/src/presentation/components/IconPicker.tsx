import { cn } from "@repo/ui";
import {
  ROUTINE_ICONS,
  ROUTINE_ICON_LABELS,
  DEFAULT_ROUTINE_ICON,
} from "@/presentation/components/RoutineIcon";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function IconPicker({ value = DEFAULT_ROUTINE_ICON, onChange }: IconPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Ícone do Kanban"
      className="flex flex-wrap gap-2"
    >
      {Object.entries(ROUTINE_ICONS).map(([name, Icon]) => {
        const label = ROUTINE_ICON_LABELS[name] ?? name;
        const isSelected = value === name;

        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={label}
            title={label}
            onClick={() => onChange(name)}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all duration-150",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              "hover:bg-muted/60",
              isSelected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
