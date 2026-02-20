import { RouterProvider } from "react-router-dom";
import { Toaster } from "@repo/ui";
import { router } from "@/presentation/router";

export default function Auth() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}
