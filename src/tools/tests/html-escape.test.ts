import { describe, expect, it } from "vitest";
import { runHtmlEscape } from "@/tools/logic/html-escape";

describe("html-escape", () => {
  it("escapes reserved characters", () => {
    const result = runHtmlEscape({ text: "<div>Hello & bye</div>" });
    expect(result.output).toContain("&lt;div&gt;");
    expect(result.output).toContain("&amp;");
  });
});
