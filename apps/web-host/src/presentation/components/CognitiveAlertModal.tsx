import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from "@repo/ui";
import { useBrainToday } from "@/presentation/contexts/BrainTodayContext";
import { BRAIN_STATE_OPTIONS } from "@/domain/valueObjects/BrainState";

interface CognitiveAlertModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

/**
 * A light, non-blocking modal shown when intensity is "ativo".
 * Does NOT freeze background scrolling so the user can continue working
 * without being forced to close it first.
 */
export function CognitiveAlertModal({
  open,
  message,
  onClose,
}: CognitiveAlertModalProps) {
  const { brainState } = useBrainToday();
  const stateOption = BRAIN_STATE_OPTIONS.find((o) => o.value === brainState);
  const borderColour = stateOption
    ? stateOption.colour.split(" ")[1] // extract border-{color} class
    : "border-amber-400";

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        className={`max-w-sm rounded-2xl border-2 ${borderColour} p-6`}
        // Non-blocking: don't aria-modal, allow background interaction
        aria-modal={false}
      >
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {stateOption
              ? `${stateOption.emoji} Alerta Cognitivo`
              : "🔔 Alerta Cognitivo"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-foreground">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
