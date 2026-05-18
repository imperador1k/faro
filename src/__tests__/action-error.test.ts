import { describe, it, expect } from "vitest";
import { actionError, ActionErrorCodes } from "@/lib/action-error";

describe("action-error", () => {
  describe("ActionErrorCodes", () => {
    it("should have all expected error codes", () => {
      expect(ActionErrorCodes.UNAUTHORIZED).toBe("UNAUTHORIZED");
      expect(ActionErrorCodes.RATE_LIMIT_EXCEEDED).toBe("RATE_LIMIT_EXCEEDED");
      expect(ActionErrorCodes.INVALID_PAYLOAD).toBe("INVALID_PAYLOAD");
      expect(ActionErrorCodes.SPOOFING_DETECTED).toBe("SPOOFING_DETECTED");
      expect(ActionErrorCodes.INSUFFICIENT_FUNDS).toBe("INSUFFICIENT_FUNDS");
      expect(ActionErrorCodes.NOT_FOUND).toBe("NOT_FOUND");
      expect(ActionErrorCodes.CONFLICT).toBe("CONFLICT");
      expect(ActionErrorCodes.BAD_REQUEST).toBe("BAD_REQUEST");
      expect(ActionErrorCodes.SERVER_ERROR).toBe("SERVER_ERROR");
      expect(ActionErrorCodes.FORBIDDEN).toBe("FORBIDDEN");
    });
  });

  describe("actionError", () => {
    it("should return a StandardActionError with success: false", () => {
      const result = actionError("UNAUTHORIZED", "Não estás autenticado");
      expect(result).toEqual({
        success: false,
        code: "UNAUTHORIZED",
        message: "Não estás autenticado",
      });
    });

    it("should work with all error codes", () => {
      for (const code of Object.values(ActionErrorCodes)) {
        const result = actionError(code, "Test message");
        expect(result.success).toBe(false);
        expect(result.code).toBe(code);
        expect(result.message).toBe("Test message");
      }
    });
  });
});
