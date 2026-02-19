import type { AuthResult } from "@/domain/entities/AuthResult";
import type { IAuthRepository } from "@/domain/interfaces/IAuthRepository";

export async function signInWithMagicLink(
  repository: IAuthRepository,
  email: string,
  redirectTo?: string,
): Promise<AuthResult<void>> {
  try {
    const result = await repository.signInWithMagicLink(email, redirectTo);

    if (!result.success) {
      return result;
    }

    try {
      await repository.trackMagicLinkRequest(email);
    } catch (trackingError) {
      console.warn("Failed to track magic link request:", trackingError);
    }

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao enviar magic link";
    return {
      success: false,
      error: { message, status: 500 },
    };
  }
}
