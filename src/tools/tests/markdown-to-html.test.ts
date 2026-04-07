import { describe, expect, it } from "vitest";
import { runMarkdownToHtml } from "@/tools/logic/markdown-to-html";

describe("markdown-to-html", () => {
  it("renders markdown as sanitized HTML", () => {
    const result = runMarkdownToHtml({ markdown: "# Hello" });
    expect(result.sanitizedHtml).toContain("<h1>Hello</h1>");
  });
});
