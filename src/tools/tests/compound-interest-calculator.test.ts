import { describe, expect, it } from "vitest";
import { runCompoundInterestCalculator } from "@/tools/logic/compound-interest-calculator";

describe("compound-interest-calculator", () => {
  it("returns a numeric result", () => {
    const result = runCompoundInterestCalculator({ principal: 5000, annualRate: 5, years: 10, compoundsPerYear: 12 });
    expect(Number.isFinite(result.result)).toBe(true);
  });

  it("returns zero instead of crashing when compounds per year is zero", () => {
    const result = runCompoundInterestCalculator({ principal: 5000, annualRate: 5, years: 10, compoundsPerYear: 0 });
    expect(result.result).toBe(0);
  });
});
