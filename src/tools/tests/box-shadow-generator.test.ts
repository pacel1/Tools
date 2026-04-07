import { describe, expect, it } from "vitest";
import { runBoxShadowGenerator } from "@/tools/logic/box-shadow-generator";

describe("box-shadow-generator", () => {
  it("returns the expected output shape", () => {
    const result = runBoxShadowGenerator({ offsetX: 2, offsetY: 8, blur: 20, spread: 0, color: "#000000", opacity: 0.4, inset: false });
    expect(result.css).toContain("box-shadow");
  });
});
