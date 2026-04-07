import { getTranslations } from "next-intl/server";
import type { Route } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/constants";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const links = [
    { href: `/${locale}/about`, label: t("footerLinks.about") },
    { href: `/${locale}/privacy`, label: t("footerLinks.privacy") },
    { href: `/${locale}/terms`, label: t("footerLinks.terms") },
    { href: `/${locale}/cookies`, label: t("footerLinks.cookies") },
    { href: `/${locale}/disclaimer`, label: t("footerLinks.disclaimer") },
    { href: `/${locale}/contact`, label: t("footerLinks.contact") }
  ];

  return (
    <footer className="border-t border-white/10 py-10 text-sm text-white/60">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-3">
          <p className="font-medium text-white">{t("siteName")}</p>
          <p className="max-w-2xl">{t("footerTagline")}</p>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-3 text-white/70 sm:grid-cols-3"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href as Route}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
