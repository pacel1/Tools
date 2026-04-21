import enMessages from "@/messages/en.json";
import frMessages from "@/messages/fr.json";
import { describe, expect, it, vi } from "vitest";
import { buildHomePageMetadata } from "@/lib/pages/home-page-metadata";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace
  }: {
    locale: "en" | "fr";
    namespace: "common";
  }) => {
    const messages = {
      en: enMessages,
      fr: frMessages
    } as const;

    return (key: keyof (typeof enMessages.common | typeof frMessages.common)) =>
      messages[locale][namespace][key];
  }
}));

describe("locale homepage metadata", () => {
  it("builds canonical, hreflang, and localized metadata for non-default locales", async () => {
    const metadata = await buildHomePageMetadata("fr");

    expect(metadata.title).toBeTruthy();
    expect(String(metadata.title)).not.toContain(
      "Hundreds of useful online tools in one place"
    );
    expect(String(metadata.description)).not.toContain(
      "Use free online converters, calculators, generators and utility tools"
    );

    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/fr");
    expect(metadata.alternates?.languages?.en).toBe("http://localhost:3000/en");
    expect(metadata.alternates?.languages?.fr).toBe("http://localhost:3000/fr");
    expect(metadata.alternates?.languages?.["x-default"]).toBe(
      "http://localhost:3000/en"
    );
    expect(metadata.openGraph?.url).toBe("http://localhost:3000/fr");
  });
});
