import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { useActiveRoutine } from "@/presentation/contexts/ActiveRoutineContext";
import { RoutineIcon } from "@/presentation/components/RoutineIcon";
import { useThemePreferences } from "../contexts/ThemePreferencesContext";

export function Routine() {
  const { routines, isLoading } = useRoutines();
  const { activeRoutineId, setActiveRoutineId } = useActiveRoutine();
  const { helpers } = useThemePreferences();
  if (isLoading) {
    return (
      <div
        className="h-9 w-48 rounded-md bg-muted/40 animate-pulse"
        aria-label="A carregar Kanbans…"
      />
    );
  }

  return (
    <div className="flex items-center gap-4 ">
      <Tooltip>
        <Select
          value={activeRoutineId ?? ""}
          onValueChange={setActiveRoutineId}
          disabled={routines.length === 0}
        >
          <TooltipTrigger asChild className="w-full">
            <SelectTrigger
              id="kanban-select"
              className="w-full text-md cursor-pointer"
              aria-label="Selecionar Kanban"
            >
              <SelectValue placeholder="Selecione um Kanban" />
            </SelectTrigger>
          </TooltipTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Kanbans</SelectLabel>
              {routines.map((routine) => (
                <SelectItem key={routine.id} value={routine.id}>
                  <span className="flex items-center gap-2 m-1 text-md text-light-foreground">
                    <RoutineIcon
                      name={routine.icon}
                      className="size-4 text-foreground"
                    />
                    {routine.name}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {helpers === "show" && (
          <TooltipContent>
            <span className="">
              {routines.find((r) => r.id === activeRoutineId)?.name ||
                "Select a Kanban"}
            </span>
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
}
