import { describe, expect, it } from "vitest";
import { runAgeCalculator } from "@/tools/logic/age-calculator";

describe("age-calculator", () => {
  it("returns a valid result", () => {
    const result = runAgeCalculator({ birthDate: "1990-05-15" });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
