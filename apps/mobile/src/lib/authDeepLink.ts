import * as Linking from "expo-linking";

export const AUTH_CALLBACK_PATH = "auth/callback";

const APP_SCHEME = "mindease";

export interface AuthCallbackParams {
  accessToken: string | null;
  refreshToken: string | null;
  code: string | null;
}

function toStringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function parseHashParams(url: string): Record<string, string> {
  const hash = url.split("#")[1];
  if (!hash) {
    return {};
  }

  const params = new URLSearchParams(hash);
  const parsed: Record<string, string> = {};
  params.forEach((value, key) => {
    parsed[key] = value;
  });

  return parsed;
}

export function createAuthCallbackUrl(): string {
  return Linking.createURL(AUTH_CALLBACK_PATH, { scheme: APP_SCHEME });
}

export function extractAuthCallbackParams(url: string): AuthCallbackParams {
  try {
    const parsed = Linking.parse(url);
    const queryParams = parsed.queryParams ?? {};
    const hashParams = parseHashParams(url);

    return {
      accessToken:
        toStringValue(queryParams["access_token"]) ??
        toStringValue(hashParams["access_token"]),
      refreshToken:
        toStringValue(queryParams["refresh_token"]) ??
        toStringValue(hashParams["refresh_token"]),
      code:
        toStringValue(queryParams["code"]) ?? toStringValue(hashParams["code"]),
    };
  } catch {
    return {
      accessToken: null,
      refreshToken: null,
      code: null,
    };
  }
}
