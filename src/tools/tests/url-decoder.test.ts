import { describe, expect, it } from "vitest";
import { runUrlDecoder } from "@/tools/logic/url-decoder";

describe("url-decoder", () => {
  it("transforms text", () => {
    const result = runUrlDecoder({ text: "hello%20world%3Fx%3D1%26y%3D2" });
    expect(result.result).toBe("hello world?x=1&y=2");
  });
});
