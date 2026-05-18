import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ToolCard } from "@/components/marketing/tool-card";
import { categoryCatalog } from "@/data/categories/catalog";
import type { Locale, ToolCategory } from "@/lib/constants";
import { buildToolStructuredData } from "@/lib/seo/structured-data";
import { buildToolMetadata } from "@/lib/seo/tool-metadata";
import { getIntentHubLink } from "@/lib/tools/discovery";
import {
  DynamicToolComponent,
  type ToolComponentName
} from "@/lib/tools/tool-components.generated";
import {
  getAllToolPaths,
  getToolsByCategory,
  getRelatedTools,
  getToolPageModel
} from "@/lib/tools/registry";
import type { ToolUseCase } from "@/lib/tools/types";

const toolPageLabels = {
  en: {
    home: "Home",
    overview: "Overview",
    intro: "Quick answer",
    howItWorks: "How it works",
    useCases: "Use cases",
    examples: "Examples",
    faq: "FAQ",
    related: "Related tools",
    categoryTools: "Popular tools in this category",
    input: "Input",
    output: "Output"
  },
  pl: {
    home: "Start",
    overview: "Opis",
    intro: "Szybka odpowiedz",
    howItWorks: "Jak to dziala",
    useCases: "Zastosowania",
    examples: "Przyklady",
    faq: "FAQ",
    related: "Powiazane narzedzia",
    categoryTools: "Popularne narzedzia w kategorii",
    input: "Wejscie",
    output: "Wynik"
  },
  es: {
    home: "Inicio",
    overview: "Resumen",
    intro: "Respuesta rapida",
    howItWorks: "Como funciona",
    useCases: "Casos de uso",
    examples: "Ejemplos",
    faq: "FAQ",
    related: "Herramientas relacionadas",
    categoryTools: "Herramientas populares de la categoria",
    input: "Entrada",
    output: "Salida"
  },
  de: {
    home: "Start",
    overview: "Ueberblick",
    intro: "Schnelle Antwort",
    howItWorks: "So funktioniert es",
    useCases: "Anwendungsfaelle",
    examples: "Beispiele",
    faq: "FAQ",
    related: "Verwandte Tools",
    categoryTools: "Beliebte Tools in dieser Kategorie",
    input: "Eingabe",
    output: "Ausgabe"
  },
  fr: {
    home: "Accueil",
    overview: "Vue d'ensemble",
    intro: "Reponse rapide",
    howItWorks: "Comment ca marche",
    useCases: "Cas d'usage",
    examples: "Exemples",
    faq: "FAQ",
    related: "Outils associes",
    categoryTools: "Outils populaires dans cette categorie",
    input: "Entree",
    output: "Sortie"
  }
} as const;

const toolPageStrongIntro = {
  en: "Best for",
  pl: "Najlepsze do",
  es: "Ideal para",
  de: "Gut geeignet fuer",
  fr: "Ideal pour"
} as const;

function normalizeUseCase(item: string | ToolUseCase): ToolUseCase {
  if (typeof item === "string") {
    return {
      title: item,
      description: item
    };
  }

  return item;
}

export function generateStaticParams() {
  return getAllToolPaths();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; category: ToolCategory; slug: string }>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const model = getToolPageModel(locale, category, slug);

  if (!model) {
    return {};
  }

  return buildToolMetadata(model.definition.id, locale);
}

