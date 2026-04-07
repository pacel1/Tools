import { describe, expect, it } from "vitest";
import { formatJson } from "@/tools/logic/json-formatter";

describe("formatJson", () => {
  it("formats and minifies json", () => {
    const result = formatJson({ json: '{"a":1,"b":2}', indent: 2 });

    expect(result.formatted).toContain('\n  "a": 1,');
    expect(result.minified).toBe('{"a":1,"b":2}');
    expect(result.lineCount).toBeGreaterThan(1);
  });
});
