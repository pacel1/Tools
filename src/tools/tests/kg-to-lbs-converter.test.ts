import { describe, expect, it } from "vitest";
import { convertKgToLbs } from "@/tools/logic/kg-to-lbs-converter";

describe("convertKgToLbs", () => {
  it("converts kilograms to pounds", () => {
    const result = convertKgToLbs({ kilograms: 10 });

    expect(result.formatted).toBe("22.05 lb");
    expect(result.pounds).toBeCloseTo(22.046226218, 6);
  });
});