export default async function ToolPage({
  params
}: {
  params: Promise<{ locale: Locale; category: ToolCategory; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  const model = getToolPageModel(locale, category, slug);

  if (!model) {
    notFound();
  }

  const labels = toolPageLabels[locale];
  const toolComponentName = model.definition.componentName as ToolComponentName;
  const relatedTools = getRelatedTools(locale, model.definition.id);
  const categoryTools = getToolsByCategory(locale, category)
    .filter((tool) => tool.definition.id !== model.definition.id)
    .slice(0, 6)
    .map(({ definition, content }) => ({
      id: definition.id,
      href: `/${locale}/${definition.category}/${content.slug}`,
      title: content.title,
      shortDescription: content.shortDescription,
      category: definition.category,
      seoPriority: definition.seoPriority
    }));
  const intentHub = getIntentHubLink(locale, model.definition.id);
  const structuredData = buildToolStructuredData(locale, model);
  const useCases = model.content.useCases?.map(normalizeUseCase) ?? [];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16">
      {structuredData.map((item, index) => (
        <script
          key={`${model.definition.id}-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <Breadcrumbs
        items={[
          { href: `/${locale}`, label: labels.home },
          {
            href: `/${locale}/${model.definition.category}`,
            label: categoryCatalog[model.definition.category].label[locale]
          },
          {
            href: `/${locale}/${model.definition.category}/${model.content.slug}`,
            label: model.content.title
          }
        ]}
      />

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
            {categoryCatalog[category].label[locale]}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {model.content.h1}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/70">
            {model.content.shortDescription}
          </p>
          <p className="max-w-2xl text-base leading-8 text-white/70">
            <strong className="font-semibold text-white">
              {toolPageStrongIntro[locale]}:
            </strong>{" "}
            {useCases
              .slice(0, 2)
              .map((item) => item.title)
              .join(", ") ||
              model.content.shortDescription}
          </p>
          {model.content.intro ? (
            <div className="rounded-[28px] border border-cyan-300/15 bg-cyan-300/10 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/75">
                {labels.intro}
              </p>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/78">
                {model.content.intro}
              </p>
            </div>
          ) : null}
          {intentHub ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/75">
                {intentHub.eyebrow}
              </p>
              <p className="mt-3 text-xl font-semibold tracking-tight">
                <a
                  className="transition hover:text-cyan-100"
                  href={intentHub.href}
                >
                  {intentHub.title}
                </a>
              </p>
              <p className="mt-2 text-sm leading-7 text-white/72">
                {intentHub.description}
              </p>
            </div>
          ) : null}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20">
          <DynamicToolComponent componentName={toolComponentName} />
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">{labels.overview}</h2>
            <p className="text-base leading-8 text-white/72">{model.content.overview}</p>
          </section>

          {useCases.length ? (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">{labels.useCases}</h2>
              <ul className="grid gap-3 md:grid-cols-3">
                {useCases.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/72"
                  >
                    <strong className="block text-base font-semibold text-white">
                      {item.title}
                    </strong>
                    <span className="mt-2 block">{item.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              {labels.howItWorks}
            </h2>
            <ol className="space-y-3">
              {model.content.howItWorks.map((step, index) => (
                <li
                  key={step}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white/72"
                >
                  <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/15 text-sm font-semibold text-cyan-100">
                    {index + 1}
                  </span>
                  <p className="leading-7">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">{labels.examples}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {model.content.examples.map((example) => (
                <article
                  key={example.title}
                  className="rounded-[28px] border border-white/10 bg-slate-950/50 p-5"
                >
                  <p className="text-lg font-semibold">{example.title}</p>
                  <p className="mt-3 text-sm text-white/65">
                    {labels.input}:{" "}
                    <span className="font-mono text-white">{example.input}</span>
                  </p>
                  <p className="mt-2 text-sm text-white/65">
                    {labels.output}:{" "}
                    <span className="font-mono text-white">{example.output}</span>
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/70">
                    {example.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">{labels.faq}</h2>
            <div className="space-y-4">
              {model.content.faq.map((item) => (
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
        </article>

        <aside className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{labels.related}</h2>
          <div className="grid gap-4">
            {relatedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} titleAs="p" />
            ))}
          </div>

          {categoryTools.length ? (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                {labels.categoryTools}
              </h2>
              <ul className="space-y-3">
                {categoryTools.map((tool) => (
                  <li key={tool.id}>
                    <a
                      href={tool.href}
                      className="block rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/72 transition hover:border-cyan-300/40 hover:text-white"
                    >
                      <strong className="font-semibold text-white">
                        {tool.title}
                      </strong>{" "}
                      - {tool.shortDescription}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </section>
    </div>
  );
}
