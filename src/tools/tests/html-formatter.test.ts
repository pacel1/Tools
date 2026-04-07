import { describe, expect, it } from "vitest";
import { runHtmlFormatter } from "@/tools/logic/html-formatter";

describe("html-formatter", () => {
  it("formats nested HTML", () => {
    const result = runHtmlFormatter({ html: "<div><span>Hello</span></div>", indentSize: 2 });
    expect(result.output).toContain("\n");
    expect(result.output).toContain("<span>Hello</span>");
  });
});
