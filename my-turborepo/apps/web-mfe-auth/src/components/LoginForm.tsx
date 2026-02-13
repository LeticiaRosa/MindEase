import { useState, type FormEvent } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useAuth } from "../hooks/userAuth";
import "./LoginForm.css";

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { signIn, signUp, loading, user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      if (isLogin) {
        const result = await signIn(email, password);
        if (result.success) {
          setSuccess("Login realizado com sucesso!");
          setEmail("");
          setPassword("");
        } else {
          setError(result.error?.message || "Erro ao fazer login");
        }
      } else {
        if (!fullName) {
          setError("Por favor, informe seu nome completo.");
          return;
        }
        const result = await signUp(email, password, fullName);
        if (result.success) {
          setSuccess(
            "Conta criada com sucesso! Verifique seu email para confirmar.",
          );
          setEmail("");
          setPassword("");
          setFullName("");
          setIsLogin(true);
        } else {
          setError(result.error?.message || "Erro ao criar conta");
        }
      }
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    }
  };

  if (user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="welcome-message">
            <h2>Bem-vindo(a)!</h2>
            <p>Email: {user.email}</p>
            {user.user_metadata?.full_name && (
              <p>Nome: {user.user_metadata.full_name}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{isLogin ? "Login" : "Criar Conta"}</h1>
          <p className="login-subtitle">
            {isLogin
              ? "Entre com suas credenciais"
              : "Preencha os dados para criar sua conta"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <Input
              id="fullName"
              type="text"
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              required
            />
          )}

          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <Input
            id="password"
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <Button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
          </Button>

          <div className="toggle-mode">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="toggle-button"
              disabled={loading}
            >
              {isLogin
                ? "Não tem uma conta? Cadastre-se"
                : "Já tem uma conta? Faça login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
