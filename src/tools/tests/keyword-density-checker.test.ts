import { describe, expect, it } from "vitest";
import { runKeywordDensityChecker } from "@/tools/logic/keyword-density-checker";

describe("keyword-density-checker", () => {
  it("calculates keyword density", () => {
    const result = runKeywordDensityChecker({ text: "seo tools and more seo content", keyword: "seo" });
    expect(result.secondary).toBe(2);
    expect(result.tertiary).toBe(6);
  });
});
