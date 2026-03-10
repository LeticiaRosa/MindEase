export function mapSupabaseError(error: unknown): string {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error ?? "");

  if (message.includes("not authenticated") || message.includes("jwt")) {
    return "Faça login novamente para sincronizar suas preferências.";
  }

  if (message.includes("network") || message.includes("fetch")) {
    return "Sem conexão no momento. Suas preferências ficarão salvas localmente e serão sincronizadas depois.";
  }

  if (message.includes("permission") || message.includes("policy")) {
    return "Sua conta não tem permissão para esta ação.";
  }

  return "Não foi possível sincronizar agora. Vamos manter suas preferências localmente por enquanto.";
}
