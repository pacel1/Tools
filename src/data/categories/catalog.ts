import type { Locale, ToolCategory } from "@/lib/constants";

type CategoryMeta = {
  label: Record<Locale, string>;
  description: Record<Locale, string>;
  accent: string;
};

export const categoryCatalog: Record<ToolCategory, CategoryMeta> = {
  converters: {
    label: {
      en: "Converters",
      pl: "Konwertery",
      es: "Conversores",
      de: "Umrechner",
      fr: "Convertisseurs"
    },
    description: {
      en: "Unit, file and format conversions designed for quick answers.",
      pl: "Konwersje jednostek, plikow i formatow do szybkich wynikow.",
      es: "Conversion de unidades, archivos y formatos para resultados rapidos.",
      de: "Einheiten-, Datei- und Formatumrechner fuer schnelle Ergebnisse.",
      fr: "Conversions d'unites, de fichiers et de formats pour aller vite."
    },
    accent: "from-cyan-400/40 to-sky-400/10"
  },
  calculators: {
    label: {
      en: "Calculators",
      pl: "Kalkulatory",
      es: "Calculadoras",
      de: "Rechner",
      fr: "Calculateurs"
    },
    description: {
      en: "Practical calculators for finance, health and everyday numbers.",
      pl: "Praktyczne kalkulatory do finansow, zdrowia i codziennych obliczen.",
      es: "Calculadoras practicas para finanzas, salud y cifras cotidianas.",
      de: "Praktische Rechner fuer Finanzen, Gesundheit und Alltag.",
      fr: "Des calculateurs pratiques pour la finance, la sante et le quotidien."
    },
    accent: "from-emerald-400/40 to-lime-400/10"
  },
  "construction-calculators": {
    label: {
      en: "Construction Calculators",
      pl: "Kalkulatory budowlane",
      es: "Calculadoras de construccion",
      de: "Bau-Rechner",
      fr: "Calculateurs de construction"
    },
    description: {
      en: "Material and quantity calculators for roofs, concrete, insulation, finishing and building projects.",
      pl: "Kalkulatory materialow i ilosci do dachu, betonu, ocieplenia, wykonczenia i prac budowlanych.",
      es: "Calculadoras de materiales y cantidades para tejados, hormigon, aislamiento, acabados y obras.",
      de: "Material- und Mengenrechner fuer Dach, Beton, Daemmung, Ausbau und Bauprojekte.",
      fr: "Calculateurs de materiaux et de quantites pour toiture, beton, isolation, finitions et travaux."
    },
    accent: "from-orange-400/40 to-amber-400/10"
  },
  generators: {
    label: {
      en: "Generators",
      pl: "Generatory",
      es: "Generadores",
      de: "Generatoren",
      fr: "Generateurs"
    },
    description: {
      en: "Fast generators for text snippets, slugs, IDs and templates.",
      pl: "Szybkie generatory tekstow, slugow, identyfikatorow i szablonow.",
      es: "Generadores rapidos de textos, slugs, IDs y plantillas.",
      de: "Schnelle Generatoren fuer Textbausteine, Slugs, IDs und Vorlagen.",
      fr: "Generateurs rapides de textes, slugs, IDs et modeles."
    },
    accent: "from-fuchsia-400/40 to-rose-400/10"
  },
  "text-tools": {
    label: {
      en: "Text Tools",
      pl: "Narzędzia tekstowe",
      es: "Herramientas de texto",
      de: "Text-Tools",
      fr: "Outils de texte"
    },
    description: {
      en: "Counting, cleanup and structure helpers for everyday writing.",
      pl: "Liczenie, czyszczenie i porządkowanie tekstu w codziennej pracy.",
      es: "Herramientas para contar, limpiar y estructurar texto.",
      de: "Hilfen zum Zaehlen, Bereinigen und Strukturieren von Text.",
      fr: "Outils pour compter, nettoyer et structurer du texte."
    },
    accent: "from-amber-400/40 to-orange-400/10"
  },
  "developer-tools": {
    label: {
      en: "Developer Tools",
      pl: "Narzędzia deweloperskie",
      es: "Herramientas para desarrolladores",
      de: "Entwickler-Tools",
      fr: "Outils developpeur"
    },
    description: {
      en: "Small utilities for formatting, debugging and transforming data.",
      pl: "Male narzedzia do formatowania, debugowania i transformacji danych.",
      es: "Pequenas utilidades para formatear, depurar y transformar datos.",
      de: "Kleine Helfer fuer Formatierung, Debugging und Datentransformation.",
      fr: "Petits utilitaires pour formater, deboguer et transformer des donnees."
    },
    accent: "from-violet-400/40 to-blue-400/10"
  },
  "html-tools": {
    label: {
      en: "HTML Tools",
      pl: "Narzędzia HTML",
      es: "Herramientas HTML",
      de: "HTML Werkzeuge",
      fr: "Outils HTML"
    },
    description: {
      en: "HTML formatters, validators, converters and extractors for markup workflows.",
      pl: "Formatery, walidatory, konwertery i ekstraktory HTML do pracy z kodem.",
      es: "Formateadores, validadores, convertidores y extractores HTML para trabajar con marcado.",
      de: "HTML Formatter, Validatoren, Konverter und Extraktoren fuer Markup-Workflows.",
      fr: "Formateurs, validateurs, convertisseurs et extracteurs HTML pour les workflows markup."
    },
    accent: "from-rose-400/40 to-orange-400/10"
  },
  "date-time": {
    label: {
      en: "Date & Time",
      pl: "Data i czas",
      es: "Fecha y hora",
      de: "Datum & Zeit",
      fr: "Date et heure"
    },
    description: {
      en: "Timezone, date math and schedule helpers.",
      pl: "Narzędzia do stref czasowych, dat i harmonogramow.",
      es: "Herramientas para zonas horarias, fechas y horarios.",
      de: "Helfer fuer Zeitzonen, Datumsrechnen und Planung.",
      fr: "Outils pour fuseaux horaires, dates et planification."
    },
    accent: "from-teal-400/40 to-cyan-400/10"
  },
  "image-tools": {
    label: {
      en: "Image Tools",
      pl: "Narzędzia obrazów",
      es: "Herramientas de imagen",
      de: "Bild-Tools",
      fr: "Outils image"
    },
    description: {
      en: "Compression, resizing and optimization helpers.",
      pl: "Kompresja, zmiana rozmiaru i optymalizacja obrazow.",
      es: "Compresion, cambio de tamano y optimizacion de imagenes.",
      de: "Komprimierung, Groessenanderung und Bildoptimierung.",
      fr: "Compression, redimensionnement et optimisation d'images."
    },
    accent: "from-pink-400/40 to-red-400/10"
  },
  "security-tools": {
    label: {
      en: "Security Tools",
      pl: "Narzędzia bezpieczeństwa",
      es: "Herramientas de seguridad",
      de: "Sicherheits-Tools",
      fr: "Outils de securite"
    },
    description: {
      en: "Hashing, encoding and safe inspection workflows.",
      pl: "Haszowanie, kodowanie i bezpieczna inspekcja danych.",
      es: "Hashing, codificacion e inspeccion segura de datos.",
      de: "Hashing, Kodierung und sichere Dateninspektion.",
      fr: "Hachage, encodage et inspection sure des donnees."
    },
    accent: "from-slate-400/40 to-zinc-400/10"
  }
};
