import { describe, expect, it } from "vitest";
import { runHtmlCleaner } from "@/tools/logic/html-cleaner";

describe("html-cleaner", () => {
  it("removes unsafe tags and comments", () => {
    const result = runHtmlCleaner({ html: "<div><!-- note --><script>x()</script><p>Safe</p></div>", indentSize: 2, removeComments: true });
    expect(result.output).not.toContain("<script");
    expect(result.output).not.toContain("<!--");
  });
});
