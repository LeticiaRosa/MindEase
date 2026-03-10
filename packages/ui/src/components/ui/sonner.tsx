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
      toastOptions={{
        // Inline styles win over Sonner's class-based styles — no !important needed
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "var(--border)",
          borderLeftWidth: "4px",
          borderLeftColor: "var(--primary)",
          borderRadius: "var(--radius)",
          boxShadow: "0 -2px 12px 0 rgb(0 0 0 / 8%)",
          padding: "12px 16px",
          fontSize: "0.875rem",
        },
        classNames: {
          title: "font-semibold",
          description: "!text-[var(--muted-foreground)] !text-xs",
          closeButton:
            "!bg-[var(--card)] !border-none !text-[var(--muted-foreground)]",
          // !important overrides the inline borderLeftColor set above
          error: "![border-left-color:var(--destructive)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
