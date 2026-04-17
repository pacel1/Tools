import { describe, expect, it } from "vitest";
import { runIconMaker } from "@/tools/logic/icon-maker";

describe("icon-maker", () => {
  it("returns a downloadable file plan", () => {
    const result = runIconMaker({
      sourceName: "logo.png",
      sourceDataUrl: "data:image/png;base64,AA==",
      size: 512,
      padding: 10,
      background: "#0f172a",
      format: "png"
    });

    expect(result.downloadName).toContain("icon.png");
    expect(result.size).toBe(512);
  });
});
