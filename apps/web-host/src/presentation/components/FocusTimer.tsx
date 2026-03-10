import { Timer, Play, Pause, RotateCcw, Square } from "lucide-react";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui";
import { useFocusTimer } from "@/presentation/hooks/useFocusTimer";
import { useThemePreferences } from "@/presentation/contexts/ThemePreferencesContext";

interface FocusTimerProps {
  taskId: string;
}

export function FocusTimer({ taskId }: FocusTimerProps) {
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
    stop,
  } = useFocusTimer(taskId);
  const { isReducedMotion } = useThemePreferences();

  // Only show when active, or on hover (parent controls visibility)
  const modeLabel =
    mode === "focus" ? "Foco" : mode === "break" ? "Pausa" : "Pausa longa";

  const circumference = 2 * Math.PI * 22; // r=22
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
      {/* Circular progress (subtle) */}
      <div className="relative size-12 shrink-0" aria-hidden="true">
        <svg className="size-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted/30"
          />
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className={
              isReducedMotion
                ? "text-primary"
                : "text-primary transition-all duration-1000 ease-linear"
            }
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <Timer className="size-4 text-muted-foreground" />
        </span>
      </div>

      {/* Time info */}
      <div className="flex flex-col min-w-0">
        <span
          className="text-base font-mono font-medium tabular-nums leading-none"
          aria-live="polite"
          aria-label={`${formattedTime} remaining`}
        >
          {formattedTime}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">
          {modeLabel} · Ciclo {currentCycle}/{cyclesBeforeLongBreak}
        </span>
      </div>

      {/* Controls */}
      <div className="flex gap-1 ml-auto">
        {isRunning ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                onClick={pause}
                aria-label="Pausar timer"
              >
                <Pause className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pausar timer</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                onClick={start}
                aria-label={isPaused ? "Retomar timer" : "Iniciar timer"}
              >
                <Play className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPaused ? "Retomar timer" : "Iniciar timer"}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {isActive && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  onClick={reset}
                  aria-label="Reset timer"
                >
                  <RotateCcw className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Resetar timer</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-destructive/70 hover:text-destructive"
                  onClick={stop}
                  aria-label="Parar e salvar tempo"
                >
                  <Square className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Parar e salvar tempo</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
}
