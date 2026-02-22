import { useState } from "react";
import { TimerProvider } from "@/presentation/contexts/TimerContext";
import { KanbanBoard } from "@/presentation/components/KanbanBoard";
import { UserMenuDropdown } from "@/presentation/components/UserMenuDropdown";
import { CognitiveAlertBanner } from "@/presentation/components/CognitiveAlertBanner";
import { CognitiveAlertModal } from "@/presentation/components/CognitiveAlertModal";
import { Button } from "@repo/ui";
import { Timer } from "lucide-react";
import { FocusTimerFocus } from "../components/FocusTimerFocus";
import { useAlertEngine } from "@/presentation/hooks/useAlertEngine";
import { useTimerPreferences } from "@/presentation/hooks/useTimerPreferences";
import { Routine } from "../components/Routine";
import { Logo } from "../components/Logo";

function DashboardContent() {
  useTimerPreferences();
  const [focusOpen, setFocusOpen] = useState(false);
  const {
    bannerActive,
    bannerMessage,
    modalOpen,
    modalMessage,
    dismissBanner,
    dismissModal,
  } = useAlertEngine();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-3">
            <CognitiveAlertBanner
              active={bannerActive}
              message={bannerMessage}
              onDismiss={dismissBanner}
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setFocusOpen(true)}
              aria-label="Enter focus mode"
            >
              <Timer className="size-4 text-muted-foreground" />
              Focus Mode
            </Button>
            <UserMenuDropdown />
          </div>
        </div>
      </header>

      <main className="max-w-7xl my-6 mx-auto px-6 py-4 border border-border rounded-lg shadow-xs">
        <div className="flex items-center place-content-between mb-2 gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            My Kamban
          </h1>
          <Routine />
        </div>
        <div className="mb-2 place-items-center">
          <KanbanBoard />
        </div>
      </main>

      {/* Full-screen focus overlay — rendered at root level so fixed positioning covers everything */}
      {focusOpen && (
        <FocusTimerFocus
          taskId="dashboard"
          taskTitle="Focus Session"
          onClose={() => setFocusOpen(false)}
        />
      )}

      {/* Cognitive alert modal (intensity: ativo) */}
      <CognitiveAlertModal
        open={modalOpen}
        message={modalMessage}
        onClose={dismissModal}
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <TimerProvider>
      <DashboardContent />
    </TimerProvider>
  );
}
