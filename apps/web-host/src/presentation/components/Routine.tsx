import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@repo/ui";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { useActiveRoutine } from "@/presentation/contexts/ActiveRoutineContext";
import { RoutineIcon } from "@/presentation/components/RoutineIcon";

export function Routine() {
  const { routines, isLoading } = useRoutines();
  const { activeRoutineId, setActiveRoutineId } = useActiveRoutine();

  if (isLoading) {
    return (
      <div
        className="h-9 w-48 rounded-md bg-muted/40 animate-pulse"
        aria-label="A carregar Kanbans…"
      />
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Select
        value={activeRoutineId ?? ""}
        onValueChange={setActiveRoutineId}
        disabled={routines.length === 0}
      >
        <SelectTrigger
          id="kanban-select"
          className="w-full max-w-48"
          aria-label="Selecionar Kanban"
        >
          <SelectValue placeholder="Selecione um Kanban" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Kanbans</SelectLabel>
            {routines.map((routine) => (
              <SelectItem key={routine.id} value={routine.id}>
                <span className="flex items-center gap-2 m-2">
                  <RoutineIcon
                    name={routine.icon}
                    className="size-4 text-muted-foreground"
                  />
                  {routine.name}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
