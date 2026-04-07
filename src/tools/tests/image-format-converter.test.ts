import { describe, expect, it } from "vitest";
import { runImageFormatConverter } from "@/tools/logic/image-format-converter";

describe("image-format-converter", () => {
  it("returns the expected output shape", () => {
    const result = runImageFormatConverter({ sourceName: "photo.png", sourceDataUrl: "data:image/png;base64,AA==", width: 1600, height: 900, targetFormat: "webp", quality: 0.8 });
    expect(result.downloadName).toContain("converted.webp");
  });
});
