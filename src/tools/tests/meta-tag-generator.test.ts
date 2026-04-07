import { describe, expect, it } from "vitest";
import { runMetaTagGenerator } from "@/tools/logic/meta-tag-generator";

describe("meta-tag-generator", () => {
  it("returns the expected output shape", () => {
    const result = runMetaTagGenerator({ title: "Demo title", description: "Demo description", canonicalUrl: "https://example.com", siteName: "Example", ogImage: "https://example.com/og.jpg" });
    expect(result.snippet).toContain("<meta");
  });
});
