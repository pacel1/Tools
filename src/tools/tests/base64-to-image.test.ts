import { describe, expect, it } from "vitest";
import { runBase64ToImage } from "@/tools/logic/base64-to-image";

describe("base64-to-image", () => {
  it("returns the expected output shape", () => {
    const result = runBase64ToImage({ value: "AA==", format: "png" });
    expect(result.dataUrl).toContain("data:image/png;base64");
  });
});
