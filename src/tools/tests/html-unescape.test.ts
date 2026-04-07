import { describe, expect, it } from "vitest";
import { runHtmlUnescape } from "@/tools/logic/html-unescape";

describe("html-unescape", () => {
  it("decodes entities", () => {
    const result = runHtmlUnescape({ text: "&lt;div&gt;Hello&lt;/div&gt;" });
    expect(result.output).toBe("<div>Hello</div>");
  });
});
