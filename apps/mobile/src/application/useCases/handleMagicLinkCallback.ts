import type { AuthResult } from "@/domain/entities/AuthResult";
import type { User } from "@/domain/entities/User";
import type { IAuthRepository } from "@/domain/interfaces/IAuthRepository";

export async function handleMagicLinkCallback(
  repository: IAuthRepository,
  accessToken: string,
  refreshToken: string,
): Promise<AuthResult<User>> {
  try {
    return await repository.setSession(accessToken, refreshToken);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao validar link mágico";
    return {
      success: false,
      error: { message, status: 500 },
    };
  }
}
