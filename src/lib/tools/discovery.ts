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
  workflows: Array<{ title: string; description: string; toolId: string }>;
  useCases: Array<{ title: string; description: string }>;
  faq: Array<{ question: string; answer: string }>;
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
    "construction-calculators": {
      eyebrow: "Construction hub",
      title: "Construction calculators for material estimates and planning",
      description:
        "Estimate concrete, roofing, insulation, plaster, tiles and other building materials in one focused category.",
      intro:
        "This construction calculator hub groups the highest-intent tools for planning renovation and building work. Start with the material you need to estimate, then compare related tools for adjacent parts of the project such as insulation, waterproofing, drywall or finishing.",
      featuredSearches: [
        "concrete calculator",
        "roof calculator",
        "insulation calculator",
        "tile calculator"
      ],
      featuredToolIds: [
        "kalkulator-betonu",
        "kalkulator-dachu",
        "kalkulator-styropianu",
        "kalkulator-plytek"
      ],
      workflows: [
        {
          title: "Estimate a concrete pour",
          description:
            "Start with slab, footing or post dimensions and move from volume to bags or ready-mix quantity.",
          toolId: "kalkulator-betonu"
        },
        {
          title: "Plan roof material quantities",
          description:
            "Use roof dimensions to estimate surface, sheets or related material before comparing insulation and finishing needs.",
          toolId: "kalkulator-dachu"
        }
      ],
      useCases: [
        {
          title: "Renovation planning",
          description:
            "Compare material quantities before ordering concrete, tiles, insulation or finishing materials."
        },
        {
          title: "Contractor checks",
          description:
            "Use quick estimates to review supplier quotes and spot missing allowance for waste."
        }
      ],
      faq: [
        {
          question: "Are these construction calculators exact quotes?",
          answer:
            "No. They provide planning estimates and should be checked against local product data, site conditions and contractor guidance."
        },
        {
          question: "Do the calculators include waste?",
          answer:
            "Many tools include waste or margin fields so you can compare a base estimate with a safer order quantity."
        }
      ]
    },
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
      ],
      workflows: [
        {
          title: "Format messy HTML",
          description:
            "Paste compact markup and turn it into readable indentation before review or debugging.",
          toolId: "html-pretty-print"
        },
        {
          title: "Extract links from markup",
          description:
            "Pull href values from copied HTML when auditing pages, migrations or scraped snippets.",
          toolId: "html-link-extractor"
        },
        {
          title: "Convert HTML to Markdown",
          description:
            "Move browser or CMS content into Markdown for docs, notes and publishing workflows.",
          toolId: "html-to-markdown"
        }
      ],
      useCases: [
        {
          title: "Content cleanup",
          description:
            "Clean copied HTML before moving it into documentation, tickets or a CMS editor."
        },
        {
          title: "Technical audits",
          description:
            "Inspect links, text and structure without setting up a local parser or sending data to an API."
        }
      ],
      faq: [
        {
          question: "Do these HTML tools run in the browser?",
          answer:
            "Yes. The tools are built for browser-side workflows so common formatting, extraction and conversion tasks are fast and private."
        },
        {
          question: "Which HTML tool should I start with?",
          answer:
            "Use the formatter or pretty printer for messy markup, the link extractor for href audits, and the converters when moving content between HTML, Markdown and text."
        }
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
      ],
      workflows: [
        {
          title: "Compress images for the web",
          description:
            "Reduce image file size before uploading assets to websites, stores or documentation.",
          toolId: "image-compressor"
        },
        {
          title: "Resize an image quickly",
          description:
            "Set browser-side dimensions for screenshots, product images or social assets.",
          toolId: "image-resizer"
        }
      ],
      useCases: [
        {
          title: "Website publishing",
          description:
            "Prepare lighter image files and consistent dimensions before adding them to a page."
        },
        {
          title: "Quick asset handoff",
          description:
            "Crop, resize and export images without opening a heavier desktop editor."
        }
      ],
      faq: [
        {
          question: "Do images need to be uploaded to a server?",
          answer:
            "The featured image tools are designed for browser-side workflows, which helps keep quick edits private."
        },
        {
          question: "Which image tool should I choose first?",
          answer:
            "Start with compression for file size, resizing for dimensions, conversion for format changes and cropping when the visible area needs adjustment."
        }
      ]
    }
  },
  pl: {
    "construction-calculators": {
      eyebrow: "Hub budowlany",
      title: "Kalkulatory budowlane do liczenia materialow i planowania prac",
      description:
        "Policz beton, dach, ocieplenie, tynki, plytki i inne materialy potrzebne do remontu oraz budowy.",
      intro:
        "Ten hub kalkulatorow budowlanych zbiera narzedzia o najwyzszej intencji zakupowej i wykonawczej. Mozesz szybko oszacowac ilosc materialu, a potem przejsc do powiazanych kalkulatorow dla kolejnych etapow prac, takich jak hydroizolacja, zabudowa GK czy wykonczenie.",
      featuredSearches: [
        "kalkulator betonu",
        "kalkulator dachu",
        "kalkulator styropianu",
        "kalkulator plytek"
      ],
      featuredToolIds: [
        "kalkulator-betonu",
        "kalkulator-dachu",
        "kalkulator-styropianu",
        "kalkulator-plytek"
      ],
      workflows: [
        {
          title: "Policz beton na pierwszy etap prac",
          description:
            "Wpisz wymiary plyty, lawy lub slupka i szybko sprawdz objetosc, zapas oraz liczbe workow.",
          toolId: "kalkulator-betonu"
        },
        {
          title: "Oszacuj materialy na dach",
          description:
            "Zacznij od powierzchni dachu, a potem przejdz do powiazanych obliczen izolacji i wykonczenia.",
          toolId: "kalkulator-dachu"
        }
      ],
      useCases: [
        {
          title: "Planowanie zakupow",
          description:
            "Sprawdz przyblizone ilosci materialow przed zamowieniem betonu, plytek, ocieplenia lub wykonczenia."
        },
        {
          title: "Kontrola wyceny",
          description:
            "Porownaj szybkie obliczenia z oferta wykonawcy i upewnij sie, ze uwzgledniono zapas materialu."
        }
      ],
      faq: [
        {
          question: "Czy kalkulatory budowlane daja gotowa wycene?",
          answer:
            "Nie. Daja szybkie szacunki do planowania, ktore warto porownac z karta produktu, warunkami na budowie i zaleceniami wykonawcy."
        },
        {
          question: "Czy moge doliczyc zapas materialu?",
          answer:
            "Wiele narzedzi ma pole zapasu lub strat, dzieki czemu mozna porownac wynik bazowy z bezpieczniejsza iloscia do zamowienia."
        }
      ]
    },
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
      ],
      workflows: [
        {
          title: "Sformatuj nieczytelny kod HTML",
          description:
            "Wklej zbity markup i zamien go na czytelny uklad z wcieciami przed review, audytem albo debugowaniem.",
          toolId: "html-pretty-print"
        },
        {
          title: "Wyciagnij linki z HTML",
          description:
            "Zbierz adresy href z fragmentu strony, mailingu albo eksportu CMS bez pisania parsera.",
          toolId: "html-link-extractor"
        },
        {
          title: "Zamien HTML na Markdown",
          description:
            "Przenies tresc z HTML do Markdown, gdy przygotowujesz dokumentacje, notatki albo migracje contentu.",
          toolId: "html-to-markdown"
        }
      ],
      useCases: [
        {
          title: "Porzadkowanie kodu po skopiowaniu",
          description:
            "Uzyj formattera, gdy HTML z edytora, CMS albo zrodla strony jest zbity i trudny do sprawdzenia."
        },
        {
          title: "Audyt linkow i tresci",
          description:
            "Ekstraktory pomagaja szybko sprawdzic adresy URL, obrazy i tekst bez uruchamiania lokalnych skryptow."
        },
        {
          title: "Migracja tresci",
          description:
            "Konwertery ulatwiaja przejscie miedzy HTML, Markdown i plain text podczas pracy nad dokumentacja lub publikacja."
        }
      ],
      faq: [
        {
          question: "Czy narzedzia HTML wysylaja kod na serwer?",
          answer:
            "Nie w typowym workflow. Narzedzia sa projektowane jako szybkie operacje w przegladarce, co pomaga zachowac prywatnosc fragmentow kodu."
        },
        {
          question: "Ktore narzedzie HTML wybrac jako pierwsze?",
          answer:
            "Do nieczytelnego kodu wybierz formatter lub pretty print, do audytu adresow ekstraktor linkow, a do migracji tresci konwerter HTML na Markdown."
        },
        {
          question: "Czy hub HTML jest tylko lista linkow?",
          answer:
            "Nie. Hub grupuje typowe zadania, opisuje kiedy uzyc konkretnych narzedzi i prowadzi do powiazanych workflowow pracy z markupem."
        }
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
      ],
      workflows: [
        {
          title: "Zmniejsz rozmiar pliku",
          description:
            "Skompresuj obraz przed dodaniem go do strony, sklepu albo dokumentacji.",
          toolId: "image-compressor"
        },
        {
          title: "Dopasuj wymiary obrazu",
          description:
            "Zmien szerokosc i wysokosc grafiki w przegladarce, zanim uzyjesz jej w projekcie.",
          toolId: "image-resizer"
        }
      ],
      useCases: [
        {
          title: "Publikacja na stronie",
          description:
            "Przygotuj lzejsze pliki i przewidywalne wymiary przed dodaniem obrazow do witryny."
        },
        {
          title: "Szybka obrobka assetow",
          description:
            "Przytnij, zmien rozmiar lub eksportuj obraz bez otwierania ciezszego edytora graficznego."
        }
      ],
      faq: [
        {
          question: "Czy obrazy trzeba wysylac na serwer?",
          answer:
            "Narzędzia sa projektowane pod prace w przegladarce, co pomaga przy szybkiej i prywatnej obrobce plikow."
        },
        {
          question: "Od ktorego narzedzia zaczac?",
          answer:
            "Wybierz kompresor dla rozmiaru pliku, resizer dla wymiarow, konwerter dla formatu i cropper dla kadrowania."
        }
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
      ],
      workflows: [
        {
          title: "HTML lesbar formatieren",
          description:
            "Formatiere kompaktes Markup mit stabilen Einrueckungen fuer Review, Debugging und Audits.",
          toolId: "html-pretty-print"
        },
        {
          title: "Links aus HTML extrahieren",
          description:
            "Ziehe href-Werte aus kopiertem Markup, CMS-Ausgaben oder Seitenfragmenten.",
          toolId: "html-link-extractor"
        }
      ],
      useCases: [
        {
          title: "Markup pruefen",
          description:
            "Nutze Formatter und Viewer, um HTML-Struktur schneller zu lesen und Fehler zu finden."
        },
        {
          title: "Content migrieren",
          description:
            "Konvertiere Inhalte zwischen HTML, Markdown und Text fuer Dokumentation oder CMS-Arbeit."
        }
      ],
      faq: [
        {
          question: "Laufen die HTML-Tools im Browser?",
          answer:
            "Ja. Sie sind fuer schnelle Browser-Workflows gedacht, ohne dass du fuer Standardaufgaben eine externe API brauchst."
        },
        {
          question: "Welches Tool passt zu welchem Job?",
          answer:
            "Formatter helfen bei unlesbarem Markup, Extraktoren bei Links und Text, Konverter bei HTML-, Markdown- und Text-Workflows."
        }
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
      ],
      workflows: [
        {
          title: "Bilder fuer das Web komprimieren",
          description:
            "Reduziere Dateigroessen, bevor du Bilder in Webseiten, Shops oder Dokumentation verwendest.",
          toolId: "image-compressor"
        },
        {
          title: "Bildgroesse aendern",
          description:
            "Passe Breite und Hoehe direkt im Browser fuer Screenshots, Produktbilder oder Assets an.",
          toolId: "image-resizer"
        }
      ],
      useCases: [
        {
          title: "Web-Publishing",
          description:
            "Bereite leichtere Dateien und konsistente Masse vor, bevor Bilder live gehen."
        },
        {
          title: "Schnelle Asset-Arbeit",
          description:
            "Schneide, skaliere oder exportiere Bilder ohne schweres Desktop-Programm."
        }
      ],
      faq: [
        {
          question: "Muessen Bilder hochgeladen werden?",
          answer:
            "Die vorgestellten Tools sind fuer browserseitige Workflows gedacht und eignen sich fuer schnelle private Bearbeitung."
        },
        {
          question: "Womit soll ich anfangen?",
          answer:
            "Starte mit Komprimierung fuer Dateigroesse, Resizing fuer Abmessungen und Konvertierung fuer Formatwechsel."
        }
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
