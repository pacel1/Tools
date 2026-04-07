import { describe, expect, it } from "vitest";
import { runSalesTaxCalculator } from "@/tools/logic/sales-tax-calculator";

describe("sales-tax-calculator", () => {
  it("returns a numeric result", () => {
    const result = runSalesTaxCalculator({ amount: 100, percent: 8 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
