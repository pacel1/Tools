import { describe, expect, it } from "vitest";
import { runCmToInchesConverter } from "@/tools/logic/cm-to-inches-converter";

describe("cm-to-inches-converter", () => {
  it("converts the input value", () => {
    const result = runCmToInchesConverter({ value: 10 });
    expect(result.result).toBeGreaterThan(0);
  });
});
