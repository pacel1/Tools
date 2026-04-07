import { describe, expect, it } from "vitest";
import { runMilesToKmConverter } from "@/tools/logic/miles-to-km-converter";

describe("miles-to-km-converter", () => {
  it("converts the input value", () => {
    const result = runMilesToKmConverter({ value: 10 });
    expect(result.result).toBeGreaterThan(0);
  });
});
