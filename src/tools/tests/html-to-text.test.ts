import { describe, expect, it } from "vitest";
import { runHtmlToText } from "@/tools/logic/html-to-text";

describe("html-to-text", () => {
  it("extracts readable text", () => {
    const result = runHtmlToText({ html: "<p>Hello <strong>world</strong></p>" });
    expect(result.output).toContain("Hello");
    expect(result.output).toContain("world");
  });
});
