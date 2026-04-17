import type { Locale, ToolCategory } from "@/lib/constants";

export type IntentHubLink = {
  href: string;
  title: string;
  description: string;
  eyebrow: string;
};

export type CategoryHubContent = {
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  featuredSearches: string[];
  featuredToolIds: string[];
};

export type StorageHubContent = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  featuredSearches: string[];
  featuredToolIds: string[];
  faq: Array<{ question: string; answer: string }>;
  metaTitle: string;
  metaDescription: string;
};

const intentClusters = {
  storage: ["storage-converter", "gb-to-mb-converter", "mb-to-gb-converter"],
  html: [
    "html-link-extractor",
    "html-pretty-print",
    "html-formatter",
    "html-to-markdown",
    "markdown-to-html"
  ],
  image: [
    "image-compressor",
    "image-resizer",
    "image-format-converter",
    "image-cropper",
    "icon-maker"
  ],
  seoText: [
    "keyword-density-checker",
    "word-counter",
    "reading-time-calculator",
    "sentence-counter"
  ],
  colors: [
    "hex-to-rgb-converter",
    "color-picker",
    "contrast-checker",
    "palette-generator",
    "gradient-generator"
  ]
} as const satisfies Record<string, string[]>;

const storageHubContent: Partial<Record<Locale, StorageHubContent>> = {
  en: {
    slug: "storage-converters",
    eyebrow: "Storage hub",
    title: "Storage converters",
    description:
      "Convert KB, MB, GB and TB with browser-based tools for quick file size answers.",
    intro:
      "Use this storage converter hub when you need a fast answer for file sizes, memory units and binary 1024 conversions. It brings together the main storage tools people search for, including GB to MB, MB to GB and a universal converter.",
    featuredSearches: [
      "convert gb to mb",
      "gb to mb converter",
      "mb to gb converter",
      "how many mb in a gb"
    ],
    featuredToolIds: ["storage-converter", "gb-to-mb-converter", "mb-to-gb-converter"],
    faq: [
      {
        question: "Does this hub use the binary 1024 conversion?",
        answer:
          "Yes. The featured storage tools focus on the binary convention used for many file size and memory calculations."
      },
      {
        question: "Can I switch between multiple storage units?",
        answer:
          "Yes. The universal storage converter lets you move between KB, MB, GB and TB in one place."
      }
    ],
    metaTitle: "Storage Converters | KB, MB, GB and TB tools",
    metaDescription:
      "Convert storage units online with fast KB, MB, GB and TB tools. Find GB to MB, MB to GB and a universal storage converter in one hub."
  },
  pl: {
    slug: "konwertery-pamieci",
    eyebrow: "Hub pamieci",
    title: "Konwertery pamieci",
    description:
      "Przeliczaj KB, MB, GB i TB w narzedziach do szybkich odpowiedzi o rozmiarze plikow.",
    intro:
      "Ten hub konwerterow pamieci zbiera najwazniejsze narzedzia do przeliczania jednostek storage. Znajdziesz tu szybkie odpowiedzi na frazy typu ile MB w GB, GB na MB, MB na GB oraz uniwersalny konwerter pamieci.",
    featuredSearches: [
      "ile mb w gb",
      "gb to ile mb",
      "konwerter gb na mb",
      "konwerter mb na gb"
    ],
    featuredToolIds: ["storage-converter", "gb-to-mb-converter", "mb-to-gb-converter"],
    faq: [
      {
        question: "Czy te konwertery uzywaja przelicznika 1024?",
        answer:
          "Tak. Narzedzia z tego huba bazuja na binarnym przeliczniku 1024, czesto uzywanym przy rozmiarach plikow i pamieci."
      },
      {
        question: "Czy moge przeliczac wiecej niz jedna pare jednostek?",
        answer:
          "Tak. Uniwersalny konwerter pamieci obsluguje KB, MB, GB i TB w obu kierunkach."
      }
    ],
    metaTitle: "Konwertery pamieci | KB, MB, GB i TB",
    metaDescription:
      "Przeliczaj jednostki pamieci online. Znajdziesz tu konwerter GB na MB, MB na GB i uniwersalny konwerter KB, MB, GB i TB."
  },
  de: {
    slug: "speicher-umrechner",
    eyebrow: "Speicher-Hub",
    title: "Speicher-Umrechner",
    description:
      "KB, MB, GB und TB schnell online umrechnen, inklusive Tools fuer typische Dateigroessen-Fragen.",
    intro:
      "Dieser Speicher-Hub sammelt die wichtigsten Rechner fuer Dateigroessen und Speichereinheiten. Er ist fuer Suchanfragen wie GB zu MB, MB zu GB und allgemeine Speicher-Umrechnungen mit dem 1024-System gedacht.",
    featuredSearches: [
      "gb zu mb",
      "mb zu gb",
      "speicher umrechner",
      "wie viel mb sind 1 gb"
    ],
    featuredToolIds: ["storage-converter", "gb-to-mb-converter", "mb-to-gb-converter"],
    faq: [
      {
        question: "Arbeiten die Rechner mit dem 1024-System?",
        answer:
          "Ja. Die hervorgehobenen Speicher-Tools in diesem Hub verwenden den binaeren 1024-Faktor."
      },
      {
        question: "Kann ich mehrere Einheiten in einem Tool wechseln?",
        answer:
          "Ja. Der universelle Speicher-Umrechner deckt KB, MB, GB und TB in beide Richtungen ab."
      }
    ],
    metaTitle: "Speicher-Umrechner | KB, MB, GB und TB online",
    metaDescription:
      "KB, MB, GB und TB online umrechnen. Dieser Hub buendelt GB-zu-MB, MB-zu-GB und einen universellen Speicher-Umrechner."
  }
};

