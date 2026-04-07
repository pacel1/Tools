import { describe, expect, it } from "vitest";
import { runLbsToKgConverter } from "@/tools/logic/lbs-to-kg-converter";

describe("lbs-to-kg-converter", () => {
  it("converts the input value", () => {
    const result = runLbsToKgConverter({ value: 10 });
    expect(result.result).toBeGreaterThan(0);
  });
});
