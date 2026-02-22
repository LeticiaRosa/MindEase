import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@repo/ui";
import { BriefcaseBusiness, NotebookPen } from "lucide-react";

export function Routine() {
  const [selectedKanban, setSelectedKanban] = useState<"study" | "work">(
    "study",
  );

  return (
    <div className="flex items-center gap-4">
      <Select
        value={selectedKanban}
        onValueChange={(value: string) =>
          setSelectedKanban(value as "study" | "work")
        }
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
            <SelectItem value="study">
              <span className="flex items-center gap-2 m-2">
                <NotebookPen className="size-4 text-muted-foreground" />
                Estudo
              </span>
            </SelectItem>
            <SelectItem value="work">
              <span className="flex items-center gap-2 m-2">
                <BriefcaseBusiness className="size-4 text-muted-foreground" />
                Trabalho
              </span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
