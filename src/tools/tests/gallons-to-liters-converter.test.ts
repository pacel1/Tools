import { describe, expect, it } from "vitest";
import { runGallonsToLitersConverter } from "@/tools/logic/gallons-to-liters-converter";

describe("gallons-to-liters-converter", () => {
  it("converts the input value", () => {
    const result = runGallonsToLitersConverter({ value: 3 });
    expect(result.result).toBeGreaterThan(0);
  });
});
