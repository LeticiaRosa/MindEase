import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/presentation/pages/LoginPage";
import RegisterPage from "@/presentation/pages/RegisterPage";
import MagicLinkCallbackPage from "@/presentation/pages/MagicLinkCallbackPage";
import Dashboard from "@/presentation/pages/Dashboard";
import { ProtectedRoute } from "@/presentation/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/auth/callback",
    element: <MagicLinkCallbackPage />,
  },
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
