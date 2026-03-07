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

interface EditStepDialogProps {
  step: { id: string; title: string } | null;
  onSave: (id: string, title: string) => void;
  onClose: () => void;
}

function EditStepDialogContent({
  step,
  onSave,
  onClose,
}: {
  step: { id: string; title: string };
  onSave: (id: string, title: string) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(step.title);

  const handleSave = () => {
    if (title.trim()) onSave(step.id, title.trim());
    onClose();
  };

  return (
    <>
      <Textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSave();
          }
        }}
        autoFocus
        placeholder="Descrição da etapa…"
        className="mt-1 resize-none min-h-16"
      />
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          Salvar
        </Button>
      </DialogFooter>
    </>
  );
}

export function EditStepDialog({ step, onSave, onClose }: EditStepDialogProps) {
  return (
    <Dialog
      open={step !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar etapa</DialogTitle>
        </DialogHeader>
        {step && (
          <EditStepDialogContent
            key={step.id}
            step={step}
            onSave={onSave}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
