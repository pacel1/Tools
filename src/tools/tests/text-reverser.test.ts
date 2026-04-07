import { describe, expect, it } from "vitest";
import { runTextReverser } from "@/tools/logic/text-reverser";

describe("text-reverser", () => {
  it("transforms text", () => {
    const result = runTextReverser({ text: "utility" });
    expect(result.result).toBe("ytilitu");
  });
});
