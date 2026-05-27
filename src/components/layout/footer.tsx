import { getTranslations } from "next-intl/server";
import type { Route } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/constants";
import { getLegalPagePath } from "@/lib/pages/types";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const eeat = await getTranslations({ locale, namespace: "eeat.footer" });
  const aboutLinks = [
    {
      href: getLegalPagePath(locale, "about"),
      label: eeat("about")
    },
    {
      href: getLegalPagePath(locale, "methodology"),
      label: eeat("methodology")
    },
    {
      href: getLegalPagePath(locale, "disclaimer"),
      label: eeat("disclaimer")
    }
  ];
  const policyLinks = [
    { href: `/${locale}/privacy`, label: t("footerLinks.privacy") },
    { href: `/${locale}/terms`, label: t("footerLinks.terms") },
    { href: `/${locale}/cookies`, label: t("footerLinks.cookies") },
    { href: `/${locale}/contact`, label: t("footerLinks.contact") }
  ];

  return (
    <footer className="border-t border-white/10 py-10 text-sm text-white/60">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-3">
          <p className="font-medium text-white">{t("siteName")}</p>
          <p className="max-w-2xl">{t("footerTagline")}</p>
        </div>

        <nav
          aria-label="Footer"
          className="grid gap-8 text-white/70 sm:grid-cols-2"
        >
          <div className="space-y-3">
            <p className="font-medium text-white">{eeat("heading")}</p>
            <div className="grid gap-3">
              {aboutLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as Route}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-medium text-white">{t("footerLinks.contact")}</p>
            <div className="grid gap-3">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as Route}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </footer>
  );
}
