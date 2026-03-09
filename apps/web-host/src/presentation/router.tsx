import { createBrowserRouter } from "react-router-dom";
import AuthWrapper from "@/components/AuthWrapper";
import Dashboard from "@/presentation/pages/Dashboard";
import CognitiveAlertConfigPage from "@/presentation/pages/CognitiveAlertConfigPage";
import RoutineManagementPage from "@/presentation/pages/RoutineManagementPage";
import ArchivedTasksPage from "@/presentation/pages/ArchivedTasksPage";
import LandingPage from "@/presentation/pages/LandingPage";
import { ProtectedRoute } from "@/presentation/components/ProtectedRoute";
import { PublicRoute } from "@/presentation/components/PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  // Auth routes — only accessible to unauthenticated users
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <AuthWrapper />,
      },
      {
        path: "/register",
        element: <AuthWrapper />,
      },
    ],
  },
  // Auth callback is always public (handles magic link redirects)
  {
    path: "/auth/callback",
    element: <AuthWrapper />,
  },
  // Protected host routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/settings/cognitive-alerts",
        element: <CognitiveAlertConfigPage />,
      },
      {
        path: "/settings/routines",
        element: <RoutineManagementPage />,
      },
      {
        path: "/archived-tasks",
        element: <ArchivedTasksPage />,
      },
    ],
  },
]);
