import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "auth/auth";
import { BrainTodayModal } from "@/presentation/components/BrainTodayModal";
import { ActiveRoutineProvider } from "@/presentation/contexts/ActiveRoutineContext";
import { useOnboarding } from "@/presentation/contexts/OnboardingContext";
import { GuidedOnboardingFlow } from "@/presentation/components/GuidedOnboardingFlow";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const { isHydrated, shouldShowOnboarding } = useOnboarding();

  if (loading || !isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ActiveRoutineProvider>
      {shouldShowOnboarding ? (
        <GuidedOnboardingFlow />
      ) : (
        <>
          <BrainTodayModal />
          <Outlet />
        </>
      )}
    </ActiveRoutineProvider>
  );
}
