import { describe, expect, it } from "vitest";
import {
  buildTitledPageTitle,
  maxMetaTitleLength,
  normalizeMetaTitle
} from "@/lib/seo/meta-title";

function lengthOf(value: string) {
  return Array.from(value).length;
}

describe("normalizeMetaTitle", () => {
  it("reserves room for the site name suffix used by the layout template", () => {
    const title = normalizeMetaTitle(
      "Construction calculators for material estimates and planning"
    );

    expect(lengthOf(buildTitledPageTitle(title))).toBeLessThanOrEqual(
      maxMetaTitleLength
    );
  });

  it("keeps absolute legal titles within the title limit", () => {
    const title = normalizeMetaTitle(
      "ConvertBase.app privacy policy and personal data handling details",
      { reserveSiteName: false }
    );

    expect(lengthOf(title)).toBeLessThanOrEqual(maxMetaTitleLength);
  });
});
