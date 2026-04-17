import { describe, expect, it } from "vitest";
import { buildLanguageAlternates } from "@/lib/seo/alternates";

describe("buildLanguageAlternates", () => {
  it("includes locale alternates and x-default", () => {
    const alternates = buildLanguageAlternates((locale) => `/${locale}`);

    expect(alternates.languages.en).toBe("http://localhost:3000/en");
    expect(alternates.languages.pl).toBe("http://localhost:3000/pl");
    expect(alternates.languages["x-default"]).toBe(
      "http://localhost:3000/en"
    );
  });

  it("skips locales without a matching page", () => {
    const alternates = buildLanguageAlternates((locale) =>
      locale === "en" ? "/en/only" : null
    );

    expect(alternates.languages.en).toBe("http://localhost:3000/en/only");
    expect(alternates.languages.pl).toBeUndefined();
    expect(alternates.languages["x-default"]).toBe(
      "http://localhost:3000/en/only"
    );
  });
});
