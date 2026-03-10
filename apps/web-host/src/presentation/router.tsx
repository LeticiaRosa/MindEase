import { createBrowserRouter } from "react-router-dom";
import AuthWrapper from "@/components/AuthWrapper";
import Dashboard from "@/presentation/pages/Dashboard";
import CognitiveAlertConfigPage from "@/presentation/pages/CognitiveAlertConfigPage";
import RoutineManagementPage from "@/presentation/pages/RoutineManagementPage";
import ArchivedTasksPage from "@/presentation/pages/ArchivedTasksPage";
import LandingPage from "@/presentation/pages/LandingPage";
import { ProtectedRoute } from "@/presentation/components/ProtectedRoute";
import { PublicRoute } from "@/presentation/components/PublicRoute";
import { RouteErrorBoundary } from "@/presentation/components/RouteErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouteErrorBoundary routeName="landing">
        <LandingPage />
      </RouteErrorBoundary>
    ),
  },
  // Auth routes — only accessible to unauthenticated users
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: (
          <RouteErrorBoundary routeName="login">
            <AuthWrapper />
          </RouteErrorBoundary>
        ),
      },
      {
        path: "/register",
        element: (
          <RouteErrorBoundary routeName="register">
            <AuthWrapper />
          </RouteErrorBoundary>
        ),
      },
    ],
  },
  // Auth callback is always public (handles magic link redirects)
  {
    path: "/auth/callback",
    element: (
      <RouteErrorBoundary routeName="auth-callback">
        <AuthWrapper />
      </RouteErrorBoundary>
    ),
  },
  // Protected host routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: (
          <RouteErrorBoundary routeName="dashboard">
            <Dashboard />
          </RouteErrorBoundary>
        ),
      },
      {
        path: "/settings/cognitive-alerts",
        element: (
          <RouteErrorBoundary routeName="settings-cognitive-alerts">
            <CognitiveAlertConfigPage />
          </RouteErrorBoundary>
        ),
      },
      {
        path: "/settings/routines",
        element: (
          <RouteErrorBoundary routeName="settings-routines">
            <RoutineManagementPage />
          </RouteErrorBoundary>
        ),
      },
      {
        path: "/archived-tasks",
        element: (
          <RouteErrorBoundary routeName="archived-tasks">
            <ArchivedTasksPage />
          </RouteErrorBoundary>
        ),
      },
    ],
  },
]);
