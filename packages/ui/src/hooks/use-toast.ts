import { toast } from "sonner";

export interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const loading = (message: string, options?: Omit<ToastOptions, "action">) => {
    return toast.loading(message, {
      description: options?.description,
      duration: options?.duration,
    });
  };

  const promise = <T>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });
  };

  const dismiss = (toastId?: string | number) => {
    return toast.dismiss(toastId);
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
  };
};
