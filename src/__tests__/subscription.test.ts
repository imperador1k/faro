import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateIsPro, DAY_IN_MS } from "@/lib/subscription";
import type { SubscriptionStatus } from "@/types";

describe("subscription", () => {
  describe("calculateIsPro", () => {
    it("should return false for null subscription", () => {
      expect(calculateIsPro(null)).toBe(false);
    });

    it("should return false for subscription without stripeCurrentPeriodEnd", () => {
      expect(calculateIsPro({} as SubscriptionStatus)).toBe(false);
      expect(
        calculateIsPro({
          stripeSubscriptionId: "sub_123",
        } as SubscriptionStatus),
      ).toBe(false);
    });

    it("should return true for active subscription within grace period", () => {
      const futureDate = new Date(Date.now() + DAY_IN_MS * 2);
      expect(
        calculateIsPro({
          stripeCurrentPeriodEnd: futureDate,
        } as SubscriptionStatus),
      ).toBe(true);
    });

    it("should return true for recently expired subscription (within grace period)", () => {
      const recentPast = new Date(Date.now() - DAY_IN_MS / 2);
      expect(
        calculateIsPro({
          stripeCurrentPeriodEnd: recentPast,
        } as SubscriptionStatus),
      ).toBe(true);
    });

    it("should return false for expired subscription outside grace period", () => {
      const oldPast = new Date(Date.now() - DAY_IN_MS * 2);
      expect(
        calculateIsPro({
          stripeCurrentPeriodEnd: oldPast,
        } as SubscriptionStatus),
      ).toBe(false);
    });

    it("should handle string dates", () => {
      const futureDate = new Date(Date.now() + DAY_IN_MS * 2).toISOString();
      expect(
        calculateIsPro({
          stripeCurrentPeriodEnd: futureDate as unknown as Date,
        } as SubscriptionStatus),
      ).toBe(true);
    });
  });

  describe("DAY_IN_MS", () => {
    it("should equal 24 hours in milliseconds", () => {
      expect(DAY_IN_MS).toBe(86_400_000);
    });
  });
});
