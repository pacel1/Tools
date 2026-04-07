import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryCatalog } from "@/data/categories/catalog";
import { ToolCard } from "@/components/marketing/tool-card";
import { buildCategoryAlternates } from "@/lib/seo/tool-metadata";
import {
  locales,
  toolCategories,
  type Locale,
  type ToolCategory
} from "@/lib/constants";
import { getSiteName } from "@/lib/env";
import { getToolsByCategory } from "@/lib/tools/registry";
import { getSiteUrl } from "@/lib/env";

const categoryPageLabels = {
  en: { collection: "Collection", empty: "This category is ready for generated tools. Run" },
  pl: { collection: "Kolekcja", empty: "Ta kategoria jest gotowa na generowane narzędzia. Uruchom" },
  es: { collection: "Colección", empty: "Esta categoría está lista para herramientas generadas. Ejecuta" },
  de: { collection: "Sammlung", empty: "Diese Kategorie ist bereit für generierte Tools. Führe" },
  fr: { collection: "Collection", empty: "Cette catégorie est prête pour des outils générés. Lance" }
} as const;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    toolCategories.map((category) => ({ locale, category }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; category: ToolCategory }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const meta = categoryCatalog[category];

  if (!meta) {
    return {};
  }

  return {
    title: `${meta.label[locale]} | ${getSiteName()}`,
    description: meta.description[locale],
    alternates: {
      canonical: `${getSiteUrl()}/${locale}/${category}`,
      ...buildCategoryAlternates(category)
    }
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ locale: Locale; category: ToolCategory }>;
}) {
  const { locale, category } = await params;
  const meta = categoryCatalog[category];

  if (!meta) {
    notFound();
  }

  const labels = categoryPageLabels[locale];

  const tools = getToolsByCategory(locale, category).map(({ definition, content }) => ({
    id: definition.id,
    href: `/${locale}/${definition.category}/${content.slug}`,
    title: content.title,
    shortDescription: content.shortDescription,
    category: definition.category,
    seoPriority: definition.seoPriority
  }));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16">
      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
          {labels.collection}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {meta.label[locale]}
        </h1>
        <p className="mt-4 text-lg leading-8 text-white/70">
          {meta.description[locale]}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.length > 0 ? (
          tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
        ) : (
          <div className="rounded-[28px] border border-dashed border-white/15 bg-white/5 p-8 text-white/65">
            {labels.empty} <code>pnpm add-tool</code>.
          </div>
        )}
      </section>
    </div>
  );
}
