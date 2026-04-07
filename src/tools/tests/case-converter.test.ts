import { describe, expect, it } from "vitest";
import { runCaseConverter } from "@/tools/logic/case-converter";

describe("case-converter", () => {
  it("returns multiple case variants", () => {
    const result = runCaseConverter({ text: "hello world" });
    expect(result.upper).toBe("HELLO WORLD");
    expect(result.title).toBe("Hello World");
  });
});
