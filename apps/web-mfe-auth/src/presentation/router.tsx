import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/presentation/pages/LoginPage";
import RegisterPage from "@/presentation/pages/RegisterPage";
import MagicLinkCallbackPage from "@/presentation/pages/MagicLinkCallbackPage";
import type { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
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
];

// Used only when running standalone (localhost:3001)
export const router = createBrowserRouter(routes);
