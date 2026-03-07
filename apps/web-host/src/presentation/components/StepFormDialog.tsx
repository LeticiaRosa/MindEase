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

interface StepFormDialogProps {
  open: boolean;
  dialogTitle: string;
  saveLabel?: string;
  initialValue?: string;
  onSave: (title: string) => void;
  onClose: () => void;
}

function StepFormDialogContent({
  initialValue,
  saveLabel,
  onSave,
  onClose,
}: {
  initialValue: string;
  saveLabel: string;
  onSave: (title: string) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initialValue);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim());
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
          {saveLabel}
        </Button>
      </DialogFooter>
    </>
  );
}

export function StepFormDialog({
  open,
  dialogTitle,
  saveLabel = "Salvar",
  initialValue = "",
  onSave,
  onClose,
}: StepFormDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {open && (
          <StepFormDialogContent
            key={`${dialogTitle}-${initialValue}`}
            initialValue={initialValue}
            saveLabel={saveLabel}
            onSave={onSave}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
