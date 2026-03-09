import Auth from "auth/auth";
import "../../index.css";
import { AppearanceMenuPanel } from "@/presentation/components/AppearanceMenuPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Logo,
  Button,
} from "@repo/ui";
import { Palette } from "lucide-react";

export default function AuthWrapper() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-20 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
          <Logo size="sm" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Aparência"
              >
                <Palette className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-72 p-4"
            >
              <AppearanceMenuPanel alwaysOpen />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Auth />
      </div>
    </div>
  );
}
