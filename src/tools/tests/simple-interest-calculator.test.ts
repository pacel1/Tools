import { describe, expect, it } from "vitest";
import { runSimpleInterestCalculator } from "@/tools/logic/simple-interest-calculator";

describe("simple-interest-calculator", () => {
  it("returns a numeric result", () => {
    const result = runSimpleInterestCalculator({ principal: 5000, annualRate: 4, years: 3 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
