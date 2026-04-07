import { describe, expect, it } from "vitest";
import { runHtmlToMarkdown } from "@/tools/logic/html-to-markdown";

describe("html-to-markdown", () => {
  it("converts basic HTML into markdown", () => {
    const result = runHtmlToMarkdown({ html: "<h1>Hello</h1><p>World</p>" });
    expect(result.output).toContain("# Hello");
  });
});
