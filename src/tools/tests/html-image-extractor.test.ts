import { describe, expect, it } from "vitest";
import { runHtmlImageExtractor } from "@/tools/logic/html-image-extractor";

describe("html-image-extractor", () => {
  it("extracts image metadata", () => {
    const result = runHtmlImageExtractor({ html: '<img src="/hero.jpg" alt="Hero" width="640" height="360" />' });
    expect(result.total).toBe(1);
    expect(result.images[0]?.alt).toBe("Hero");
  });
});
