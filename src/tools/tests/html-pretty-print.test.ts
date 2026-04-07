import { describe, expect, it } from "vitest";
import { runHtmlPrettyPrint } from "@/tools/logic/html-pretty-print";

describe("html-pretty-print", () => {
  it("pretty prints markup", () => {
    const result = runHtmlPrettyPrint({ html: "<div><span>Hello</span></div>" });
    expect(result.output).toContain("\n");
  });
});
