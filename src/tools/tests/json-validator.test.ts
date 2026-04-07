import { describe, expect, it } from "vitest";
import { runJsonValidator } from "@/tools/logic/json-validator";

describe("json-validator", () => {
  it("processes valid JSON", () => {
    const result = runJsonValidator({ source: '{"name":"tool","value":1}' });
    expect(result.valid).toBe(true);
  });
});
