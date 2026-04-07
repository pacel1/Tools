import { describe, expect, it } from "vitest";
import { runPercentageDecreaseCalculator } from "@/tools/logic/percentage-decrease-calculator";

describe("percentage-decrease-calculator", () => {
  it("returns a numeric result", () => {
    const result = runPercentageDecreaseCalculator({ value: 120, percent: 15 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