const categoryHubContent: Partial<
  Record<Locale, Partial<Record<ToolCategory, CategoryHubContent>>>
> = {
  en: {
    "html-tools": {
      eyebrow: "HTML hub",
      title: "HTML tools for formatting, extraction and markup cleanup",
      description:
        "Work through messy markup faster with formatters, link extractors, converters and validators in one searchable hub.",
      intro:
        "This HTML tools hub is tuned for real search intents such as html pretty, href extractor and format HTML online. Start with the tool that matches the job, then jump to related cleanup or conversion workflows without leaving the browser.",
      featuredSearches: [
        "html pretty",
        "format html online",
        "href extractor",
        "extract urls from html"
      ],
      featuredToolIds: [
        "html-pretty-print",
        "html-link-extractor",
        "html-formatter",
        "html-to-markdown"
      ]
    },
    "image-tools": {
      eyebrow: "Image hub",
      title: "Image tools for resizing, compression and quick exports",
      description:
        "Resize, compress, crop and convert images in a browser-based workflow built for speed and privacy.",
      intro:
        "Use the image tools hub when you need to shrink images, change image size online or export files for web use. The featured tools cover the highest-intent jobs first and connect naturally to the next step in the workflow.",
      featuredSearches: [
        "image compressor",
        "image resizer",
        "reduce jpg size",
        "change image size online"
      ],
      featuredToolIds: [
        "image-compressor",
        "image-resizer",
        "image-format-converter",
        "icon-maker"
      ]
    }
  },
  pl: {
    "html-tools": {
      eyebrow: "Hub HTML",
      title: "Narzędzia HTML do formatowania, ekstrakcji i konwersji",
      description:
        "Zbior narzedzi HTML do szybkiego porzadkowania kodu, ekstrakcji linkow i zamiany markup na czytelne wyjscie.",
      intro:
        "Ten hub HTML odpowiada na intencje typu format HTML online, pretty print HTML i ekstraktor linkow z HTML. Kazde narzedzie dziala w przegladarce i prowadzi dalej do kolejnego kroku pracy z kodem.",
      featuredSearches: [
        "format html online",
        "pretty print html",
        "ekstraktor linkow html",
        "html do markdown"
      ],
      featuredToolIds: [
        "html-pretty-print",
        "html-link-extractor",
        "html-formatter",
        "html-to-markdown"
      ]
    },
    "image-tools": {
      eyebrow: "Hub obrazow",
      title: "Narzędzia obrazów do zmiany rozmiaru, kompresji i eksportu",
      description:
        "Przyspiesz prace z plikami graficznymi dzieki narzedziom do kompresji, zmiany rozmiaru i generowania ikon.",
      intro:
        "Hub obrazow zbiera najczesciej szukane workflowy: zmniejszanie JPG, kompresje obrazow, zmiane rozmiaru i przygotowanie ikon. Narzedzia sa polaczone tak, zeby latwo przejsc od jednego kroku do nastepnego.",
      featuredSearches: [
        "kompresor obrazow",
        "zmien rozmiar obrazu",
        "zmniejsz jpg",
        "generator ikon"
      ],
      featuredToolIds: [
        "image-compressor",
        "image-resizer",
        "image-format-converter",
        "icon-maker"
      ]
    }
  },
  de: {
    "html-tools": {
      eyebrow: "HTML-Hub",
      title: "HTML-Werkzeuge fuer Formatierung, Extraktion und sauberes Markup",
      description:
        "Finde Formatter, Link-Extraktoren und Konverter in einem Hub fuer schnelle HTML-Workflows im Browser.",
      intro:
        "Dieser HTML-Hub ist auf Suchanfragen wie html pretty, href extractor und HTML online formatieren ausgerichtet. So kommst du schneller von rohem Markup zu lesbarem, auswertbarem Output.",
      featuredSearches: [
        "html pretty",
        "html online formatieren",
        "href extractor",
        "links aus html extrahieren"
      ],
      featuredToolIds: [
        "html-pretty-print",
        "html-link-extractor",
        "html-formatter",
        "html-to-markdown"
      ]
    },
    "image-tools": {
      eyebrow: "Bild-Hub",
      title: "Bild-Tools fuer Groessenaenderung, Komprimierung und Icon-Export",
      description:
        "Bearbeite Bilder schneller mit Browser-Tools fuer Komprimierung, Skalierung, Konvertierung und Icon-Erstellung.",
      intro:
        "Im Bild-Hub findest du die wichtigsten Workflows fuer Suchanfragen wie Bildgroesse aendern, Bilder online verkleinern und JPG verkleinern. Die vorgestellten Tools fuehren direkt zum naechsten sinnvollen Schritt.",
      featuredSearches: [
        "bildgroesse aendern",
        "bilder online verkleinern",
        "jpg verkleinern",
        "icon generator"
      ],
      featuredToolIds: [
        "image-compressor",
        "image-resizer",
        "image-format-converter",
        "icon-maker"
      ]
    }
  }
};

