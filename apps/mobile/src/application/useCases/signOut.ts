import type { AuthResult } from "@/domain/entities/AuthResult";
import type { IAuthRepository } from "@/domain/interfaces/IAuthRepository";

export async function signOut(
  repository: IAuthRepository,
): Promise<AuthResult<void>> {
  try {
    return await repository.signOut();
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao fazer logout";
    return {
      success: false,
      error: { message, status: 500 },
    };
  }
}
