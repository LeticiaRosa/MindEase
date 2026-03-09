import { cva } from "class-variance-authority";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "2xl";
  href?: string;
};

function Logo({ size = "md", href = "/" }: LogoProps) {
  return (
    <a
      href={href}
      aria-label="MindEase — página inicial"
      className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
    >
      <h1
        className={cva("text-primary font-semibold tracking-tight", {
          variants: {
            size: {
              sm: "text-lg",
              md: "text-2xl",
              lg: "text-4xl",
              "2xl": "text-6xl",
            },
          },
          defaultVariants: {
            size: "md",
          },
        })({ size })}
      >
        MindEase
      </h1>
      <p
        className={cva("hidden sm:block text-xs text-muted-foreground mt-0.5", {
          variants: {
            size: {
              sm: "text-xs",
              md: "text-sm",
              lg: "text-base",
              "2xl": "text-lg",
            },
          },
          defaultVariants: {
            size: "md",
          },
        })({ size })}
      >
        Focus on what matters next
      </p>
    </a>
  );
}

export { Logo };
