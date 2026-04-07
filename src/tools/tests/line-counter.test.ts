import { describe, expect, it } from "vitest";
import { runLineCounter } from "@/tools/logic/line-counter";

describe("line-counter", () => {
  it("returns the expected metric", () => {
    const result = runLineCounter({ text: "one\ntwo\nthree" });
    expect(result.primary).toBe(3);
  });
});
