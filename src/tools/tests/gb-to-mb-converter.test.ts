import { describe, expect, it } from "vitest";
import { runGbToMbConverter } from "@/tools/logic/gb-to-mb-converter";

describe("gb-to-mb-converter", () => {
  it("converts the input value", () => {
    const result = runGbToMbConverter({ value: 2 });
    expect(result.result).toBe(2048);
  });
});
