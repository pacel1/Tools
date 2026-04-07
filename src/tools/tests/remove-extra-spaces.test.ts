import { describe, expect, it } from "vitest";
import { runRemoveExtraSpaces } from "@/tools/logic/remove-extra-spaces";

describe("remove-extra-spaces", () => {
  it("transforms text", () => {
    const result = runRemoveExtraSpaces({ text: "text   with   spaces" });
    expect(result.result).toBe("text with spaces");
  });
});
