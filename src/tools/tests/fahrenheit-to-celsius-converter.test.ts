import { describe, expect, it } from "vitest";
import { runFahrenheitToCelsiusConverter } from "@/tools/logic/fahrenheit-to-celsius-converter";

describe("fahrenheit-to-celsius-converter", () => {
  it("converts the input value", () => {
    const result = runFahrenheitToCelsiusConverter({ value: 68 });
    expect(result.result).toBeGreaterThan(0);
  });
});
