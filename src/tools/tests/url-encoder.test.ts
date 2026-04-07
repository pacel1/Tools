import { describe, expect, it } from "vitest";
import { runUrlEncoder } from "@/tools/logic/url-encoder";

describe("url-encoder", () => {
  it("transforms text", () => {
    const result = runUrlEncoder({ text: "hello world?x=1&y=2" });
    expect(result.result).toBe("hello%20world%3Fx%3D1%26y%3D2");
  });
});
