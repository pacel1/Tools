import { describe, expect, it } from "vitest";
import { runImageCompressor } from "@/tools/logic/image-compressor";

describe("image-compressor", () => {
  it("returns the expected output shape", () => {
    const result = runImageCompressor({ sourceName: "photo.png", sourceDataUrl: "data:image/png;base64,AA==", width: 1600, height: 900, format: "jpeg", quality: 0.7, originalBytes: 500000 });
    expect(String(result.quality)).toContain("0.7");
  });
});
