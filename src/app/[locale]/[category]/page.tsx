import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolCard } from "@/components/marketing/tool-card";
import { categoryCatalog } from "@/data/categories/catalog";
import { locales, type Locale, type ToolCategory } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import {
  buildCategoryCanonical,
  buildCategoryStructuredData
} from "@/lib/seo/category-hub";
import { normalizeMetaDescription } from "@/lib/seo/meta-description";
import { normalizeMetaTitle } from "@/lib/seo/meta-title";
import { buildSocialMetadata } from "@/lib/seo/social";
import { buildCategoryAlternates } from "@/lib/seo/tool-metadata";
import { getActiveCategories } from "@/lib/tools/categories";
import {
  getCategoryHubContent,
  type CategoryHubContent
} from "@/lib/tools/discovery";
import { getToolsByCategory } from "@/lib/tools/registry";

const categoryPageLabels = {
  en: {
    collection: "Collection",
    empty: "This category is ready for generated tools. Run",
    featured: "Featured searches",
    tasks: "Popular tasks",
    choose: "How to choose a tool",
    useCases: "When this hub helps",
    faq: "FAQ",
    allTools: "All tools"
  },
  pl: {
    collection: "Kolekcja",
    empty: "Ta kategoria jest gotowa na generowane narzedzia. Uruchom",
    featured: "Wazne intencje",
    tasks: "Popularne zadania",
    choose: "Jak wybrac narzedzie",
    useCases: "Kiedy ten hub pomaga",
    faq: "FAQ",
    allTools: "Wszystkie narzedzia"
  },
  es: {
    collection: "Coleccion",
    empty: "Esta categoria esta lista para herramientas generadas. Ejecuta",
    featured: "Busquedas destacadas",
    tasks: "Tareas populares",
    choose: "Como elegir una herramienta",
    useCases: "Cuando ayuda este hub",
    faq: "FAQ",
    allTools: "Todas las herramientas"
  },
  de: {
    collection: "Sammlung",
    empty: "Diese Kategorie ist bereit fuer generierte Tools. Fuehre",
    featured: "Wichtige Suchintentionen",
    tasks: "Beliebte Aufgaben",
    choose: "So waehlst du ein Tool",
    useCases: "Wann dieser Hub hilft",
    faq: "FAQ",
    allTools: "Alle Tools"
  },
  fr: {
    collection: "Collection",
    empty: "Cette categorie est prete pour des outils generes. Lance",
    featured: "Intentions mises en avant",
    tasks: "Taches populaires",
    choose: "Comment choisir un outil",
    useCases: "Quand ce hub aide",
    faq: "FAQ",
    allTools: "Tous les outils"
  }
} as const;

type CategoryToolLink = {
  id: string;
  href: string;
  title: string;
  shortDescription: string;
  category: ToolCategory;
  seoPriority: number;
};

type CategoryPageContent = CategoryHubContent & {
  source: "manual" | "fallback";
};

const fallbackCopy = {
  en: {
    introPrefix: "Use this hub to compare related tools before opening the exact workflow you need.",
    workflowPrefix: "Start here when you need to work with",
    useCaseTitle: "Compare related workflows",
    useCaseDescription:
      "Scan the category before choosing a specific converter, calculator or utility.",
    faqQuestion: "Why use this category hub?",
    faqAnswer:
      "It groups related tools, explains common workflows and links directly to the most useful pages."
  },
  pl: {
    introPrefix:
      "Uzyj tego huba, zeby porownac powiazane narzedzia przed przejsciem do konkretnego zadania.",
    workflowPrefix: "Zacznij tutaj, gdy chcesz pracowac z",
    useCaseTitle: "Porownanie powiazanych workflowow",
    useCaseDescription:
      "Przejrzyj kategorie przed wyborem konkretnego konwertera, kalkulatora albo narzedzia.",
    faqQuestion: "Po co korzystac z huba kategorii?",
    faqAnswer:
      "Hub grupuje powiazane narzedzia, opisuje typowe zadania i prowadzi bezposrednio do najwazniejszych stron."
  },
  es: {
    introPrefix:
      "Usa este hub para comparar herramientas relacionadas antes de abrir el flujo exacto que necesitas.",
    workflowPrefix: "Empieza aqui cuando necesites trabajar con",
    useCaseTitle: "Comparar flujos relacionados",
    useCaseDescription:
      "Revisa la categoria antes de elegir un conversor, calculadora o utilidad concreta.",
    faqQuestion: "Por que usar este hub de categoria?",
    faqAnswer:
      "Agrupa herramientas relacionadas, explica tareas comunes y enlaza con las paginas mas utiles."
  },
  de: {
    introPrefix:
      "Nutze diesen Hub, um verwandte Tools zu vergleichen, bevor du den passenden Workflow oeffnest.",
    workflowPrefix: "Starte hier, wenn du arbeiten willst mit",
    useCaseTitle: "Verwandte Workflows vergleichen",
    useCaseDescription:
      "Pruefe die Kategorie, bevor du einen konkreten Umrechner, Rechner oder Helfer auswaehlst.",
    faqQuestion: "Warum diesen Kategorie-Hub nutzen?",
    faqAnswer:
      "Er gruppiert verwandte Tools, erklaert typische Aufgaben und verlinkt direkt auf wichtige Seiten."
  },
  fr: {
    introPrefix:
      "Utilisez ce hub pour comparer les outils lies avant d'ouvrir le flux exact dont vous avez besoin.",
    workflowPrefix: "Commencez ici lorsque vous devez travailler avec",
    useCaseTitle: "Comparer des workflows lies",
    useCaseDescription:
      "Parcourez la categorie avant de choisir un convertisseur, calculateur ou utilitaire precis.",
    faqQuestion: "Pourquoi utiliser ce hub de categorie ?",
    faqAnswer:
      "Il regroupe les outils lies, explique les taches courantes et pointe vers les pages les plus utiles."
  }
} as const;

