import { describe, expect, it } from "vitest";
import { runUnitPriceCalculator } from "@/tools/logic/unit-price-calculator";

describe("unit-price-calculator", () => {
  it("returns a numeric result", () => {
    const result = runUnitPriceCalculator({ totalPrice: 12, quantity: 3 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
