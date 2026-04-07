import { describe, expect, it } from "vitest";
import { runBase64Encoder } from "@/tools/logic/base64-encoder";

describe("base64-encoder", () => {
  it("transforms text", () => {
    const result = runBase64Encoder({ text: "hello world" });
    expect(result.result).toBe("aGVsbG8gd29ybGQ=");
  });
});
