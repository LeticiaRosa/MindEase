import type { AuthResult } from "@/domain/entities/AuthResult";
import type { User } from "@/domain/entities/User";
import type { IAuthRepository } from "@/domain/interfaces/IAuthRepository";

export async function exchangeAuthCodeForSession(
  repository: IAuthRepository,
  authCode: string,
): Promise<AuthResult<User>> {
  try {
    return await repository.exchangeCodeForSession(authCode);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao validar codigo de autenticacao";
    return {
      success: false,
      error: { message, status: 500 },
    };
  }
}
