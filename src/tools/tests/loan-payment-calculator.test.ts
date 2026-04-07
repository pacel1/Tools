import { describe, expect, it } from "vitest";
import { runLoanPaymentCalculator } from "@/tools/logic/loan-payment-calculator";

describe("loan-payment-calculator", () => {
  it("returns a numeric result", () => {
    const result = runLoanPaymentCalculator({ principal: 25000, annualRate: 6, termMonths: 60 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
