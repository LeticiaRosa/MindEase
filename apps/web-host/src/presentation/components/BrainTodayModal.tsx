import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from "@repo/ui";
import {
  BRAIN_STATE_OPTIONS,
  type BrainStateValue,
} from "@/domain/valueObjects/BrainState";
import { useBrainToday } from "@/presentation/contexts/BrainTodayContext";

export function BrainTodayModal() {
  const { recordState, skip } = useBrainToday();

  // Check if the modal should be shown:
  // Show when sessionStorage has no entry at all (hasBrainStateForSession handles __skipped__)
  const isOpen = sessionStorage.getItem("mindease:brain-state") === null;

  if (!isOpen) return null;

  const handleSelect = (value: BrainStateValue) => {
    recordState(value);
  };

  return (
    <Dialog open modal>
      <DialogContent
        className="max-w-md p-8 rounded-2xl focus:outline-none"
        // Suppress default close button — user must select or skip
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-6 text-center">
          <DialogTitle className="text-2xl font-semibold">
            Como seu cérebro está hoje?
          </DialogTitle>
          <DialogDescription className="text-base mt-2 text-muted-foreground">
            Sua resposta ajuda a personalizar os alertas do dia.
          </DialogDescription>
        </DialogHeader>

        <div
          role="group"
          aria-label="Estado cognitivo de hoje"
          className="flex flex-col gap-3"
        >
          {BRAIN_STATE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                flex items-center gap-4 w-full rounded-xl border-2 px-5 py-4
                text-left text-base font-medium transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                focus-visible:ring-amber-500
                ${option.colour}
                hover:opacity-90 active:scale-[0.98]
              `}
              aria-label={option.label}
            >
              <span aria-hidden="true" className="text-2xl leading-none">
                {option.emoji}
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={skip}
            className="text-muted-foreground hover:text-foreground"
          >
            Pular por hoje
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
