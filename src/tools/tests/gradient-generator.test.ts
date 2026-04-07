import { describe, expect, it } from "vitest";
import { runGradientGenerator } from "@/tools/logic/gradient-generator";

describe("gradient-generator", () => {
  it("returns the expected output shape", () => {
    const result = runGradientGenerator({ gradientType: "linear", angle: 90, colorOne: "#000000", colorTwo: "#ffffff" });
    expect(result.css).toContain("linear-gradient");
  });
});
