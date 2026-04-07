import { describe, expect, it } from "vitest";
import { runReadingTimeCalculator } from "@/tools/logic/reading-time-calculator";

describe("reading-time-calculator", () => {
  it("returns the expected metric", () => {
    const result = runReadingTimeCalculator({ text: "one two three four five six seven eight nine ten" });
    expect(result.secondary).toBe(10);
  });
});
