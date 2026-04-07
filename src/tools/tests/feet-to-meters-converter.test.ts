import { describe, expect, it } from "vitest";
import { runFeetToMetersConverter } from "@/tools/logic/feet-to-meters-converter";

describe("feet-to-meters-converter", () => {
  it("converts the input value", () => {
    const result = runFeetToMetersConverter({ value: 6 });
    expect(result.result).toBeGreaterThan(0);
  });
});
