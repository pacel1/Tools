import { describe, expect, it } from "vitest";
import { runPlaceholderImageGenerator } from "@/tools/logic/placeholder-image-generator";

describe("placeholder-image-generator", () => {
  it("returns the expected output shape", () => {
    const result = runPlaceholderImageGenerator({ width: 1200, height: 630, background: "#000000", foreground: "#ffffff", text: "Demo", format: "png" });
    expect(result.filename).toContain("placeholder-1200x630");
  });
});
