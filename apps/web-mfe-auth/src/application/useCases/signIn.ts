import type { AuthResult } from "@/domain/entities/AuthResult";
import type { User } from "@/domain/entities/User";
import type { IAuthRepository } from "@/domain/interfaces/IAuthRepository";

export async function signIn(
  repository: IAuthRepository,
  email: string,
  password: string,
): Promise<AuthResult<User>> {
  try {
    return await repository.signIn(email, password);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao fazer login";
    return {
      success: false,
      error: { message, status: 500 },
    };
  }
}
