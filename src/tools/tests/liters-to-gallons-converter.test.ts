import { describe, expect, it } from "vitest";
import { runLitersToGallonsConverter } from "@/tools/logic/liters-to-gallons-converter";

describe("liters-to-gallons-converter", () => {
  it("converts the input value", () => {
    const result = runLitersToGallonsConverter({ value: 10 });
    expect(result.result).toBeGreaterThan(0);
  });
});
