import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "auth/auth";
import { BrainTodayModal } from "@/presentation/components/BrainTodayModal";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <BrainTodayModal />
      <Outlet />
    </>
  );
}
