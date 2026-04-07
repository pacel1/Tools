import { describe, expect, it } from "vitest";
import { runDaysBetweenDatesCalculator } from "@/tools/logic/days-between-dates-calculator";

describe("days-between-dates-calculator", () => {
  it("returns a valid result", () => {
    const result = runDaysBetweenDatesCalculator({ startDate: "2025-01-01", endDate: "2025-01-31" });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
