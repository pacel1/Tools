import { describe, expect, it } from "vitest";
import { runInchConverter } from "@/tools/logic/inch-converter";

describe("inch-converter", () => {
  it("converts inches to centimeters", () => {
    const result = runInchConverter({ value: 10, fromUnit: "IN", toUnit: "CM" });

    expect(result.result).toBeCloseTo(25.4, 4);
    expect(result.formatted).toBe("25.4");
  });
});
