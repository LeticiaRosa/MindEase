import { Play, Pause, RotateCcw, X, Coffee, Brain } from "lucide-react";
import { Button } from "@repo/ui";
import { useFocusTimer } from "@/presentation/hooks/useFocusTimer";

interface FocusTimerFocusProps {
  taskId: string;
  taskTitle?: string;
  onClose?: () => void;
}

export function FocusTimerFocus({
  taskId,
  taskTitle,
  onClose,
}: FocusTimerFocusProps) {
  const {
    isActive,
    isRunning,
    isPaused,
    mode,
    formattedTime,
    progress,
    currentCycle,
    cyclesBeforeLongBreak,
    start,
    pause,
    reset,
  } = useFocusTimer(taskId);

  const isFocus = mode === "focus";
  const isBreak = mode === "break";
  const modeLabel = isFocus ? "Focus" : isBreak ? "Short Break" : "Long Break";
  const modeDescription = isFocus
    ? "Stay with the task. One step at a time."
    : isBreak
      ? "Rest your mind. You earned it."
      : "Take a longer rest before the next session.";

  const ModeIcon = isFocus ? Brain : Coffee;

  // Large ring: r=88, viewBox 200x200
  const r = 88;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full-screen focus timer"
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background overflow-hidden"
    >
      {/* Exit button — top-right, unobtrusive */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Exit focus mode"
          className="absolute top-5 right-5 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden="true" />
          <span>Exit focus</span>
        </button>
      )}

      {/* Mode badge */}
      <div className="flex items-center gap-2 mb-10">
        <ModeIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {modeLabel}
        </span>
      </div>

      {/* Circular progress ring + time */}
      <div
        className="relative flex items-center justify-center"
        aria-hidden="true"
      >
        <svg
          className="-rotate-90"
          width="200"
          height="200"
          viewBox="0 0 200 200"
        >
          {/* Track */}
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/20"
          />
          {/* Progress */}
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Time overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span
            className="text-5xl font-mono font-semibold tabular-nums tracking-tight leading-none text-foreground"
            aria-live="polite"
            aria-label={`${formattedTime} remaining`}
          >
            {formattedTime}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentCycle} / {cyclesBeforeLongBreak}
          </span>
        </div>
      </div>

      {/* Contextual description */}
      <p className="mt-8 text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
        {modeDescription}
      </p>

      {/* Task title (if provided) */}
      {taskTitle && (
        <p className="mt-2 text-base font-medium text-foreground text-center max-w-xs truncate">
          {taskTitle}
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4 mt-10">
        {isRunning ? (
          <Button
            size="lg"
            variant="outline"
            className="gap-2 min-w-32"
            onClick={pause}
            aria-label="Pause timer"
          >
            <Pause className="size-4" aria-hidden="true" />
            Pause
          </Button>
        ) : (
          <Button
            size="lg"
            className="gap-2 min-w-32"
            onClick={start}
            aria-label={isPaused ? "Resume timer" : "Start timer"}
          >
            <Play className="size-4" aria-hidden="true" />
            {isPaused ? "Resume" : "Start"}
          </Button>
        )}

        {isActive && (
          <Button
            size="lg"
            variant="ghost"
            className="gap-2"
            onClick={reset}
            aria-label="Reset timer"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
