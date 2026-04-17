import { describe, expect, it } from "vitest";
import { runColorPicker } from "@/tools/logic/color-picker";

describe("color-picker", () => {
  it("returns HEX, RGB and HSL formats", () => {
    const result = runColorPicker({ hex: "#0EA5E9" });

    expect(result.hex).toBe("#0EA5E9");
    expect(result.rgb).toContain("rgb(");
    expect(result.hsl).toContain("hsl(");
  });
});
