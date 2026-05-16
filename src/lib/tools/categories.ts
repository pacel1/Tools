import {
  toolCategories,
  type Locale,
  type ToolCategory
} from "@/lib/constants";
import { toolContent } from "@/lib/tools/tool-content.generated";
import { toolDefinitions } from "@/lib/tools/tool-registry.generated";
import { hasIndexableCategoryHubContent } from "@/lib/tools/discovery";
import type { ToolLocaleContent } from "@/lib/tools/types";

export const minimumIndexableCategoryToolCount = 3;

export function getActiveCategories(locale: Locale): ToolCategory[] {
  const localizedContent = (toolContent[locale] ?? {}) as Record<
    string,
    ToolLocaleContent | undefined
  >;

  return toolCategories.filter((category) =>
    toolDefinitions.some(
      (definition) =>
        definition.category === category && localizedContent[definition.id]
    )
  );
}

export function getIndexableCategories(locale: Locale): ToolCategory[] {
  return getActiveCategories(locale).filter((category) => {
    const hasHubContent = hasIndexableCategoryHubContent(locale, category);
    const toolCount = toolDefinitions.filter(
      (definition) =>
        definition.category === category &&
        definition.supportedLocales.includes(locale) &&
        ((toolContent[locale] ?? {}) as Record<string, ToolLocaleContent | undefined>)[
          definition.id
        ]
    ).length;

    return hasHubContent && toolCount >= minimumIndexableCategoryToolCount;
  });
}
