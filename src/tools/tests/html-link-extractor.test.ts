import { describe, expect, it } from "vitest";
import { runHtmlLinkExtractor } from "@/tools/logic/html-link-extractor";

describe("html-link-extractor", () => {
  it("extracts link metadata", () => {
    const result = runHtmlLinkExtractor({ html: '<a href="https://example.com" rel="nofollow">Docs</a>' });
    expect(result.total).toBe(1);
    expect(result.links[0]?.href).toBe("https://example.com");
  });
});
