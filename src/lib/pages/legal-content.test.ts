import { describe, expect, it } from "vitest";
import {
  buildLegalPageHref,
  buildLegalPageMetadata,
  getAllLegalPageParams,
  getLegalPageContent
} from "@/lib/pages/legal-content";

describe("legal page content", () => {
  it("loads localized JSON content", async () => {
    const page = await getLegalPageContent("en", "privacy");

    expect(page.heading).toContain("Privacy");
    expect(page.sections.length).toBeGreaterThan(1);
    expect(page.keywords).toContain("privacy policy");
  });

  it("keeps noindex legal page metadata canonical-only without hreflang", async () => {
    const metadata = await buildLegalPageMetadata("pl", "cookies");

    expect(metadata.title).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/pl/cookies"
    );
    expect(metadata.alternates?.languages).toBeUndefined();
    expect(metadata.robots).toEqual({
      index: false,
      follow: true
    });
  });

  it("keeps unique utility pages like about indexable", async () => {
    const metadata = await buildLegalPageMetadata("en", "about");

    expect(metadata.robots).toEqual({
      index: true,
      follow: true
    });
    expect(metadata.alternates?.languages?.pl).toBe(
      "http://localhost:3000/pl/o-nas"
    );
    expect(metadata.alternates?.languages?.["x-default"]).toBe(
      "http://localhost:3000/en/about"
    );
  });

  it("returns one static param per locale", () => {
    expect(getAllLegalPageParams()).toEqual([
      { locale: "en" },
      { locale: "pl" },
      { locale: "es" },
      { locale: "de" },
      { locale: "fr" }
    ]);
    expect(buildLegalPageHref("fr", "contact")).toBe("/fr/contact");
  });
});
