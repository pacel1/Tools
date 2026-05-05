import { ImageResponse } from "next/og";
import { locales, type Locale } from "@/lib/constants";
import { getSiteName } from "@/lib/env";

export const alt = "ConvertBase.app online tools";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

const socialCopy = {
  en: {
    title: "Free online converters, calculators and quick tools",
    subtitle: "Fast browser-based utilities for everyday work, study and technical tasks."
  },
  pl: {
    title: "Darmowe konwertery, kalkulatory i szybkie narzedzia online",
    subtitle: "Praktyczne narzedzia w przegladarce do pracy, nauki i codziennych zadan."
  },
  es: {
    title: "Conversores, calculadoras y herramientas online gratis",
    subtitle: "Utilidades rapidas en el navegador para tareas diarias, estudio y trabajo."
  },
  de: {
    title: "Kostenlose Online-Umrechner, Rechner und schnelle Tools",
    subtitle: "Browser-Tools fuer Arbeit, Studium und schnelle Alltagsaufgaben."
  },
  fr: {
    title: "Convertisseurs, calculateurs et outils en ligne gratuits",
    subtitle: "Des utilitaires rapides dans le navigateur pour le travail et les taches courantes."
  }
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const copy = socialCopy[locale] ?? socialCopy.en;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, #07111f 0%, #10223a 46%, #0891b2 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "center",
          padding: 72,
          width: "100%"
        }}
      >
        <div
          style={{
            border: "2px solid rgba(255,255,255,0.24)",
            borderRadius: 36,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            padding: 56,
            width: "100%"
          }}
        >
          <div
            style={{
              color: "#67e8f9",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase"
            }}
          >
            {getSiteName()}
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              maxWidth: 920
            }}
          >
            {copy.title}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.76)",
              fontSize: 34,
              lineHeight: 1.35,
              maxWidth: 900
            }}
          >
            {copy.subtitle}
          </div>
        </div>
      </div>
    ),
    size
  );
}
