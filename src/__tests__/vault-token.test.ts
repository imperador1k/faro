import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createVaultToken, validateVaultToken } from "@/lib/vault-token";

describe("vault-token", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, ADMIN_SUDO_HASH: "test-secret-hash-123" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("createVaultToken", () => {
    it("should create a token with userId:expiry:signature format", async () => {
      const token = await createVaultToken("user_123");
      const parts = token.split(":");
      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe("user_123");
      expect(parts[1]).toMatch(/^\d+$/);
      expect(parts[2]).toHaveLength(64);
    });

    it("should create tokens with future expiry", async () => {
      const token = await createVaultToken("user_123");
      const expiry = parseInt(token.split(":")[1], 10);
      const now = Math.floor(Date.now() / 1000);
      expect(expiry).toBeGreaterThan(now);
    });
  });

  describe("validateVaultToken", () => {
    it("should validate a correctly created token", async () => {
      const token = await createVaultToken("user_123");
      const result = await validateVaultToken(token);
      expect(result).toBe("user_123");
    });

    it("should reject malformed tokens", async () => {
      expect(await validateVaultToken("invalid")).toBeNull();
      expect(await validateVaultToken("a:b")).toBeNull();
      expect(await validateVaultToken("")).toBeNull();
    });

    it("should reject tokens with invalid signatures", async () => {
      const token = await createVaultToken("user_123");
      const parts = token.split(":");
      const tamperedToken = `${parts[0]}:${parts[1]}:invalidsignature`;
      expect(await validateVaultToken(tamperedToken)).toBeNull();
    });

    it("should reject expired tokens", async () => {
      const token = await createVaultToken("user_123");
      const parts = token.split(":");
      const pastExpiry = Math.floor(Date.now() / 1000) - 100;
      const expiredToken = `${parts[0]}:${pastExpiry}:${parts[2]}`;
      expect(await validateVaultToken(expiredToken)).toBeNull();
    });

    it("should reject tokens with wrong secret", async () => {
      const token = await createVaultToken("user_123");
      process.env.ADMIN_SUDO_HASH = "different-secret";
      expect(await validateVaultToken(token)).toBeNull();
    });
  });
});
