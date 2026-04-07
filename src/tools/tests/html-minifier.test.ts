import { describe, expect, it } from "vitest";
import { runHtmlMinifier } from "@/tools/logic/html-minifier";

describe("html-minifier", () => {
  it("minifies HTML", async () => {
    const result = await runHtmlMinifier({ html: "<div>  <span>Hello</span> </div>" });
    expect(result.minifiedHtml.length).toBeLessThan("<div>  <span>Hello</span> </div>".length);
  });
});
