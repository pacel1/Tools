import { describe, expect, it } from "vitest";
import { runBmiCalculator } from "@/tools/logic/bmi-calculator";

describe("bmi-calculator", () => {
  it("returns a numeric result", () => {
    const result = runBmiCalculator({ weightKg: 70, heightCm: 175 });
    expect(Number.isFinite(result.result)).toBe(true);
  });

  it("returns zero instead of crashing when height is zero", () => {
    const result = runBmiCalculator({ weightKg: 70, heightCm: 0 });
    expect(result.result).toBe(0);
  });
});
