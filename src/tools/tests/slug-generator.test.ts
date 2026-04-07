import { describe, expect, it } from "vitest";
import { runSlugGenerator } from "@/tools/logic/slug-generator";

describe("slug-generator", () => {
  it("transforms text", () => {
    const result = runSlugGenerator({ text: "Best SEO Tool Page Title" });
    expect(result.result).toBe("best-seo-tool-page-title");
  });
});
