import { getTranslations } from "next-intl/server";
import type { Route } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/constants";

const footerSeoLabels = {
  en: {
    about: "About ConvertBase",
    privacy: "Privacy policy",
    terms: "Terms of use",
    cookies: "Cookie policy",
    disclaimer: "Usage disclaimer",
    contact: "Contact ConvertBase"
  },
  pl: {
    about: "O ConvertBase",
    privacy: "Polityka prywatnosci",
    terms: "Regulamin ConvertBase",
    cookies: "Polityka cookies",
    disclaimer: "Zastrzezenie uzytkowania",
    contact: "Kontakt z ConvertBase"
  },
  es: {
    about: "Sobre ConvertBase",
    privacy: "Politica de privacidad",
    terms: "Terminos de uso",
    cookies: "Politica de cookies",
    disclaimer: "Aviso de uso",
    contact: "Contacto ConvertBase"
  },
  de: {
    about: "Uber ConvertBase",
    privacy: "Datenschutzerklaerung",
    terms: "Nutzungsbedingungen",
    cookies: "Cookie-Richtlinie",
    disclaimer: "Nutzungshinweis",
    contact: "Kontakt ConvertBase"
  },
  fr: {
    about: "A propos de ConvertBase",
    privacy: "Politique de confidentialite",
    terms: "Conditions d'utilisation",
    cookies: "Politique de cookies",
    disclaimer: "Avertissement d'utilisation",
    contact: "Contact ConvertBase"
  }
} as const;

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const links = [
    { href: `/${locale}/about`, label: footerSeoLabels[locale].about },
    { href: `/${locale}/privacy`, label: footerSeoLabels[locale].privacy },
    { href: `/${locale}/terms`, label: footerSeoLabels[locale].terms },
    { href: `/${locale}/cookies`, label: footerSeoLabels[locale].cookies },
    {
      href: `/${locale}/disclaimer`,
      label: footerSeoLabels[locale].disclaimer
    },
    { href: `/${locale}/contact`, label: footerSeoLabels[locale].contact }
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
