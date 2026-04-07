import { describe, expect, it } from "vitest";
import { toolDefinitions } from "@/lib/tools/tool-registry.generated";

describe("tool registry", () => {
  it("contains unique ids", () => {
    const ids = toolDefinitions.map((tool) => tool.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
