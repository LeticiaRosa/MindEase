import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@repo/ui";
import { TimerProvider } from "@/presentation/contexts/TimerContext";
import { KanbanBoard } from "@/presentation/components/KanbanBoard";
import { TimerPreferencesPanel } from "@/presentation/components/TimerPreferencesPanel";

function DashboardContent() {
  const [showTimerSettings, setShowTimerSettings] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              My Tasks
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Focus on what matters next
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setShowTimerSettings((v) => !v)}
            aria-expanded={showTimerSettings}
            aria-label="Timer settings"
          >
            <Settings className="size-4" />
            Timer
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Timer settings panel (collapsible) */}
        {showTimerSettings && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <TimerPreferencesPanel
              onClose={() => setShowTimerSettings(false)}
            />
          </div>
        )}

        {/* Kanban board */}
        <KanbanBoard />
      </main>
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
