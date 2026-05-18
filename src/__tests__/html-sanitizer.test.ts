import { describe, it, expect } from "vitest";
import {
  sanitizeHtml,
  sanitizeText,
  sanitizeFileName,
  validateFileType,
  validateFileSize,
} from "@/lib/html-sanitizer";

describe("html-sanitizer", () => {
  describe("sanitizeHtml", () => {
    it("should allow safe HTML tags", () => {
      const input = "<p>Hello <strong>world</strong></p>";
      expect(sanitizeHtml(input)).toContain("<p>");
      expect(sanitizeHtml(input)).toContain("<strong>");
    });

    it("should remove script tags", () => {
      const input = "<p>Safe</p><script>alert('xss')</script>";
      expect(sanitizeHtml(input)).not.toContain("<script>");
      expect(sanitizeHtml(input)).toContain("<p>");
    });

    it("should remove javascript: protocol from href", () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      expect(sanitizeHtml(input)).not.toContain("javascript:");
    });

    it("should remove event handlers", () => {
      const input = '<p onclick="alert(1)">Click</p>';
      expect(sanitizeHtml(input)).not.toContain("onclick");
    });

    it("should allow safe attributes like href and class", () => {
      const input = '<a href="https://example.com" class="link">Link</a>';
      const result = sanitizeHtml(input);
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('class="link"');
    });

    it("should handle empty input", () => {
      expect(sanitizeHtml("")).toBe("");
      expect(sanitizeHtml(null as unknown as string)).toBe("");
      expect(sanitizeHtml(undefined as unknown as string)).toBe("");
    });
  });

  describe("sanitizeText", () => {
    it("should escape HTML special characters", () => {
      expect(sanitizeText("<script>")).toBe("&lt;script&gt;");
      expect(sanitizeText('"hello"')).toBe("&quot;hello&quot;");
      expect(sanitizeText("'hello'")).toBe("&#x27;hello&#x27;");
      expect(sanitizeText("&")).toBe("&amp;");
    });

    it("should handle empty input", () => {
      expect(sanitizeText("")).toBe("");
      expect(sanitizeText(null as unknown as string)).toBe("");
    });
  });

  describe("sanitizeFileName", () => {
    it("should remove special characters", () => {
      expect(sanitizeFileName("file<script>.png")).toBe("file_script_.png");
    });

    it("should collapse multiple underscores", () => {
      expect(sanitizeFileName("file___name.png")).toBe("file_name.png");
    });

    it("should truncate to 100 characters", () => {
      const longName = "a".repeat(150);
      expect(sanitizeFileName(longName).length).toBeLessThanOrEqual(100);
    });
  });

  describe("validateFileType", () => {
    it("should allow allowed types", () => {
      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      expect(validateFileType(file, ["image/jpeg", "image/png"])).toBe(true);
    });

    it("should reject disallowed types", () => {
      const file = new File([""], "test.exe", {
        type: "application/x-executable",
      });
      expect(validateFileType(file, ["image/jpeg", "image/png"])).toBe(false);
    });
  });

  describe("validateFileSize", () => {
    it("should allow files under limit", () => {
      const file = new File(["a".repeat(1000)], "small.jpg", {
        type: "image/jpeg",
      });
      expect(validateFileSize(file, 5000)).toBe(true);
    });

    it("should reject files over limit", () => {
      const file = new File(["a".repeat(10000)], "large.jpg", {
        type: "image/jpeg",
      });
      expect(validateFileSize(file, 5000)).toBe(false);
    });
  });
});
