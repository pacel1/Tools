import { describe, expect, it } from "vitest";
import { runMbToGbConverter } from "@/tools/logic/mb-to-gb-converter";

describe("mb-to-gb-converter", () => {
  it("converts the input value", () => {
    const result = runMbToGbConverter({ value: 512 });
    expect(result.result).toBe(0.5);
  });
});
