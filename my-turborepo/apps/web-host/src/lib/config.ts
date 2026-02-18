/**
 * Obtém a URL do MFE de autenticação baseada no ambiente
 * @returns URL do MFE de autenticação
 */
export function getAuthUrl(): string {
  // Em desenvolvimento, usa localhost
  return "http://localhost:3001";
}
