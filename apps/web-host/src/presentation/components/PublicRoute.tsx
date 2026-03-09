import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "auth/auth";

/**
 * Wraps public-only routes (login, register).
 * Redirects authenticated users to the dashboard immediately,
 * preventing the login page flash.
 */
export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