const metaDescriptionFillers = {
  en: {
    base: "Includes practical browser tools for quick formatting, conversion and everyday workflows.",
    tasks: "Key tasks"
  },
  pl: {
    base: "Obejmuje praktyczne narzedzia online do szybkiego formatowania, konwersji i codziennej pracy.",
    tasks: "Wazne zadania"
  },
  es: {
    base: "Incluye herramientas online para formatear, convertir y resolver tareas rapidas en el navegador.",
    tasks: "Tareas clave"
  },
  de: {
    base: "Enthaelt praktische Browser-Tools fuer Formatierung, Umrechnung und schnelle Alltagsaufgaben.",
    tasks: "Wichtige Aufgaben"
  },
  fr: {
    base: "Inclut des outils en ligne pour formater, convertir et traiter rapidement les taches courantes.",
    tasks: "Taches cles"
  }
} as const;

function buildToolLinks(locale: Locale, category: ToolCategory) {
  return getToolsByCategory(locale, category).map(({ definition, content }) => ({
    id: definition.id,
    href: `/${locale}/${definition.category}/${content.slug}`,
    title: content.title,
    shortDescription: content.shortDescription,
    category: definition.category,
    seoPriority: definition.seoPriority
  }));
}

function getTextLength(value: string) {
  return Array.from(value).length;
}

function buildCategoryMetaDescription({
  locale,
  description,
  featuredSearches
}: {
  locale: Locale;
  description: string;
  featuredSearches: string[];
}) {
  if (getTextLength(description) >= 120) {
    return description;
  }

  const searches = featuredSearches.slice(0, 2).join(", ");
  const filler = metaDescriptionFillers[locale];
  const extension = searches
    ? `${filler.base} ${filler.tasks}: ${searches}.`
    : filler.base;

  return `${description} ${extension}`;
}

function buildFallbackCategoryHubContent({
  locale,
  category,
  tools
}: {
  locale: Locale;
  category: ToolCategory;
  tools: CategoryToolLink[];
}): CategoryPageContent {
  const meta = categoryCatalog[category];
  const copy = fallbackCopy[locale];
  const topTools = tools.slice(0, 4);
  const fallbackTitle = meta.label[locale];
  const workflowTools = topTools.slice(0, 3);

  return {
    source: "fallback",
    eyebrow: categoryPageLabels[locale].collection,
    title: fallbackTitle,
    description: meta.description[locale],
    intro: `${copy.introPrefix} ${meta.description[locale]}`,
    featuredSearches: topTools.map((tool) => tool.title),
    featuredToolIds: topTools.map((tool) => tool.id),
    workflows: workflowTools.map((tool) => ({
      title: tool.title,
      description: `${copy.workflowPrefix} ${tool.shortDescription.toLowerCase()}`,
      toolId: tool.id
    })),
    useCases: [
      {
        title: copy.useCaseTitle,
        description: copy.useCaseDescription
      },
      {
        title: fallbackTitle,
        description: meta.description[locale]
      }
    ],
    faq: [
      {
        question: copy.faqQuestion,
        answer: copy.faqAnswer
      },
      {
        question: `${fallbackTitle}: ${categoryPageLabels[locale].choose.toLowerCase()}?`,
        answer:
          workflowTools.length > 0
            ? `${workflowTools
                .map((tool) => tool.title)
                .join(", ")} sa dobrymi punktami startowymi dla tej kategorii.`
            : copy.faqAnswer
      }
    ]
  };
}

