import { useState } from "react";
import { Input, Button } from "@repo/ui";

interface TaskCreateFormProps {
  onSubmit: (title: string) => void;
}

export function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nova tarefa…"
        className="flex-1"
        aria-label="Título da nova tarefa"
      />
      <Button
        type="button"
        size="sm"
        disabled={!title.trim()}
        onClick={handleSubmit}
        aria-label="Adicionar tarefa"
      >
        +
      </Button>
    </div>
  );
}
