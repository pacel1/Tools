import { describe, expect, it } from "vitest";
import { runInchesToMmConverter } from "@/tools/logic/inches-to-mm-converter";

describe("inches-to-mm-converter", () => {
  it("converts the input value", () => {
    const result = runInchesToMmConverter({ value: 4 });
    expect(result.result).toBeGreaterThan(0);
  });
});
