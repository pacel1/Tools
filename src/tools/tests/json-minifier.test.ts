import { describe, expect, it } from "vitest";
import { runJsonMinifier } from "@/tools/logic/json-minifier";

describe("json-minifier", () => {
  it("processes valid JSON", () => {
    const result = runJsonMinifier({ source: '{"name":"tool","value":1}' });
    expect(result.valid).toBe(true);
  });
});
