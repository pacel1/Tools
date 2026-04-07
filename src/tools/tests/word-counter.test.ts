import { describe, expect, it } from "vitest";
import { countWords } from "@/tools/logic/word-counter";

describe("countWords", () => {
  it("counts words and characters", () => {
    const result = countWords({ text: "One two three" });

    expect(result.words).toBe(3);
    expect(result.characters).toBe(13);
    expect(result.charactersNoSpaces).toBe(11);
  });
});
