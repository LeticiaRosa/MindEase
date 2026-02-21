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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}
