import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AppAlertDialog } from "@/presentation/components/AppAlertDialog";

export type AlertVariant = "success" | "error" | "info";

interface AlertState {
  open: boolean;
  title: string;
  message: string;
  variant: AlertVariant;
}

interface AlertContextValue {
  showAlert: (title: string, message: string, variant?: AlertVariant) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlertState>({
    open: false,
    title: "",
    message: "",
    variant: "info",
  });

  const showAlert = useCallback(
    (title: string, message: string, variant: AlertVariant = "info") => {
      setState({ open: true, title, message, variant });
    },
    [],
  );

  const dismiss = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AppAlertDialog
        open={state.open}
        title={state.title}
        message={state.message}
        variant={state.variant}
        onDismiss={dismiss}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
}
