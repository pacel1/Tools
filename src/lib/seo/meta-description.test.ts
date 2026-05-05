import { describe, expect, it } from "vitest";
import {
  maxMetaDescriptionLength,
  minMetaDescriptionLength,
  normalizeMetaDescription
} from "@/lib/seo/meta-description";

function lengthOf(value: string) {
  return Array.from(value).length;
}

describe("normalizeMetaDescription", () => {
  it("keeps valid descriptions unchanged after whitespace cleanup", () => {
    expect(
      normalizeMetaDescription("  Fast online tools for everyday conversion tasks.  ")
    ).toBe("Fast online tools for everyday conversion tasks.");
  });

  it("shortens long descriptions to the Bing-supported range", () => {
    const description = normalizeMetaDescription(
      "Use free online converters, calculators, generators and utility tools with instant results. Find fast answers for everyday tasks, work, study and technical problems in one place."
    );

    expect(lengthOf(description)).toBeLessThanOrEqual(maxMetaDescriptionLength);
    expect(lengthOf(description)).toBeGreaterThanOrEqual(
      minMetaDescriptionLength
    );
  });

  it("expands descriptions that are too short", () => {
    const description = normalizeMetaDescription("Tools", "Fast calculators");

    expect(lengthOf(description)).toBeGreaterThanOrEqual(
      minMetaDescriptionLength
    );
  });
});
