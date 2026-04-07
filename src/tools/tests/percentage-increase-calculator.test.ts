import { describe, expect, it } from "vitest";
import { runPercentageIncreaseCalculator } from "@/tools/logic/percentage-increase-calculator";

describe("percentage-increase-calculator", () => {
  it("returns a numeric result", () => {
    const result = runPercentageIncreaseCalculator({ value: 120, percent: 15 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
