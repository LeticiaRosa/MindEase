import { RouterProvider } from "react-router-dom";
import { router } from "@/presentation/router";
import { BrainTodayProvider } from "@/presentation/contexts/BrainTodayContext";
import { AlertPreferencesProvider } from "@/presentation/contexts/AlertPreferencesContext";
import { ActivitySignalsProvider } from "@/presentation/contexts/ActivitySignalsContext";
import { TooltipProvider } from "@repo/ui";

function App() {
  return (
    <BrainTodayProvider>
      <AlertPreferencesProvider>
        <ActivitySignalsProvider>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </ActivitySignalsProvider>
      </AlertPreferencesProvider>
    </BrainTodayProvider>
  );
}

export default App;
