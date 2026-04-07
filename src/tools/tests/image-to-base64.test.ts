import { describe, expect, it } from "vitest";
import { runImageToBase64 } from "@/tools/logic/image-to-base64";

describe("image-to-base64", () => {
  it("returns the expected output shape", () => {
    const result = runImageToBase64({ sourceName: "photo.png", dataUrl: "data:image/png;base64,AA==" });
    expect(result.base64).toContain("AA==");
  });
});
