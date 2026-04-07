import { describe, expect, it } from "vitest";
import { runFaviconGenerator } from "@/tools/logic/favicon-generator";

describe("favicon-generator", () => {
  it("returns the expected output shape", () => {
    const result = runFaviconGenerator({ sourceName: "logo.png", sourceDataUrl: "data:image/png;base64,AA==", format: "png" });
    expect(String(result.total)).toContain("5");
  });
});
