import { siteConfig } from "@/lib/constants";

export const maxMetaTitleLength = 60;
export const minMetaTitleLength = 30;

const trailingPunctuationPattern = /[\s,;:.-]+$/;

function cleanMetaTitle(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getTextLength(value: string) {
  return Array.from(value).length;
}

function sliceText(value: string, length: number) {
  return Array.from(value).slice(0, length).join("");
}

function trimMetaTitle(value: string, maxLength: number) {
  if (getTextLength(value) <= maxLength) {
    return value;
  }

  const sliced = sliceText(value, maxLength);
  const wordBreak = sliced.lastIndexOf(" ");
  const candidate = wordBreak >= 20 ? sliced.slice(0, wordBreak) : sliced;

  return candidate.replace(trailingPunctuationPattern, "");
}

export function getTitledPageSuffix() {
  return ` | ${siteConfig.name}`;
}

export function normalizeMetaTitle(
  title: string | null | undefined,
  options: { reserveSiteName?: boolean; fallback?: string } = {}
) {
  const reserveSiteName = options.reserveSiteName ?? true;
  const fallback = cleanMetaTitle(options.fallback ?? siteConfig.name);
  const suffixLength = reserveSiteName ? getTextLength(getTitledPageSuffix()) : 0;
  const maxLength = Math.max(20, maxMetaTitleLength - suffixLength);
  const value = cleanMetaTitle(title ?? "") || fallback;
  const expanded =
    getTextLength(value) < minMetaTitleLength && fallback && fallback !== value
      ? cleanMetaTitle(`${value} - ${fallback}`)
      : value;

  return trimMetaTitle(expanded, maxLength);
}

export function buildTitledPageTitle(title: string) {
  return `${title}${getTitledPageSuffix()}`;
}
