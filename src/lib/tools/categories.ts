import {
  toolCategories,
  type Locale,
  type ToolCategory
} from "@/lib/constants";
import { toolContent } from "@/lib/tools/tool-content.generated";
import { toolDefinitions } from "@/lib/tools/tool-registry.generated";
import type { ToolLocaleContent } from "@/lib/tools/types";

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
