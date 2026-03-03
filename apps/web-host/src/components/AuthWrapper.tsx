import Auth from "auth/auth";
import "../../index.css";
import { AppearanceMenuPanel } from "@/presentation/components/AppearanceMenuPanel";
import { Logo } from "@repo/ui";

export default function AuthWrapper() {
  return (
    <div className="relative min-h-screen">
      {/* Desabilite a logo para mobile */}
      <div className="absolute top-4 left-12 z-10 ">
        <Logo />
      </div>

      <div className="absolute top-4 right-12 z-10">
        <div className="rounded-lg border bg-background/80 backdrop-blur-sm shadow-sm px-4 py-3 w-56 min-w-72">
          <AppearanceMenuPanel />
        </div>
      </div>
      <Auth />
    </div>
  );
}
