import { useState } from "react";
import { TimerProvider } from "@/presentation/contexts/TimerContext";
import { KanbanBoard } from "@/presentation/components/KanbanBoard";
import { UserMenuDropdown } from "@/presentation/components/UserMenuDropdown";
import { CognitiveAlertBanner } from "@/presentation/components/CognitiveAlertBanner";
import { CognitiveAlertModal } from "@/presentation/components/CognitiveAlertModal";
import { Button, cn, Logo } from "@repo/ui";
import { Timer } from "lucide-react";
import { FocusTimerFocus } from "../components/FocusTimerFocus";
import { useAlertEngine } from "@/presentation/hooks/useAlertEngine";
import { useTimerPreferences } from "@/presentation/hooks/useTimerPreferences";
import { Routine } from "../components/Routine";
import { useThemePreferences } from "../contexts/ThemePreferencesContext";
import { useNavigate } from "react-router-dom";

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
                className="gap-2 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring hidden sm:inline-flex"
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
      {/* Incluir scroll overflow */}
      <main className="max-w-7xl my-6 mx-auto px-6 py-4 border border-border rounded-lg shadow-xs">
        <Routine />
        <div className="mb-2 place-items-start overflow-auto">
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