function getCategoryPageContent({
  locale,
  category,
  tools
}: {
  locale: Locale;
  category: ToolCategory;
  tools: CategoryToolLink[];
}): CategoryPageContent | null {
  const hub = getCategoryHubContent(locale, category);

  if (hub) {
    return { ...hub, source: "manual" };
  }

  if (tools.length === 0) {
    return null;
  }

  return buildFallbackCategoryHubContent({ locale, category, tools });
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getActiveCategories(locale).map((category) => ({ locale, category }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; category: ToolCategory }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const meta = categoryCatalog[category];
  const tools = buildToolLinks(locale, category);
  const hub = getCategoryPageContent({ locale, category, tools });

  if (!meta || (!hub && tools.length === 0)) {
    return {};
  }

  const title = normalizeMetaTitle(hub?.title ?? meta.label[locale]);
  const description = normalizeMetaDescription(
    buildCategoryMetaDescription({
      locale,
      description: hub?.description ?? meta.description[locale],
      featuredSearches: hub?.featuredSearches ?? []
    }),
    title
  );
  const canonical = buildCategoryCanonical(locale, category);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical,
      ...buildCategoryAlternates(category)
    },
    ...buildSocialMetadata({ title, description, url: canonical, locale })
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ locale: Locale; category: ToolCategory }>;
}) {
  const { locale, category } = await params;
  const meta = categoryCatalog[category];
  const tools = buildToolLinks(locale, category);
  const hub = getCategoryPageContent({ locale, category, tools });

  if (!meta || !hub) {
    notFound();
  }

  const labels = categoryPageLabels[locale];
  const featuredTools = hub
    ? hub.featuredToolIds
        .map((toolId) => tools.find((tool) => tool.id === toolId))
        .filter((tool): tool is (typeof tools)[number] => Boolean(tool))
    : [];
  const workflowItems = hub.workflows.flatMap((workflow) => {
    const tool = tools.find((item) => item.id === workflow.toolId);

    return tool ? [{ ...workflow, tool }] : [];
  });
  const canonical = buildCategoryCanonical(locale, category);
  const structuredData = buildCategoryStructuredData({
    locale,
    title: hub.title,
    description: hub.description,
    canonical,
    tools,
    faq: hub.faq
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16">
      {structuredData.map((item, index) => (
        <script
          key={`category-schema-${locale}-${category}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <section className="max-w-3xl">
        <p className="text-sm tracking-[0.28em] text-cyan-200/70 uppercase">
          {hub.eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {hub.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-white/70">
          {hub.description}
        </p>
        <p className="mt-5 text-base leading-8 text-white/65">{hub.intro}</p>
        {hub.featuredSearches.length ? (
          <p className="mt-5 text-base leading-8 text-white/70">
            <strong className="font-semibold text-white">
              {labels.featured}:
            </strong>{" "}
            {hub.featuredSearches.slice(0, 3).join(", ")}.
          </p>
        ) : null}
        <ul className="mt-6 flex flex-wrap gap-3">
          {hub.featuredSearches.map((item) => (
            <li
              key={item}
              className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-50/90"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {featuredTools.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {labels.featured}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} titleAs="p" />
            ))}
          </div>
        </section>
      ) : null}

      {workflowItems.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {labels.tasks}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {workflowItems.map((workflow) => (
              <Link
                key={workflow.title}
                href={workflow.tool.href as Route}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/8"
              >
                <p className="text-sm font-semibold text-cyan-100">
                  {workflow.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  {workflow.description}
                </p>
                <p className="mt-4 text-sm text-cyan-200">
                  {workflow.tool.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {hub.useCases.length ? (
        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm tracking-[0.24em] text-cyan-200/70 uppercase">
              {labels.choose}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {labels.useCases}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {hub.useCases.map((item) => (
              <div
                key={item.title}
                className="border-l border-cyan-300/30 pl-5"
              >
                <p className="text-lg font-semibold text-white">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <h2 className="sr-only">{labels.allTools}</h2>
        {tools.length > 0 ? (
          tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} titleAs="p" />
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-white/15 bg-white/5 p-8 text-white/65">
            {labels.empty} <code>pnpm add-tool</code>.
          </div>
        )}
      </section>

      {hub.faq.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {labels.faq}
          </h2>
          <div className="space-y-4">
            {hub.faq.map((item) => (
              <details
                key={item.question}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5"
              >
                <summary className="cursor-pointer text-lg font-semibold">
                  {item.question}
                </summary>
                <p className="mt-4 leading-7 text-white/72">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
