import { describe, expect, it } from "vitest";
import { runHexToRgbConverter } from "@/tools/logic/hex-to-rgb-converter";

describe("hex-to-rgb-converter", () => {
  it("returns RGB channel values for a HEX color", () => {
    const result = runHexToRgbConverter({ hex: "#FF7A18" });

    expect(result.rgb).toBe("rgb(255, 122, 24)");
    expect(result.red).toBe(255);
  });
});
