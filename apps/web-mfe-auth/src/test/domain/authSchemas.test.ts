import { describe, expect, it } from "vitest";
import {
  loginSchema,
  magicLinkSchema,
  signUpSchema,
} from "@/domain/valueObjects/authSchemas";

describe("authSchemas", () => {
  it("accepts valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "ana@example.com",
      password: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid login email", () => {
    const result = loginSchema.safeParse({
      email: "ana-example.com",
      password: "123456",
    });

    expect(result.success).toBe(false);
  });

  it("rejects sign-up when passwords do not match", () => {
    const result = signUpSchema.safeParse({
      email: "ana@example.com",
      password: "123456",
      confirmPassword: "654321",
      fullName: "Ana",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("confirmPassword");
    }
  });

  it("accepts valid magic link payload", () => {
    const result = magicLinkSchema.safeParse({ email: "ana@example.com" });

    expect(result.success).toBe(true);
  });
});
