import { RouterProvider } from "react-router-dom";
import { router } from "@/presentation/router";
import { BrainTodayProvider } from "@/presentation/contexts/BrainTodayContext";
import { AlertPreferencesProvider } from "@/presentation/contexts/AlertPreferencesContext";
import { ActivitySignalsProvider } from "@/presentation/contexts/ActivitySignalsContext";
import { OnboardingProvider } from "@/presentation/contexts/OnboardingContext";
import { TooltipProvider } from "@repo/ui";

function App() {
  return (
    <OnboardingProvider>
      <BrainTodayProvider>
        <AlertPreferencesProvider>
          <ActivitySignalsProvider>
            <TooltipProvider>
              <RouterProvider router={router} />
            </TooltipProvider>
          </ActivitySignalsProvider>
        </AlertPreferencesProvider>
      </BrainTodayProvider>
    </OnboardingProvider>
  );
}

export default App;
