import type { Locale, ToolCategory } from "@/lib/constants";
import { getIntentRelatedIds } from "@/lib/tools/discovery";
import { toolContent } from "@/lib/tools/tool-content.generated";
import { toolDefinitions } from "@/lib/tools/tool-registry.generated";
import type { ToolLocaleContent } from "@/lib/tools/types";

export type ToolLink = {
  id: string;
  href: string;
  title: string;
  shortDescription: string;
  category: ToolCategory;
  seoPriority: number;
};

export function buildToolHref(
  locale: Locale,
  category: ToolCategory,
  slug: string
): string {
  return `/${locale}/${category}/${slug}`;
}

export function getToolLinksByLocale(locale: Locale): ToolLink[] {
  const localizedContent = toolContent[locale] as Record<
    string,
    ToolLocaleContent | undefined
  >;

  return toolDefinitions
    .map((definition) => {
      const content = localizedContent[definition.id];

      if (!content) {
        return null;
      }

      return {
        id: definition.id,
        href: buildToolHref(locale, definition.category, content.slug),
        title: content.title,
        shortDescription: content.shortDescription,
        category: definition.category,
        seoPriority: definition.seoPriority
      } satisfies ToolLink;
    })
    .filter((value): value is ToolLink => value !== null)
    .sort((left, right) => right.seoPriority - left.seoPriority);
}

export function getSuggestedLinks(
  locale: Locale,
  currentToolId: string,
  limit = 8
): ToolLink[] {
  const localizedContent = toolContent[locale] as Record<
    string,
    ToolLocaleContent | undefined
  >;
  const current = toolDefinitions.find((item) => item.id === currentToolId);

  if (!current) {
    return [];
  }

  const intentPreferred = getIntentRelatedIds(currentToolId)
    .map((id) => toolDefinitions.find((item) => item.id === id))
    .filter((value): value is (typeof toolDefinitions)[number] => Boolean(value));

  const preferred = current.relatedTools
    .map((id) => toolDefinitions.find((item) => item.id === id))
    .filter((value): value is (typeof toolDefinitions)[number] => Boolean(value));

  const candidates = [...intentPreferred, ...preferred].concat(
    toolDefinitions.filter(
      (item) =>
        item.id !== currentToolId &&
        item.category === current.category &&
        !intentPreferred.some((preferredItem) => preferredItem.id === item.id) &&
        !preferred.some((preferredItem) => preferredItem.id === item.id)
    )
  );

  return candidates
    .map((definition) => {
      const content = localizedContent[definition.id];

      if (!content) {
        return null;
      }

      return {
        id: definition.id,
        href: buildToolHref(locale, definition.category, content.slug),
        title: content.title,
        shortDescription: content.shortDescription,
        category: definition.category,
        seoPriority: definition.seoPriority
      } satisfies ToolLink;
    })
    .filter((value): value is ToolLink => value !== null)
    .filter(
      (value, index, all) => all.findIndex((candidate) => candidate.id === value.id) === index
    )
    .slice(0, limit);
}
