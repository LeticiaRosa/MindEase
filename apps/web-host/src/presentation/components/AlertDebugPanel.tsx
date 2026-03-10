import {
  ALERT_TRIGGER_LABELS,
  type AlertTrigger,
} from "@/domain/valueObjects/AlertTypes";

const TRIGGERS = Object.keys(ALERT_TRIGGER_LABELS) as AlertTrigger[];

interface AlertDebugPanelProps {
  onTrigger: (trigger: AlertTrigger) => void;
}

/**
 * DEV-only panel for manually firing cognitive alert triggers.
 * Rendered in the Dashboard only when import.meta.env.DEV is true.
 */
export function AlertDebugPanel({ onTrigger }: AlertDebugPanelProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        MODO DEV — Testar alertas
      </p>
      <div className="flex flex-col gap-1.5">
        {TRIGGERS.map((trigger) => (
          <button
            key={trigger}
            onClick={() => onTrigger(trigger)}
            className="rounded-md border border-border px-3 py-1.5 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ALERT_TRIGGER_LABELS[trigger]}
          </button>
        ))}
      </div>
    </div>
  );
}
