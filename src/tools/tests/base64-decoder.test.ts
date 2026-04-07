import { describe, expect, it } from "vitest";
import { runBase64Decoder } from "@/tools/logic/base64-decoder";

describe("base64-decoder", () => {
  it("transforms text", () => {
    const result = runBase64Decoder({ text: "aGVsbG8gd29ybGQ=" });
    expect(result.result).toBe("hello world");
  });
});
