import { describe, expect, it } from "vitest";
import { runTipCalculator } from "@/tools/logic/tip-calculator";

describe("tip-calculator", () => {
  it("returns a numeric result", () => {
    const result = runTipCalculator({ amount: 86, percent: 15 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
