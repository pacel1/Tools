import { describe, expect, it } from "vitest";
import { runImageResizer } from "@/tools/logic/image-resizer";

describe("image-resizer", () => {
  it("returns the expected output shape", () => {
    const result = runImageResizer({ sourceName: "photo.png", sourceDataUrl: "data:image/png;base64,AA==", originalWidth: 2000, originalHeight: 1000, targetWidth: 1000, targetHeight: 1000, keepAspectRatio: true, format: "png" });
    expect(String(result.height)).toContain("500");
  });
});
