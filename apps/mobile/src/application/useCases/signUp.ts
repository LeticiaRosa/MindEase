import type { AuthResult } from "@/domain/entities/AuthResult";
import type { User } from "@/domain/entities/User";
import type { IAuthRepository } from "@/domain/interfaces/IAuthRepository";

export async function signUp(
  repository: IAuthRepository,
  email: string,
  password: string,
  fullName?: string,
): Promise<AuthResult<User>> {
  try {
    return await repository.signUp(email, password, fullName);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao criar conta";
    return {
      success: false,
      error: { message, status: 500 },
    };
  }
}
