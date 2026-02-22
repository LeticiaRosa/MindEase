import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthWrapper from "@/components/AuthWrapper";
import Dashboard from "@/presentation/pages/Dashboard";
import CognitiveAlertConfigPage from "@/presentation/pages/CognitiveAlertConfigPage";
import RoutineManagementPage from "@/presentation/pages/RoutineManagementPage";
import { ProtectedRoute } from "@/presentation/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  // Auth routes — rendered by the federated Auth MFE
  {
    path: "/login",
    element: <AuthWrapper />,
  },
  {
    path: "/register",
    element: <AuthWrapper />,
  },
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
    ],
  },
]);
