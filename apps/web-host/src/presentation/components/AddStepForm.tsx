import { useState } from "react";
import { Input, Button } from "@repo/ui";

interface AddStepFormProps {
  onSubmit: (title: string) => void;
}

export function AddStepForm({ onSubmit }: AddStepFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setTitle("");
    setExpanded(false);
  };

  const handleCancel = () => {
    setTitle("");
    setExpanded(false);
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full z-9999 flex items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded py-0.5"
        aria-label="Adicionar step"
      >
        + Adicionar step
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") handleCancel();
        }}
        placeholder="Descrição da etapa…"
        className="h-7 text-xs"
        aria-label="Descrição da etapa"
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          className="flex-1 h-7 text-xs"
          disabled={!title.trim()}
          onClick={handleSubmit}
          aria-label="Adicionar step"
        >
          Adicionar
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1 h-7 text-xs"
          onClick={handleCancel}
          aria-label="Cancelar"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
