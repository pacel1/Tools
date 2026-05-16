import { describe, expect, it } from "vitest";
import { runRandomTokenGenerator } from "@/tools/logic/random-token-generator";

describe("random-token-generator", () => {
  it("creates base64url tokens with the requested length and count", () => {
    const result = runRandomTokenGenerator({
      length: 32,
      count: 3,
      format: "base64url",
      prefix: ""
    });

    expect(result.tokens).toHaveLength(3);
    expect(result.tokens.every((token) => token.length === 32)).toBe(true);
    expect(result.tokens.every((token) => /^[A-Za-z0-9_-]+$/.test(token))).toBe(true);
  });

  it("creates hex tokens and preserves the prefix outside the random length", () => {
    const result = runRandomTokenGenerator({
      length: 16,
      count: 1,
      format: "hex",
      prefix: "tok_"
    });

    expect(result.tokens[0]).toMatch(/^tok_[a-f0-9]{16}$/);
    expect(result.length).toBe(16);
  });
});
