import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
} from "@repo/ui";

interface AddStepDialogProps {
  onSubmit: (title: string) => void;
}

export function AddStepDialog({ onSubmit }: AddStepDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setTitle("");
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setTitle("");
    setOpen(next);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded py-0.5"
        aria-label="Adicionar etapa"
      >
        + Adicionar etapa
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar etapa</DialogTitle>
          </DialogHeader>
          <Textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            autoFocus
            placeholder="Descrição da etapa…"
            className="mt-1 resize-none min-h-16"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim()}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
