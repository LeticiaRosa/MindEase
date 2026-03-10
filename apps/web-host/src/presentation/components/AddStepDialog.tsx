import { useState } from "react";
import { StepFormDialog } from "./StepFormDialog";

interface AddStepDialogProps {
  onSubmit: (title: string) => void;
}

export function AddStepDialog({ onSubmit }: AddStepDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded py-0.5"
        aria-label="Adicionar step"
      >
        + Adicionar step
      </button>

      <StepFormDialog
        open={open}
        dialogTitle="Adicionar step"
        saveLabel="Adicionar"
        initialValue=""
        onSave={(title) => {
          onSubmit(title);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
