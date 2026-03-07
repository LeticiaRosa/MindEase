import { StepFormDialog } from "./StepFormDialog";

interface EditStepDialogProps {
  step: { id: string; title: string } | null;
  onSave: (id: string, title: string) => void;
  onClose: () => void;
}

export function EditStepDialog({ step, onSave, onClose }: EditStepDialogProps) {
  return (
    <StepFormDialog
      open={step !== null}
      dialogTitle="Editar etapa"
      saveLabel="Salvar"
      initialValue={step?.title ?? ""}
      onSave={(title) => {
        if (step) onSave(step.id, title);
        onClose();
      }}
      onClose={onClose}
    />
  );
}
