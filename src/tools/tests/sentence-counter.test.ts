import { describe, expect, it } from "vitest";
import { runSentenceCounter } from "@/tools/logic/sentence-counter";

describe("sentence-counter", () => {
  it("returns the expected metric", () => {
    const result = runSentenceCounter({ text: "One. Two! Three?" });
    expect(result.primary).toBe(3);
  });
});
