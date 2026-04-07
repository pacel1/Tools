import { describe, expect, it } from "vitest";
import { runPercentageCalculator } from "@/tools/logic/percentage-calculator";

describe("percentage-calculator", () => {
  it("returns a numeric result", () => {
    const result = runPercentageCalculator({ value: 25, total: 200 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
