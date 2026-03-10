import { useMemo } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@repo/ui";
import { routes } from "@/presentation/router";

export default function Auth() {
  const router = useMemo(
    () =>
      createMemoryRouter(routes, {
        initialEntries: [window.location.pathname],
      }),
    [],
  );

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}
