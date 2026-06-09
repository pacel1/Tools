import { describe, expect, it } from "vitest";
import {
  getIndexableToolCount,
  isIndexableToolPage,
  isToolIdIndexable,
  maxIndexableTools
} from "@/lib/seo/indexing";
import { toolDefinitions } from "@/lib/tools/tool-registry.generated";

describe("indexing policy", () => {
  it("limits the indexable pool to maxIndexableTools", () => {
    expect(getIndexableToolCount()).toBeLessThanOrEqual(maxIndexableTools);
    expect(getIndexableToolCount()).toBeGreaterThan(0);
  });

  it("selects the highest-seoPriority tools first", () => {
    const topId = [...toolDefinitions].sort(
      (left, right) =>
        right.seoPriority - left.seoPriority || left.id.localeCompare(right.id)
    )[0].id;

    expect(isToolIdIndexable(topId)).toBe(true);
  });

  it("keeps lowest-priority tools out of the pool", () => {
    const ranked = [...toolDefinitions].sort(
      (left, right) =>
        right.seoPriority - left.seoPriority || left.id.localeCompare(right.id)
    );

    if (ranked.length > maxIndexableTools) {
      expect(isToolIdIndexable(ranked[ranked.length - 1].id)).toBe(false);
    }
  });

  it("indexes pooled tools across every supported locale", () => {
    const pooled = toolDefinitions.find((definition) =>
      isToolIdIndexable(definition.id)
    );

    expect(pooled).toBeDefined();
    if (pooled) {
      for (const locale of pooled.supportedLocales) {
        expect(isIndexableToolPage(pooled.id, locale)).toBe(true);
      }
    }
  });

  it("never indexes a tool outside the pool", () => {
    expect(isIndexableToolPage("definitely-not-a-real-tool", "en")).toBe(false);
  });
});
