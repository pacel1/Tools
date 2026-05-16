import { describe, expect, it } from "vitest";
import { sanitizeVisibleText, toAscii } from "../../../scripts/generate-category-content";

describe("category content generation helpers", () => {
  it("transliterates common non-ASCII characters before validation", () => {
    expect(toAscii("Dobierz spójna stylistyke")).toBe(
      "Dobierz spojna stylistyke"
    );
    expect(toAscii("Farbwähler")).toBe("Farbwaehler");
    expect(toAscii("l’outil — prêt")).toBe("l'outil - pret");
  });

  it("sanitizes nested generated content without changing structure", () => {
    const value = sanitizeVisibleText({
      title: "spójna paleta",
      faq: [{ question: "Farbwähler?", answer: "prêt" }]
    });

    expect(value).toEqual({
      title: "spojna paleta",
      faq: [{ question: "Farbwaehler?", answer: "pret" }]
    });
  });
});
