import { describe, expect, it } from "vitest";
import { runDiscountCalculator } from "@/tools/logic/discount-calculator";

describe("discount-calculator", () => {
  it("returns a numeric result", () => {
    const result = runDiscountCalculator({ amount: 100, percent: 20 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
