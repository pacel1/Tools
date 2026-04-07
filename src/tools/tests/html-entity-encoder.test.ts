import { describe, expect, it } from "vitest";
import { runHtmlEntityEncoder } from "@/tools/logic/html-entity-encoder";

describe("html-entity-encoder", () => {
  it("encodes special characters", () => {
    const result = runHtmlEntityEncoder({ text: "© <tag>" });
    expect(result.output).toContain("&#169;");
    expect(result.output).toContain("&lt;tag&gt;");
  });
});
