import { describe, expect, it } from "vitest";
import { runMetersToFeetConverter } from "@/tools/logic/meters-to-feet-converter";

describe("meters-to-feet-converter", () => {
  it("converts the input value", () => {
    const result = runMetersToFeetConverter({ value: 2 });
    expect(result.result).toBeGreaterThan(0);
  });
});
