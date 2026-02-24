import { useState } from "react";
import { TimerProvider } from "@/presentation/contexts/TimerContext";
import { KanbanBoard } from "@/presentation/components/KanbanBoard";
import { UserMenuDropdown } from "@/presentation/components/UserMenuDropdown";
import { CognitiveAlertBanner } from "@/presentation/components/CognitiveAlertBanner";
import { CognitiveAlertModal } from "@/presentation/components/CognitiveAlertModal";
import { Button, cn } from "@repo/ui";
import { Archive, Timer } from "lucide-react";
import { FocusTimerFocus } from "../components/FocusTimerFocus";
import { useAlertEngine } from "@/presentation/hooks/useAlertEngine";
import { useTimerPreferences } from "@/presentation/hooks/useTimerPreferences";
import { Routine } from "../components/Routine";
import { Logo } from "../components/Logo";
import { useThemePreferences } from "../contexts/ThemePreferencesContext";
import { useNavigate } from "react-router-dom";
import { useActiveRoutine } from "../contexts/ActiveRoutineContext";
import { useRoutines } from "../hooks/useRoutines";

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
  const { complexity } = useThemePreferences();
  const navigate = useNavigate();
  const { routines } = useRoutines();
  const { activeRoutineId } = useActiveRoutine();

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
            {complexity === "complex" && (
              <Button
                variant="link"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setFocusOpen(true)}
                aria-label="Enter focus mode"
              >
                <Timer className="size-4 text-muted-foreground" />
                Focus Mode
              </Button>
            )}
            <UserMenuDropdown />
          </div>
        </div>
      </header>

      <main className="max-w-7xl my-6 mx-auto px-6 py-4 border border-border rounded-lg shadow-xs">
        <div className="flex items-center place-content-between mb-2 gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            My Kamban{" "}
            {routines.length > 0 &&
              `- ${routines.find((r) => r.id === activeRoutineId)?.name || ""}`}
          </h1>
        </div>
        <div className="flex items-center place-content-end mb-4 ">
          <Routine />
        </div>
        <div className="mb-2 place-items-center">
          <KanbanBoard />
        </div>
        {complexity === "complex" && (
          <div className="flex justify-end">
            <Button
              variant={"link"}
              className={cn(
                "mx-1 gap-2 cursor-pointer text-xs",
                "focus-visible:ring-2 focus-visible:ring-ring text-muted-foreground hover:text-foreground",
              )}
              onClick={() => navigate("/archived-tasks")}
            >
              Ver Tarefas Arquivadas
            </Button>
            <Button
              variant={"link"}
              className={cn(
                "mx-1 gap-2 cursor-pointer text-xs",
                "focus-visible:ring-2 focus-visible:ring-ring text-muted-foreground hover:text-foreground",
              )}
              onClick={() => navigate("/settings/routines")}
            >
              Gerenciar Kambans
            </Button>
          </div>
        )}
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
