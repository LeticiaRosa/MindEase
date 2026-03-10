import { useEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<string>("system");

  useEffect(() => {
    const htmlTheme =
      document.documentElement.getAttribute("data-theme") || "system";
    setTheme(htmlTheme);
  }, []);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-center"
      gap={8}
      offset={24}
      duration={5000}
      closeButton
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "!bg-(--card) !border !border-(--border) !border-l-4 !shadow-[0_-2px_12px_0_rgb(0_0_0/8%)] !rounded-(--radius)",
          title: "!text-(--foreground) !font-semibold !text-sm",
          description: "!text-(--muted-foreground) !text-xs",
          closeButton:
            "!bg-(--card) !border-0 !text-(--muted-foreground) hover:!text-(--foreground)",
          success: "!border-l-(--primary)",
          error: "!border-l-(--destructive)",
          info: "!border-l-(--primary)",
          warning: "!border-l-(--primary)",
        },
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
