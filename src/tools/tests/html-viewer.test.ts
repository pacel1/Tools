import { describe, expect, it } from "vitest";
import { runHtmlViewer } from "@/tools/logic/html-viewer";

describe("html-viewer", () => {
  it("removes unsafe scripts from preview output", () => {
    const result = runHtmlViewer({ html: "<div><script>alert(1)</script><p>Safe</p></div>" });
    expect(result.sanitizedHtml).not.toContain("<script");
    expect(result.sanitizedHtml).toContain("<p>Safe</p>");
  });
});
