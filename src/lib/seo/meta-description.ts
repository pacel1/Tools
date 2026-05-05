import { siteConfig } from "@/lib/constants";

export const minMetaDescriptionLength = 25;
export const maxMetaDescriptionLength = 160;

const trailingPunctuationPattern = /[\s,;:.-]+$/;

function cleanMetaDescription(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getTextLength(value: string) {
  return Array.from(value).length;
}

function sliceText(value: string, length: number) {
  return Array.from(value).slice(0, length).join("");
}

function trimMetaDescription(value: string) {
  if (getTextLength(value) <= maxMetaDescriptionLength) {
    return value;
  }

  const suffix = "...";
  const sliceLimit = maxMetaDescriptionLength - suffix.length;
  const sliced = sliceText(value, sliceLimit);
  const wordBreak = sliced.lastIndexOf(" ");
  const candidate =
    wordBreak >= minMetaDescriptionLength ? sliced.slice(0, wordBreak) : sliced;

  return `${candidate.replace(trailingPunctuationPattern, "")}${suffix}`;
}

export function normalizeMetaDescription(
  description: string | null | undefined,
  fallback: string = siteConfig.description
) {
  const fallbackText = cleanMetaDescription(fallback);
  let value = cleanMetaDescription(description ?? "") || fallbackText;

  if (getTextLength(value) < minMetaDescriptionLength) {
    value =
      fallbackText && fallbackText !== value
        ? cleanMetaDescription(`${value} - ${fallbackText}`)
        : siteConfig.description;
  }

  if (getTextLength(value) < minMetaDescriptionLength) {
    value = siteConfig.description;
  }

  return trimMetaDescription(value);
}
