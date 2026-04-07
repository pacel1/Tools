import { describe, expect, it } from "vitest";
import { runHtmlValidator } from "@/tools/logic/html-validator";

describe("html-validator", () => {
  it("reports unsafe markup", () => {
    const result = runHtmlValidator({ html: '<a href="javascript:alert(1)" target="_blank">Bad</a><img src="/x.png" />' });
    expect(result.errorCount).toBeGreaterThan(0);
    expect(result.warningCount).toBeGreaterThan(0);
  });
});
