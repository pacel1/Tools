import type { ReactNode } from "react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { categoryCatalog } from "@/data/categories/catalog";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Footer } from "@/components/layout/footer";
import type { Locale } from "@/lib/constants";
import { getActiveCategories } from "@/lib/tools/categories";

export async function SiteShell({
  children,
  locale
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "common" });
  const categories = getActiveCategories(locale);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(103,232,249,0.16),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#0b1525_45%,_#090d15_100%)] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
          <Link
            href={`/${locale}` as Route}
            className="flex items-center gap-3"
            aria-label={t("siteName")}
          >
            <Image
              src="/favicon-32x32.png"
              alt={t("siteName")}
              width={40}
              height={40}
              priority
              className="h-10 w-10 rounded-2xl bg-white/95 object-contain p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.28)] md:hidden"
            />
            <div className="hidden md:flex md:flex-col">
              <div className="inline-flex w-fit rounded-full border border-slate-200/80 bg-white/95 px-4 py-2 shadow-[0_14px_38px_rgba(15,23,42,0.24)]">
                <Image
                  src="/logo-wordmark.png"
                  alt={t("siteName")}
                  width={787}
                  height={170}
                  priority
                  className="h-10 w-auto max-w-[220px] object-contain lg:h-11 lg:max-w-[260px]"
                />
              </div>
              <p className="text-xs text-white/55">{t("siteTagline")}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 lg:flex lg:flex-wrap lg:justify-end">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/${locale}/${category}` as Route}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-cyan-300/40 hover:text-white"
              >
                {categoryCatalog[category].label[locale]}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>
      <Footer locale={locale} />
      <CookieBanner
        copy={{
          title: t("cookieBanner.title"),
          description: t("cookieBanner.description"),
          accept: t("cookieBanner.accept")
        }}
      />
    </div>
  );
}
