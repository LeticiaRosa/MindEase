import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { Input, Button } from "@repo/ui";

interface AddStepFormProps {
  onSubmit: (title: string) => void;
}

export function AddStepForm({ onSubmit }: AddStepFormProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
        aria-label="Add a step"
      >
        <Plus className="size-3" />
        Add step
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Step description…"
        className="h-7 text-xs flex-1"
        aria-label="New step description"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setValue("");
            setOpen(false);
          }
        }}
      />
      <Button type="submit" size="sm" className="h-7 px-2 text-xs">
        Add
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={() => {
          setValue("");
          setOpen(false);
        }}
      >
        Cancel
      </Button>
    </form>
  );
}
