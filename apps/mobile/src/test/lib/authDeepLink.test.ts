import { beforeEach, describe, expect, it, vi } from "vitest";

const { parseMock, createURLMock } = vi.hoisted(() => ({
  parseMock: vi.fn(),
  createURLMock: vi.fn(),
}));

vi.mock("expo-linking", () => ({
  parse: parseMock,
  createURL: createURLMock,
}));

import {
  createAuthCallbackUrl,
  extractAuthCallbackParams,
} from "@/lib/authDeepLink";

describe("authDeepLink", () => {
  beforeEach(() => {
    parseMock.mockReset();
    createURLMock.mockReset();
  });

  it("creates callback url with fixed scheme and path", () => {
    createURLMock.mockReturnValue("mindease://auth/callback");

    const redirectTo = createAuthCallbackUrl();

    expect(createURLMock).toHaveBeenCalledWith("auth/callback", {
      scheme: "mindease",
    });
    expect(redirectTo).toBe("mindease://auth/callback");
  });

  it("extracts tokens from hash fragment", () => {
    parseMock.mockReturnValue({ queryParams: {} });

    const params = extractAuthCallbackParams(
      "mindease://auth/callback#access_token=abc&refresh_token=def",
    );

    expect(params).toEqual({
      accessToken: "abc",
      refreshToken: "def",
      code: null,
    });
  });

  it("extracts code from query params", () => {
    parseMock.mockReturnValue({
      queryParams: { code: "otp_code_123" },
    });

    const params = extractAuthCallbackParams("mindease://auth/callback?code=x");

    expect(params).toEqual({
      accessToken: null,
      refreshToken: null,
      code: "otp_code_123",
    });
  });
});
