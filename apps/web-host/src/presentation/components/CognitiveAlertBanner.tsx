import { Bell } from "lucide-react";
import { Button } from "@repo/ui";

interface CognitiveAlertBannerProps {
  active: boolean;
  message: string;
  onDismiss: () => void;
}

/**
 * A subtle pulsing bell icon shown in the header when intensity is "discreto".
 * Does not interrupt the user's flow — they can dismiss at their own pace.
 */
export function CognitiveAlertBanner({
  active,
  message,
  onDismiss,
}: CognitiveAlertBannerProps) {
  if (!active) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Alerta cognitivo: ${message}`}
      className="relative"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onDismiss}
        className="relative text-amber-500 hover:text-amber-600"
        aria-label="Ver alerta cognitivo"
        title={message}
      >
        <Bell
          className="size-5 animate-pulse"
          style={{ animationDuration: "1s" }}
        />
        <span className="sr-only">{message}</span>
        {/* Small dot indicator */}
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-500"
        />
      </Button>
    </div>
  );
}
