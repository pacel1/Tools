import { describe, expect, it } from "vitest";
import { runMarkupCalculator } from "@/tools/logic/markup-calculator";

describe("markup-calculator", () => {
  it("returns a numeric result", () => {
    const result = runMarkupCalculator({ cost: 50, markupPercent: 30 });
    expect(Number.isFinite(result.result)).toBe(true);
  });
});
