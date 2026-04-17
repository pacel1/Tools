import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolCard } from "@/components/marketing/tool-card";
import { categoryCatalog } from "@/data/categories/catalog";
import { locales, toolCategories, type Locale, type ToolCategory } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import { buildCategoryAlternates } from "@/lib/seo/tool-metadata";
import { getCategoryHubContent } from "@/lib/tools/discovery";
import { getToolsByCategory } from "@/lib/tools/registry";

const categoryPageLabels = {
  en: {
    collection: "Collection",
    empty: "This category is ready for generated tools. Run",
    featured: "Featured searches"
  },
  pl: {
    collection: "Kolekcja",
    empty: "Ta kategoria jest gotowa na generowane narzedzia. Uruchom",
    featured: "Wazne intencje"
  },
  es: {
    collection: "Coleccion",
    empty: "Esta categoria esta lista para herramientas generadas. Ejecuta",
    featured: "Busquedas destacadas"
  },
  de: {
    collection: "Sammlung",
    empty: "Diese Kategorie ist bereit fuer generierte Tools. Fuehre",
    featured: "Wichtige Suchintentionen"
  },
  fr: {
    collection: "Collection",
    empty: "Cette categorie est prete pour des outils generes. Lance",
    featured: "Intentions mises en avant"
  }
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
  const hub = getCategoryHubContent(locale, category);

  if (!meta) {
    return {};
  }

  return {
    title: hub?.title ?? meta.label[locale],
    description: hub?.description ?? meta.description[locale],
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
  const hub = getCategoryHubContent(locale, category);

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
  const featuredTools = hub
    ? hub.featuredToolIds
        .map((toolId) => tools.find((tool) => tool.id === toolId))
        .filter((tool): tool is (typeof tools)[number] => Boolean(tool))
    : [];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16">
      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
          {hub?.eyebrow ?? labels.collection}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {hub?.title ?? meta.label[locale]}
        </h1>
        <p className="mt-4 text-lg leading-8 text-white/70">
          {hub?.description ?? meta.description[locale]}
        </p>
        {hub ? (
          <>
            <p className="mt-5 text-base leading-8 text-white/65">{hub.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {hub.featuredSearches.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-50/90"
                >
                  {item}
                </span>
              ))}
            </div>
          </>
        ) : null}
      </section>

      {featuredTools.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{labels.featured}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

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
