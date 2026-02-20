import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthWrapper from "@/components/AuthWrapper";
import Dashboard from "@/presentation/pages/Dashboard";
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
    ],
  },
]);
