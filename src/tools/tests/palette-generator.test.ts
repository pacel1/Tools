import { describe, expect, it } from "vitest";
import { runPaletteGenerator } from "@/tools/logic/palette-generator";

describe("palette-generator", () => {
  it("builds a palette with the requested number of swatches", () => {
    const result = runPaletteGenerator({ baseColor: "#14B8A6", count: 6 });

    expect(result.palette).toHaveLength(6);
    expect(result.palette[0]).toMatch(/^#/);
  });
});
