/* iniba o p quando estiver em mobile */

export function Logo() {
  return (
    <div>
      <h1 className="text-primary text-2xl font-semibold tracking-tight text-foreground">
        MindEase
      </h1>
      <p className="hidden sm:block text-xs text-muted-foreground mt-0.5">
        Focus on what matters next
      </p>
    </div>
  );
}
