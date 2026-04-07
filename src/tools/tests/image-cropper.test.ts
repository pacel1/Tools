import { describe, expect, it } from "vitest";
import { runImageCropper } from "@/tools/logic/image-cropper";

describe("image-cropper", () => {
  it("returns the expected output shape", () => {
    const result = runImageCropper({ sourceName: "photo.png", sourceDataUrl: "data:image/png;base64,AA==", imageWidth: 1600, imageHeight: 900, x: 10, y: 20, width: 400, height: 300, format: "png" });
    expect(String(result.crop.width)).toContain("400");
  });
});
