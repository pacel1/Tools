import type { Locale, ToolCategory } from "@/lib/constants";
import { toolCategories } from "@/lib/constants";
import { getSuggestedLinks } from "@/lib/tools/internal-linking";
import { toolContent } from "@/lib/tools/tool-content.generated";
import { toolComponents } from "@/lib/tools/tool-runtime.generated";
import { toolDefinitions } from "@/lib/tools/tool-registry.generated";
import type {
  ToolDefinition,
  ToolLocaleContent,
  ToolPageModel
} from "@/lib/tools/types";

export function getAllToolDefinitions(): ToolDefinition[] {
  return [...toolDefinitions];
}

export function getDefinitionById(toolId: string): ToolDefinition | undefined {
  return toolDefinitions.find((item) => item.id === toolId);
}

export function getContentById(
  locale: Locale,
  toolId: string
): ToolLocaleContent | undefined {
  const localizedContent = toolContent[locale] as Record<
    string,
    ToolLocaleContent | undefined
  >;
  return localizedContent[toolId];
}

export function getToolPageModel(
  locale: Locale,
  category: ToolCategory,
  slug: string
): ToolPageModel | undefined {
  const localizedContent = toolContent[locale] as Record<
    string,
    ToolLocaleContent | undefined
  >;

  for (const candidate of toolDefinitions.filter((item) => item.category === category)) {
    const content = localizedContent[candidate.id];

    if (content?.slug === slug) {
      return {
        definition: candidate,
        content
      };
    }
  }

  return undefined;
}

export function getToolsForLocale(locale: Locale): ToolPageModel[] {
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

      return { definition, content } satisfies ToolPageModel;
    })
    .filter((value): value is ToolPageModel => value !== null)
    .sort((left, right) => right.definition.seoPriority - left.definition.seoPriority);
}

export function getToolsByCategory(
  locale: Locale,
  category: ToolCategory
): ToolPageModel[] {
  return getToolsForLocale(locale).filter(
    (tool) => tool.definition.category === category
  );
}

export function getAllToolPaths() {
  return toolDefinitions.flatMap((definition) =>
    definition.supportedLocales.flatMap((locale) => {
      const localizedContent = toolContent[locale] as Record<
        string,
        ToolLocaleContent | undefined
      >;
      const content = localizedContent[definition.id];

      if (!content) {
        return [];
      }

      return [
        {
          locale,
          category: definition.category,
          slug: content.slug
        }
      ];
    })
  );
}

export function getCategoryStats(locale: Locale) {
  return toolCategories.map((category) => ({
    category,
    tools: getToolsByCategory(locale, category)
  }));
}

export function getRelatedTools(locale: Locale, toolId: string) {
  return getSuggestedLinks(locale, toolId);
}

export function getToolComponent(componentName: keyof typeof toolComponents) {
  return toolComponents[componentName];
}
