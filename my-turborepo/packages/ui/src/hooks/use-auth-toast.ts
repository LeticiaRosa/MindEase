import { useToast } from "./use-toast.js";

export const useAuthToast = () => {
  const toast = useToast();

  const loginSuccess = (userName?: string) => {
    return toast.success("Login realizado com sucesso!", {
      description: userName
        ? `Bem-vindo de volta, ${userName}!`
        : "Bem-vindo de volta!",
    });
  };

  const loginError = (message?: string) => {
    return toast.error("Erro ao fazer login", {
      description: message || "Verifique suas credenciais e tente novamente.",
    });
  };

  const signupSuccess = (userName?: string) => {
    return toast.success("Conta criada com sucesso!", {
      description: userName
        ? `Bem-vindo, ${userName}!`
        : "Sua conta foi criada com sucesso.",
    });
  };

  const signupError = (message?: string) => {
    return toast.error("Erro ao criar conta", {
      description: message || "Verifique os dados e tente novamente.",
    });
  };

  const logoutSuccess = () => {
    return toast.success("Logout realizado com sucesso!", {
      description: "Você foi desconectado da sua conta.",
    });
  };

  const logoutError = (message?: string) => {
    return toast.error("Erro ao fazer logout", {
      description: message || "Tente novamente em alguns instantes.",
    });
  };

  const sessionExpired = () => {
    return toast.warning("Sessão expirada", {
      description: "Faça login novamente para continuar.",
      duration: 5000,
    });
  };

  const verificationEmailSent = (email: string) => {
    return toast.info("Email de verificação enviado", {
      description: `Verifique sua caixa de entrada em ${email}`,
      duration: 6000,
    });
  };

  const passwordResetSent = (email: string) => {
    return toast.info("Email de recuperação enviado", {
      description: `Verifique sua caixa de entrada em ${email}`,
      duration: 6000,
    });
  };

  const unexpectedError = () => {
    return toast.error("Erro inesperado", {
      description: "Ocorreu um erro inesperado. Tente novamente.",
    });
  };

  return {
    loginSuccess,
    loginError,
    signupSuccess,
    signupError,
    logoutSuccess,
    logoutError,
    sessionExpired,
    verificationEmailSent,
    passwordResetSent,
    unexpectedError,
    // Re-export general toast methods
    ...toast,
  };
};
