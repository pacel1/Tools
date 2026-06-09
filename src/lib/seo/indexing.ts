import type { Locale } from "@/lib/constants";
import { toolContent } from "@/lib/tools/tool-content.generated";
import { toolDefinitions } from "@/lib/tools/tool-registry.generated";
import type { ToolLocaleContent } from "@/lib/tools/types";

/**
 * === POLITYKA INDEKSOWANIA (SEO) ===
 *
 * Świeża domena (kwiecień 2026) z setkami generowanych stron narzędzi dostała
 * od Google werdykt "Crawled - currently not indexed". To NIE jest blokada
 * techniczna — Google przeczytał strony i uznał, że pula jest zbyt duża /
 * zbyt szablonowa, żeby ją w całości indeksować na tak młodej domenie.
 *
 * Lekarstwem nie jest więcej stron ani kolejne poprawki schema/canonical, tylko
 * WĘŻSZA, wysokiej jakości pula. Ten moduł jest jedynym źródłem prawdy o tym,
 * które strony narzędzi trafiają do indeksu i do sitemapy. Reszta dostaje
 * `robots: { index: false, follow: true }` — Googlebot nadal chodzi po linkach
 * (przekazuje link equity), ale nie indeksuje.
 *
 * RAMPA: w miarę jak bieżąca pula wchodzi do indeksu i zdobywa ruch,
 * zwiększaj `maxIndexableTools` (albo dorzucaj id do `alwaysIndexToolIds`),
 * aż docelowo można otworzyć cały katalog. Zmiana wartości tutaj automatycznie
 * przeplata się przez metadata stron narzędzi oraz sitemap.
 *
 * Pula liczona jest po `seoPriority` z definicji narzędzi (to autorski sygnał
 * priorytetu), więc nie trzeba ręcznie wypisywać 100+ slugów. Wszystkie
 * wspierane języki wybranych narzędzi pozostają indeksowane — zawężamy katalog
 * narzędzi, nie strategię wielojęzyczną.
 */

// Maksymalna liczba narzędzi w puli indeksowanej, wybieranych wg najwyższego
// seoPriority. Podnoś etapami w miarę wchodzenia stron do indeksu.
export const maxIndexableTools = 40;

// Narzędzia zawsze indeksowane — niezależnie od limitu (np. flagowe strony).
export const alwaysIndexToolIds: readonly string[] = [];

// Narzędzia nigdy nieindeksowane — np. słabej jakości lub duplikaty.
export const neverIndexToolIds: readonly string[] = [];

const neverSet = new Set(neverIndexToolIds);
const alwaysSet = new Set(alwaysIndexToolIds);

/** Pula narzędzi (po id) dopuszczonych do indeksu. */
const indexableToolIdSet: ReadonlySet<string> = (() => {
  const selected = new Set<string>();

  for (const id of alwaysSet) {
    if (!neverSet.has(id)) {
      selected.add(id);
    }
  }

  const ranked = [...toolDefinitions]
    .filter((definition) => !neverSet.has(definition.id))
    .sort(
      (left, right) =>
        right.seoPriority - left.seoPriority || left.id.localeCompare(right.id)
    );

  for (const definition of ranked) {
    if (selected.size >= maxIndexableTools) {
      break;
    }
    selected.add(definition.id);
  }

  return selected;
})();

function hasLocalizedContent(locale: Locale, toolId: string): boolean {
  const localized = (toolContent[locale] ?? {}) as Record<
    string,
    ToolLocaleContent | undefined
  >;

  return Boolean(localized[toolId]);
}

/** Czy narzędzie (po id) należy do puli indeksowanej. */
export function isToolIdIndexable(toolId: string): boolean {
  return indexableToolIdSet.has(toolId);
}

/** Czy konkretna strona narzędzia (id + locale) powinna być indeksowana. */
export function isIndexableToolPage(toolId: string, locale: Locale): boolean {
  if (!indexableToolIdSet.has(toolId)) {
    return false;
  }

  const definition = toolDefinitions.find((item) => item.id === toolId);

  if (!definition || !definition.supportedLocales.includes(locale)) {
    return false;
  }

  return hasLocalizedContent(locale, toolId);
}

/** Liczność puli — przydatne w testach i diagnostyce. */
export function getIndexableToolCount(): number {
  return indexableToolIdSet.size;
}
