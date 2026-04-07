import { describe, expect, it } from "vitest";
import { runInchesToCmConverter } from "@/tools/logic/inches-to-cm-converter";

describe("inches-to-cm-converter", () => {
  it("converts the input value", () => {
    const result = runInchesToCmConverter({ value: 10 });
    expect(result.result).toBeGreaterThan(0);
  });
});
