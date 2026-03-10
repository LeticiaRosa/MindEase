import {
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
  Component,
} from "react";

interface RouteErrorBoundaryProps {
  routeName: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
}

class RouteErrorBoundaryInternal extends Component<
  PropsWithChildren<RouteErrorBoundaryProps>,
  RouteErrorBoundaryState
> {
  public state: RouteErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[RouteErrorBoundary] route rendering failed", {
      routeName: this.props.routeName,
      error,
      info,
    });
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <section
          role="alert"
          aria-live="assertive"
          className="mx-auto my-8 flex w-full max-w-xl flex-col gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground"
        >
          <h1 className="text-xl font-semibold">Algo saiu do esperado</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Esta tela encontrou um erro. Recarregue a página para continuar.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex w-fit items-center rounded-md border border-border px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Recarregar tela
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}

export function RouteErrorBoundary({
  children,
  routeName,
}: PropsWithChildren<RouteErrorBoundaryProps>) {
  return (
    <RouteErrorBoundaryInternal routeName={routeName}>
      {children}
    </RouteErrorBoundaryInternal>
  );
}
