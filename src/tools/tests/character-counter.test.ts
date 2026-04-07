import { describe, expect, it } from "vitest";
import { runCharacterCounter } from "@/tools/logic/character-counter";

describe("character-counter", () => {
  it("returns the expected metric", () => {
    const result = runCharacterCounter({ text: "One two" });
    expect(result.primary).toBe(7);
  });
});