const hubLabels = {
  storage: {
    en: {
      title: "Storage converters",
      description:
        "Move between KB, MB, GB and TB with storage-focused tools and quick binary answers."
    },
    pl: {
      title: "Konwertery pamieci",
      description:
        "Przeliczaj KB, MB, GB i TB w hubie narzedzi do rozmiarow plikow i pamieci."
    },
    de: {
      title: "Speicher-Umrechner",
      description:
        "Wechsle zwischen KB, MB, GB und TB mit schnellen Speicher-Tools im Browser."
    }
  },
  html: {
    en: {
      title: "HTML tools hub",
      description:
        "Browse formatters, extractors and cleanup tools for markup-focused work."
    },
    pl: {
      title: "Hub narzedzi HTML",
      description:
        "Przegladaj formatery, ekstraktory i narzedzia do czyszczenia kodu HTML."
    },
    de: {
      title: "HTML-Tools-Hub",
      description:
        "Entdecke Formatter, Extraktoren und Helfer fuer saubere HTML-Workflows."
    }
  },
  image: {
    en: {
      title: "Image tools hub",
      description:
        "Browse image resizing, compression and export tools for common web tasks."
    },
    pl: {
      title: "Hub narzedzi obrazow",
      description:
        "Przegladaj narzedzia do zmiany rozmiaru, kompresji i eksportu obrazow."
    },
    de: {
      title: "Bild-Tools-Hub",
      description:
        "Finde Bild-Tools fuer Komprimierung, Groessenaenderung und Export."
    }
  }
} as const;

export function buildStorageHubHref(locale: Locale) {
  return storageHubContent[locale]?.slug ? `/${locale}/${storageHubContent[locale].slug}` : null;
}

export function getStorageHubContent(locale: Locale) {
  return storageHubContent[locale] ?? null;
}

export function getCategoryHubContent(locale: Locale, category: ToolCategory) {
  return categoryHubContent[locale]?.[category] ?? null;
}

export function getIntentRelatedIds(toolId: string) {
  const clusters = Object.values(intentClusters) as ReadonlyArray<ReadonlyArray<string>>;
  const related = clusters
    .filter((cluster) => cluster.includes(toolId))
    .flatMap((cluster) => cluster.filter((candidate) => candidate !== toolId));

  return [...new Set(related)];
}

export function getIntentHubLink(locale: Locale, toolId: string): IntentHubLink | null {
  if ((intentClusters.storage as ReadonlyArray<string>).includes(toolId)) {
    const href = buildStorageHubHref(locale);
    const labels = hubLabels.storage[locale as keyof typeof hubLabels.storage];

    return href && labels
      ? {
          href,
          title: labels.title,
          description: labels.description,
          eyebrow: "Hub"
        }
      : null;
  }

  if ((intentClusters.html as ReadonlyArray<string>).includes(toolId)) {
    const labels = hubLabels.html[locale as keyof typeof hubLabels.html];

    return labels
      ? {
          href: `/${locale}/html-tools`,
          title: labels.title,
          description: labels.description,
          eyebrow: "Hub"
        }
      : null;
  }

  if ((intentClusters.image as ReadonlyArray<string>).includes(toolId)) {
    const labels = hubLabels.image[locale as keyof typeof hubLabels.image];

    return labels
      ? {
          href: `/${locale}/image-tools`,
          title: labels.title,
          description: labels.description,
          eyebrow: "Hub"
        }
      : null;
  }

  return null;
}
