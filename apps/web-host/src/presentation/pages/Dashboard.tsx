import { useState } from "react";
import { TimerProvider } from "@/presentation/contexts/TimerContext";
import { KanbanBoard } from "@/presentation/components/KanbanBoard";
import { UserMenuDropdown } from "@/presentation/components/UserMenuDropdown";
import { Button } from "@repo/ui";
import { Timer } from "lucide-react";
import { FocusTimerFocus } from "../components/FocusTimerFocus";

function DashboardContent() {
  const [focusOpen, setFocusOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              MindEase
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Focus on what matters next
            </p>
          </div>
          <div className="flex items-center gap-3">
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <KanbanBoard />
      </main>

      {/* Full-screen focus overlay — rendered at root level so fixed positioning covers everything */}
      {focusOpen && (
        <FocusTimerFocus
          taskId="dashboard"
          taskTitle="Focus Session"
          onClose={() => setFocusOpen(false)}
        />
      )}
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
