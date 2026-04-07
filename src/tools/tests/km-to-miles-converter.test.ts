import { describe, expect, it } from "vitest";
import { runKmToMilesConverter } from "@/tools/logic/km-to-miles-converter";

describe("km-to-miles-converter", () => {
  it("converts the input value", () => {
    const result = runKmToMilesConverter({ value: 5 });
    expect(result.result).toBeGreaterThan(0);
  });
});
