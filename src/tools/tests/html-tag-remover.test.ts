import { describe, expect, it } from "vitest";
import { runHtmlTagRemover } from "@/tools/logic/html-tag-remover";

describe("html-tag-remover", () => {
  it("extracts readable text", () => {
    const result = runHtmlTagRemover({ html: "<p>Hello <strong>world</strong></p>" });
    expect(result.output).toContain("Hello");
    expect(result.output).toContain("world");
  });
});
