import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ToolCard } from "@/components/marketing/tool-card";
import type { Locale } from "@/lib/constants";
import { getSiteName, getSiteUrl } from "@/lib/env";
import { buildLanguageAlternates } from "@/lib/seo/alternates";
import { normalizeMetaDescription } from "@/lib/seo/meta-description";
import { buildTitledPageTitle, normalizeMetaTitle } from "@/lib/seo/meta-title";
import { buildStorageHubHref, getStorageHubContent } from "@/lib/tools/discovery";
import { getToolsForLocale } from "@/lib/tools/registry";

export function buildStorageHubMetadata(locale: Locale): Metadata {
  const content = getStorageHubContent(locale);
  const href = buildStorageHubHref(locale);

  if (!content || !href) {
    return {};
  }

  const canonical = `${getSiteUrl()}${href}`;
  const description = normalizeMetaDescription(
    content.metaDescription,
    content.description
  );
  const title = normalizeMetaTitle(content.metaTitle);

  return {
    title,
    description,
    alternates: {
      canonical,
      ...buildLanguageAlternates((entryLocale) => buildStorageHubHref(entryLocale))
    },
    openGraph: {
      title: buildTitledPageTitle(title),
      description,
      url: canonical,
      siteName: getSiteName(),
      locale,
      type: "website"
    }
  };
}

export function StorageHubPage({ locale }: { locale: Locale }) {
  const content = getStorageHubContent(locale);
  const href = buildStorageHubHref(locale);

  if (!content || !href) {
    return null;
  }

  const tools = content.featuredToolIds
    .map((toolId) =>
      getToolsForLocale(locale)
        .map(({ definition, content: toolContent }) => ({
          id: definition.id,
          href: `/${locale}/${definition.category}/${toolContent.slug}`,
          title: toolContent.title,
          shortDescription: toolContent.shortDescription,
          category: definition.category,
          seoPriority: definition.seoPriority
        }))
        .find((tool) => tool.id === toolId)
    )
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "de" || locale === "pl" ? "Start" : "Home",
          item: `${getSiteUrl()}/${locale}`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: content.title,
          item: `${getSiteUrl()}${href}`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    }
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16">
      {structuredData.map((item, index) => (
        <script
          key={`storage-hub-schema-${locale}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <Breadcrumbs
        items={[
          { href: `/${locale}`, label: locale === "de" || locale === "pl" ? "Start" : "Home" },
          { href, label: content.title }
        ]}
      />

      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
          {content.eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {content.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-white/70">{content.description}</p>
        <p className="mt-5 text-base leading-8 text-white/65">{content.intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {content.featuredSearches.map((item) => (
            <span
              key={item}
              className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-50/90"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {locale === "pl"
            ? "Najwazniejsze narzedzia"
            : locale === "de"
              ? "Wichtige Tools"
              : "Featured tools"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} titleAs="p" />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
        <div className="space-y-4">
          {content.faq.map((item) => (
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
    </div>
  );
}
