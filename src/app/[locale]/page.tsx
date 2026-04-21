import { getTranslations } from "next-intl/server";
import { CategoryGrid } from "@/components/marketing/category-grid";
import { ToolCard } from "@/components/marketing/tool-card";
import { locales, type Locale } from "@/lib/constants";
import { buildHomePageMetadata } from "@/lib/pages/home-page-metadata";
import { getToolsForLocale } from "@/lib/tools/registry";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return buildHomePageMetadata(locale);
}

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const topTools = getToolsForLocale(locale)
    .slice(0, 6)
    .map(({ definition, content }) => ({
      id: definition.id,
      href: `/${locale}/${definition.category}/${content.slug}`,
      title: content.title,
      shortDescription: content.shortDescription,
      category: definition.category,
      seoPriority: definition.seoPriority
    }));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-12 lg:px-8 lg:py-16">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            {t("heroDescription")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/65">
            <span className="rounded-full border border-cyan-300/30 px-4 py-2">
              {t("heroChip1")}
            </span>
            <span className="rounded-full border border-cyan-300/30 px-4 py-2">
              {t("heroChip2")}
            </span>
            <span className="rounded-full border border-cyan-300/30 px-4 py-2">
              {t("heroChip3")}
            </span>
            <span className="rounded-full border border-cyan-300/30 px-4 py-2">
              {t("heroChip4")}
            </span>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-900/20">
          <div className="rounded-[26px] border border-cyan-300/20 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/75">
              {t("heroPanelLabel")}
            </p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>{t("heroPanelItem1")}</li>
              <li>{t("heroPanelItem2")}</li>
              <li>{t("heroPanelItem3")}</li>
              <li>{t("heroPanelItem4")}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
            {t("categoriesEyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            {t("categoriesTitle")}
          </h2>
        </div>
        <CategoryGrid locale={locale} />
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
            {t("featuredEyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            {t("featuredTitle")}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
