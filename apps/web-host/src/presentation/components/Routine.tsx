import { useNavigate } from "react-router-dom";
import { cn } from "@repo/ui";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { useActiveRoutine } from "@/presentation/hooks/useActiveRoutine";
import { RoutineIcon } from "@/presentation/components/RoutineIcon";
import { useThemePreferences } from "../contexts/ThemePreferencesContext";

export function Routine() {
  const { routines, isLoading } = useRoutines();
  const { activeRoutineId, setActiveRoutineId } = useActiveRoutine();
  const navigate = useNavigate();
  const { complexity } = useThemePreferences();

  if (isLoading) {
    return (
      <div
        className="h-9 w-48 rounded-md bg-muted/40 animate-pulse"
        aria-label="A carregar Kanbans…"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Kanbans
      </span>

      <div
        role="tablist"
        aria-label="Selecionar Kanban"
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {routines.map((routine) => {
          const isActive = routine.id === activeRoutineId;
          return (
            <button
              key={routine.id}
              role="tab"
              aria-selected={isActive}
              aria-label={routine.name}
              onClick={() => setActiveRoutineId(routine.id)}
              className={cn(
                "flex cursor-pointer shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-primary bg-primary font-semibold text-primary-foreground"
                  : "border-border bg-card font-normal text-foreground hover:bg-muted",
              )}
            >
              <RoutineIcon
                name={routine.icon}
                className={cn(
                  "size-4",
                  isActive ? "text-primary-foreground" : "text-foreground",
                )}
              />
              {routine.name}
            </button>
          );
        })}
        {complexity === "complex" && (
          <button
            onClick={() => navigate("/settings/routines")}
            className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label="Gerenciar rotinas"
          >
            Gerenciar
          </button>
        )}
      </div>
    </div>
  );
}
