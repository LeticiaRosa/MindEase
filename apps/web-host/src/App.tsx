import { RouterProvider } from "react-router-dom";
import { router } from "@/presentation/router";
import { BrainTodayProvider } from "@/presentation/contexts/BrainTodayContext";
import { AlertPreferencesProvider } from "@/presentation/contexts/AlertPreferencesContext";
import { ActivitySignalsProvider } from "@/presentation/contexts/ActivitySignalsContext";

function App() {
  return (
    <BrainTodayProvider>
      <AlertPreferencesProvider>
        <ActivitySignalsProvider>
          <RouterProvider router={router} />
        </ActivitySignalsProvider>
      </AlertPreferencesProvider>
    </BrainTodayProvider>
  );
}

export default App;
