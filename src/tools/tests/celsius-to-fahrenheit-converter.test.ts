import { describe, expect, it } from "vitest";
import { runCelsiusToFahrenheitConverter } from "@/tools/logic/celsius-to-fahrenheit-converter";

describe("celsius-to-fahrenheit-converter", () => {
  it("converts the input value", () => {
    const result = runCelsiusToFahrenheitConverter({ value: 20 });
    expect(result.result).toBeGreaterThan(0);
  });
});
