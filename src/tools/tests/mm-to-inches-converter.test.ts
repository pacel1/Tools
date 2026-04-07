import { describe, expect, it } from "vitest";
import { runMmToInchesConverter } from "@/tools/logic/mm-to-inches-converter";

describe("mm-to-inches-converter", () => {
  it("converts the input value", () => {
    const result = runMmToInchesConverter({ value: 25 });
    expect(result.result).toBeGreaterThan(0);
  });
});
