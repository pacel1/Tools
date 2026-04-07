import { describe, expect, it } from "vitest";
import { runBmiCalculator } from "@/tools/logic/bmi-calculator";

describe("bmi-calculator", () => {
  it("returns a numeric result", () => {
    const result = runBmiCalculator({ weightKg: 70, heightCm: 175 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
