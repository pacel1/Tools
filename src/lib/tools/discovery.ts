import type { Locale, ToolCategory } from "@/lib/constants";
import { generatedCategoryContent } from "@/data/categories/content";

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

type CuratedCategoryBrief = {
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  featuredSearches: string[];
  featuredToolIds: string[];
  workflows: CategoryHubContent["workflows"];
  useCases: CategoryHubContent["useCases"];
  faq: CategoryHubContent["faq"];
};

const curatedCategoryBriefs: { en: Partial<Record<ToolCategory, CuratedCategoryBrief>> } & Partial<
  Record<Locale, Partial<Record<ToolCategory, CuratedCategoryBrief>>>
> = {
  en: {
    converters: {
      eyebrow: "Converter hub",
      title: "Converters for units, files and everyday measurements",
      description:
        "Convert measurements, storage units, colors and temperature values with focused browser tools.",
      intro:
        "This converter hub groups tools for the moments when a number, unit or format needs to move into a more useful form. Start with the type of value you have, then choose the converter that matches the target unit or output.",
      featuredSearches: [
        "gb to mb converter",
        "celsius to fahrenheit",
        "cm to inches",
        "hex to rgb"
      ],
      featuredToolIds: [
        "storage-converter",
        "gb-to-mb-converter",
        "celsius-to-fahrenheit-converter",
        "cm-to-inches-converter"
      ],
      workflows: [
        {
          title: "Convert file sizes",
          description:
            "Move between KB, MB, GB and TB before uploading, storing or comparing files.",
          toolId: "storage-converter"
        },
        {
          title: "Switch measurement systems",
          description:
            "Translate metric and imperial values for dimensions, distance and weight.",
          toolId: "cm-to-inches-converter"
        },
        {
          title: "Translate color values",
          description:
            "Turn color codes into formats that fit CSS, design notes or implementation tickets.",
          toolId: "hex-to-rgb-converter"
        }
      ],
      useCases: [
        {
          title: "Technical handoff",
          description:
            "Normalize units before sharing specs, screenshots or implementation details."
        },
        {
          title: "Everyday comparisons",
          description:
            "Check sizes, temperatures and measurements without opening a spreadsheet."
        }
      ],
      faq: [
        {
          question: "Which converter should I open first?",
          answer:
            "Choose by the source value: storage for file sizes, temperature for weather values, and length or weight tools for physical measurements."
        },
        {
          question: "Are conversion results rounded?",
          answer:
            "Most tools show a practical rounded result while preserving enough precision for everyday planning and comparison."
        }
      ]
    },
    calculators: {
      eyebrow: "Calculator hub",
      title: "Calculators for finance, percentages and daily decisions",
      description:
        "Run focused calculations for percentages, loans, interest, discounts, tax and common planning numbers.",
      intro:
        "Use this calculator hub when the task is not just conversion but a decision based on a formula. The tools cover money, percentages, dates, pricing and health-related estimates with inputs designed for quick checks.",
      featuredSearches: [
        "percentage calculator",
        "loan payment calculator",
        "compound interest calculator",
        "discount calculator"
      ],
      featuredToolIds: [
        "percentage-calculator",
        "loan-payment-calculator",
        "compound-interest-calculator",
        "discount-calculator"
      ],
      workflows: [
        {
          title: "Compare finance scenarios",
          description:
            "Estimate payments, interest growth or pricing changes before choosing an option.",
          toolId: "loan-payment-calculator"
        },
        {
          title: "Work with percentages",
          description:
            "Calculate percentage share, increase, decrease or discount from the numbers you already have.",
          toolId: "percentage-calculator"
        },
        {
          title: "Check date spans",
          description:
            "Count days between milestones when planning billing, delivery or project timing.",
          toolId: "days-between-dates-calculator"
        }
      ],
      useCases: [
        {
          title: "Budget checks",
          description:
            "Review payments, discounts and tax before committing to a purchase or quote."
        },
        {
          title: "Planning estimates",
          description:
            "Turn rough numbers into a clear estimate that can be checked again later."
        }
      ],
      faq: [
        {
          question: "Are these calculators financial advice?",
          answer:
            "No. They provide planning estimates from the inputs you enter and should be checked against contracts, fees and local rules."
        },
        {
          question: "Why are calculators split into separate tools?",
          answer:
            "Separate tools keep the inputs clear, so a discount, loan payment or percentage change is less likely to be mixed up."
        }
      ]
    },
    generators: {
      eyebrow: "Generator hub",
      title: "Generators for passwords, QR codes, IDs and web snippets",
      description:
        "Create practical outputs such as passwords, QR codes, UUIDs, slugs, placeholders and metadata snippets.",
      intro:
        "This generator hub is for tasks where the useful output is created from a few choices rather than calculated from a fixed formula. Pick the generator that matches the asset or snippet you need, then copy the result into your workflow.",
      featuredSearches: [
        "password generator",
        "qr code generator",
        "uuid generator",
        "meta tag generator"
      ],
      featuredToolIds: [
        "password-generator",
        "qr-code-generator",
        "uuid-generator",
        "meta-tag-generator"
      ],
      workflows: [
        {
          title: "Create secure values",
          description:
            "Generate passwords or identifiers for accounts, tests and internal references.",
          toolId: "password-generator"
        },
        {
          title: "Build shareable codes",
          description:
            "Turn URLs, Wi-Fi details or text into a QR code that can be scanned from a screen or printout.",
          toolId: "qr-code-generator"
        },
        {
          title: "Prepare page snippets",
          description:
            "Draft metadata, slugs or placeholder assets before publishing a page.",
          toolId: "meta-tag-generator"
        }
      ],
      useCases: [
        {
          title: "Publishing prep",
          description:
            "Generate the small assets and snippets that are easy to forget before release."
        },
        {
          title: "Development support",
          description:
            "Create IDs, placeholders and repeatable values for tests, examples and demos."
        }
      ],
      faq: [
        {
          question: "Do generators save the values they create?",
          answer:
            "The tools are built for immediate browser workflows. Treat sensitive generated values as secrets after copying them."
        },
        {
          question: "Which generator is best for testing?",
          answer:
            "Use UUIDs for stable identifiers, placeholders for image slots, and slugs when testing URL or CMS behavior."
        }
      ]
    },
    "text-tools": {
      eyebrow: "Text hub",
      title: "Text tools for counting, cleanup and rewriting",
      description:
        "Count words, clean spacing, change case, reverse text and review keyword density in one text-focused hub.",
      intro:
        "This text tools hub helps when a block of copy needs to be measured, cleaned or reshaped before it goes into a document, CMS, message or technical workflow. Start with the operation you need and keep the original text nearby for comparison.",
      featuredSearches: [
        "word counter",
        "character counter",
        "case converter",
        "keyword density checker"
      ],
      featuredToolIds: [
        "word-counter",
        "character-counter",
        "case-converter",
        "keyword-density-checker"
      ],
      workflows: [
        {
          title: "Measure content length",
          description:
            "Count words, characters, lines or sentences before publishing or sending copy.",
          toolId: "word-counter"
        },
        {
          title: "Clean pasted text",
          description:
            "Remove extra spaces and normalize text that came from a document, email or CMS.",
          toolId: "remove-extra-spaces"
        },
        {
          title: "Review search terms",
          description:
            "Check repeated terms and density before editing a page or snippet.",
          toolId: "keyword-density-checker"
        }
      ],
      useCases: [
        {
          title: "Editorial checks",
          description:
            "Confirm length and structure before handing copy to a client, editor or CMS."
        },
        {
          title: "Text cleanup",
          description:
            "Fix spacing and casing problems after copying content between tools."
        }
      ],
      faq: [
        {
          question: "Do text tools change my source automatically?",
          answer:
            "No. Each tool shows an output you can review before copying it back into your own document or system."
        },
        {
          question: "Which counter should I use for limits?",
          answer:
            "Use character count for form and social limits, word count for articles, and line or sentence count for structure checks."
        }
      ]
    },
    "developer-tools": {
      eyebrow: "Developer hub",
      title: "Developer tools for JSON, URLs, Base64 and identifiers",
      description:
        "Format, validate, encode and decode common developer data without setting up a local script.",
      intro:
        "Use this developer tools hub for small data tasks that interrupt coding, testing or debugging. Paste the snippet, inspect the result, then move it back into your editor, API client or ticket.",
      featuredSearches: [
        "json formatter",
        "json validator",
        "base64 encoder",
        "url encoder"
      ],
      featuredToolIds: [
        "json-formatter",
        "json-validator",
        "base64-encoder",
        "url-encoder"
      ],
      workflows: [
        {
          title: "Inspect JSON",
          description:
            "Format or validate payloads before comparing API responses, fixtures or config values.",
          toolId: "json-formatter"
        },
        {
          title: "Encode transport values",
          description:
            "Prepare URL or Base64 values for query strings, headers and reproducible examples.",
          toolId: "url-encoder"
        },
        {
          title: "Create test identifiers",
          description:
            "Generate UUIDs for fixtures, logs and temporary records that need unique IDs.",
          toolId: "uuid-generator"
        }
      ],
      useCases: [
        {
          title: "API debugging",
          description:
            "Read and transform request data before sending it through a client or test suite."
        },
        {
          title: "Issue reproduction",
          description:
            "Prepare clean snippets that can be pasted into tickets, logs or documentation."
        }
      ],
      faq: [
        {
          question: "Should I paste secrets into developer tools?",
          answer:
            "Avoid pasting production secrets. Use the tools for test data, public snippets and values you are comfortable handling in the browser."
        },
        {
          question: "Why use a browser tool instead of a script?",
          answer:
            "For small one-off snippets, a focused browser tool is faster than creating a local file, command or temporary parser."
        }
      ]
    },
    "security-tools": {
      eyebrow: "Security hub",
      title: "Security tools for passwords and SHA-256 checks",
      description:
        "Generate passwords and calculate SHA-256 hashes for quick verification tasks.",
      intro:
        "This security tools hub is intentionally small today. It covers password generation and SHA-256 hashing, but it should not be treated as a broad security toolkit until more focused tools are added.",
      featuredSearches: [
        "password generator",
        "sha256 generator",
        "hash text sha256",
        "secure password"
      ],
      featuredToolIds: ["password-generator", "sha256-generator"],
      workflows: [
        {
          title: "Generate a password",
          description:
            "Create a strong value for a new account, test user or temporary credential.",
          toolId: "password-generator"
        },
        {
          title: "Calculate a hash",
          description:
            "Turn text into a SHA-256 digest when comparing checksums or examples.",
          toolId: "sha256-generator"
        }
      ],
      useCases: [
        {
          title: "Credential setup",
          description:
            "Create a password value, then store it immediately in a password manager."
        },
        {
          title: "Digest comparison",
          description:
            "Check whether two text inputs produce the same SHA-256 fingerprint."
        }
      ],
      faq: [
        {
          question: "Why is this category not a full security suite?",
          answer:
            "It currently has only two focused tools, so broader security workflows should use specialized software."
        },
        {
          question: "Is SHA-256 encryption?",
          answer:
            "No. SHA-256 is a one-way hash function, which means the original text cannot be decoded from the digest."
        }
      ]
    }
  }
};

const localizedCategoryBriefs: Partial<
  Record<Locale, Partial<Record<ToolCategory, CuratedCategoryBrief>>>
> = {
  pl: {
    converters: {
      ...curatedCategoryBriefs.en.converters!,
      eyebrow: "Hub konwerterow",
      title: "Konwertery jednostek, plikow i codziennych miar",
      description:
        "Przeliczaj jednostki, rozmiary plikow, kolory i temperature w konkretnych narzedziach online.",
      intro:
        "Ten hub konwerterow pomaga wtedy, gdy liczbe, jednostke albo format trzeba szybko zamienic na praktyczny wynik. Zacznij od typu danych, ktore masz, a potem wybierz narzedzie dla docelowej jednostki.",
      featuredSearches: ["gb na mb", "celsjusz na fahrenheit", "cm na cale", "hex na rgb"],
      useCases: [
        {
          title: "Przekazanie specyfikacji",
          description:
            "Ujednolic jednostki przed przekazaniem wymiarow, plikow albo wartosci do wdrozenia."
        },
        {
          title: "Szybkie porownania",
          description:
            "Sprawdz rozmiary, temperature i miary bez budowania arkusza kalkulacyjnego."
        }
      ]
    },
    calculators: {
      ...curatedCategoryBriefs.en.calculators!,
      eyebrow: "Hub kalkulatorow",
      title: "Kalkulatory do finansow, procentow i codziennych decyzji",
      description:
        "Licz procenty, raty, odsetki, rabaty, podatki i typowe wartosci potrzebne do planowania.",
      intro:
        "Uzyj tego huba, gdy nie chodzi o sama konwersje, tylko o decyzje oparta na wzorze. Narzedzia obejmuja pieniadze, procenty, daty, ceny i szacunki zdrowotne.",
      featuredSearches: [
        "kalkulator procentowy",
        "kalkulator raty kredytu",
        "kalkulator procentu skladanego",
        "kalkulator rabatu"
      ]
    },
    generators: {
      ...curatedCategoryBriefs.en.generators!,
      eyebrow: "Hub generatorow",
      title: "Generatory hasel, kodow QR, identyfikatorow i snippetow",
      description:
        "Tworz hasla, kody QR, UUID, slugi, placeholdery i metadane do szybkiej pracy.",
      intro:
        "Ten hub generatorow jest dla zadan, w ktorych wynik powstaje z kilku ustawien, a nie z jednego wzoru. Wybierz typ assetu albo snippetu i skopiuj gotowy rezultat.",
      featuredSearches: [
        "generator hasel",
        "generator kodow qr",
        "generator uuid",
        "generator meta tagow"
      ]
    },
    "text-tools": {
      ...curatedCategoryBriefs.en["text-tools"]!,
      eyebrow: "Hub tekstu",
      title: "Narzedzia tekstowe do liczenia, czyszczenia i przerabiania",
      description:
        "Licz slowa, usuwaj nadmiarowe spacje, zmieniaj wielkosc liter i sprawdzaj gestosc slow kluczowych.",
      intro:
        "Ten hub pomaga, gdy fragment tekstu trzeba zmierzyc, oczyscic albo przeksztalcic przed dodaniem do dokumentu, CMS, wiadomosci lub workflow technicznego.",
      featuredSearches: [
        "licznik slow",
        "licznik znakow",
        "zmiana wielkosci liter",
        "gestosc slow kluczowych"
      ]
    },
    "developer-tools": {
      ...curatedCategoryBriefs.en["developer-tools"]!,
      eyebrow: "Hub deweloperski",
      title: "Narzedzia deweloperskie do JSON, URL, Base64 i ID",
      description:
        "Formatuj, waliduj, koduj i dekoduj typowe dane deweloperskie bez pisania lokalnego skryptu.",
      intro:
        "Uzyj tego huba do malych zadan z danymi, ktore przerywaja kodowanie, testy albo debugowanie. Wklej snippet, sprawdz wynik i przenies go do edytora lub klienta API.",
      featuredSearches: [
        "json formatter",
        "walidator json",
        "base64 encoder",
        "url encoder"
      ]
    },
    "security-tools": {
      ...curatedCategoryBriefs.en["security-tools"]!,
      eyebrow: "Hub bezpieczenstwa",
      title: "Narzedzia bezpieczenstwa do hasel i SHA-256",
      description:
        "Generuj hasla i licz hashe SHA-256 do szybkiej weryfikacji tekstu.",
      intro:
        "Ten hub bezpieczenstwa jest dzis celowo maly. Obejmuje generator hasel i SHA-256, ale nie powinien udawac pelnego zestawu security tools.",
      featuredSearches: [
        "generator hasel",
        "generator sha256",
        "hash tekstu sha256",
        "bezpieczne haslo"
      ]
    }
  }
};

const localeFallbackBriefLabels: Record<Exclude<Locale, "en" | "pl">, Partial<Record<ToolCategory, {
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  searches: string[];
}>>> = {
  de: {
    converters: {
      eyebrow: "Umrechner-Hub",
      title: "Umrechner fuer Einheiten, Dateien und Messwerte",
      description:
        "Rechne Speichergroessen, Temperaturen, Farben und Alltagsmasse mit fokussierten Browser-Tools um.",
      intro:
        "Dieser Hub hilft, wenn eine Zahl oder Einheit schnell in ein nutzbares Format wechseln muss.",
      searches: ["gb zu mb", "celsius in fahrenheit", "cm in zoll", "hex in rgb"]
    },
    calculators: {
      eyebrow: "Rechner-Hub",
      title: "Rechner fuer Finanzen, Prozente und Planung",
      description:
        "Berechne Prozente, Raten, Zinsen, Rabatte und typische Planungswerte.",
      intro:
        "Nutze diesen Hub fuer Aufgaben, bei denen eine Formel eine Entscheidung oder Schaetzung vorbereitet.",
      searches: ["prozentrechner", "kreditrechner", "zinseszins rechner", "rabatt rechner"]
    },
    generators: {
      eyebrow: "Generator-Hub",
      title: "Generatoren fuer Passwoerter, QR-Codes, IDs und Snippets",
      description:
        "Erzeuge Passwoerter, QR-Codes, UUIDs, Slugs, Platzhalter und Meta-Snippets.",
      intro:
        "Dieser Hub sammelt Generatoren fuer Werte und Assets, die schnell erstellt und kopiert werden muessen.",
      searches: ["passwort generator", "qr code generator", "uuid generator", "meta tag generator"]
    },
    "text-tools": {
      eyebrow: "Text-Hub",
      title: "Text-Tools zum Zaehlen, Bereinigen und Umformen",
      description:
        "Zaehle Woerter, pruefe Zeichen, bereinige Leerzeichen und kontrolliere Keyword-Dichte.",
      intro:
        "Dieser Hub hilft, Text vor der Veroeffentlichung, Uebergabe oder technischen Nutzung zu pruefen.",
      searches: ["wortzaehler", "zeichenzahler", "case converter", "keyword dichte"]
    },
    "developer-tools": {
      eyebrow: "Developer-Hub",
      title: "Developer-Tools fuer JSON, URLs, Base64 und IDs",
      description:
        "Formatiere, validiere, enkodiere und dekodiere typische Entwicklerdaten im Browser.",
      intro:
        "Nutze diesen Hub fuer kleine Datenaufgaben beim Debugging, Testen oder Dokumentieren.",
      searches: ["json formatter", "json validator", "base64 encoder", "url encoder"]
    },
    "security-tools": {
      eyebrow: "Security-Hub",
      title: "Security-Tools fuer Passwoerter und SHA-256",
      description:
        "Erzeuge Passwoerter und berechne SHA-256-Hashes fuer schnelle Pruefungen.",
      intro:
        "Dieser Hub ist bewusst klein und deckt aktuell Passworterstellung sowie SHA-256-Vergleiche ab.",
      searches: ["passwort generator", "sha256 generator", "text hashen", "sicheres passwort"]
    },
    "construction-calculators": {
      eyebrow: "Bau-Hub",
      title: "Bau-Rechner fuer Materialmengen und Planung",
      description:
        "Schaetze Beton, Dach, Daemmung, Fliesen und Ausbau-Materialien fuer Bauprojekte.",
      intro:
        "Dieser Hub buendelt Rechner fuer Materialmengen und schnelle Plausibilitaetspruefungen.",
      searches: ["beton rechner", "dach rechner", "daemmung rechner", "fliesen rechner"]
    }
  },
  es: {
    converters: {
      eyebrow: "Hub de conversores",
      title: "Conversores para unidades, archivos y medidas diarias",
      description:
        "Convierte almacenamiento, temperatura, colores y medidas comunes con herramientas del navegador.",
      intro:
        "Este hub ayuda cuando un numero, unidad o formato debe convertirse en una salida mas util.",
      searches: ["gb a mb", "celsius a fahrenheit", "cm a pulgadas", "hex a rgb"]
    },
    calculators: {
      eyebrow: "Hub de calculadoras",
      title: "Calculadoras para finanzas, porcentajes y planificacion",
      description:
        "Calcula porcentajes, cuotas, intereses, descuentos e importes habituales.",
      intro:
        "Usa este hub cuando la tarea depende de una formula y necesitas comparar resultados.",
      searches: ["calculadora porcentaje", "calculadora prestamo", "interes compuesto", "calculadora descuento"]
    },
    generators: {
      eyebrow: "Hub de generadores",
      title: "Generadores de contrasenas, QR, IDs y snippets",
      description:
        "Crea contrasenas, codigos QR, UUID, slugs, placeholders y metadatos.",
      intro:
        "Este hub reune generadores para salidas que se crean desde unas pocas opciones.",
      searches: ["generador contrasenas", "generador qr", "generador uuid", "generador meta tags"]
    },
    "text-tools": {
      eyebrow: "Hub de texto",
      title: "Herramientas de texto para contar, limpiar y transformar",
      description:
        "Cuenta palabras, revisa caracteres, limpia espacios y comprueba densidad de terminos.",
      intro:
        "Este hub ayuda a preparar texto antes de publicarlo, enviarlo o moverlo a otro sistema.",
      searches: ["contador palabras", "contador caracteres", "convertir mayusculas", "densidad palabras clave"]
    },
    "developer-tools": {
      eyebrow: "Hub developer",
      title: "Herramientas developer para JSON, URL, Base64 e IDs",
      description:
        "Formatea, valida, codifica y decodifica datos tecnicos comunes desde el navegador.",
      intro:
        "Usa este hub para pequenas tareas de datos durante depuracion, pruebas o documentacion.",
      searches: ["json formatter", "json validator", "base64 encoder", "url encoder"]
    },
    "security-tools": {
      eyebrow: "Hub de seguridad",
      title: "Herramientas de seguridad para contrasenas y SHA-256",
      description:
        "Genera contrasenas y calcula hashes SHA-256 para verificaciones rapidas.",
      intro:
        "Este hub es deliberadamente pequeno y cubre contrasenas y SHA-256 hasta ampliar la categoria.",
      searches: ["generador contrasenas", "generador sha256", "hash texto", "contrasena segura"]
    },
    "construction-calculators": {
      eyebrow: "Hub de construccion",
      title: "Calculadoras de construccion para materiales y planificacion",
      description:
        "Estima hormigon, tejado, aislamiento, azulejos y materiales de obra.",
      intro:
        "Este hub agrupa calculadoras para estimar cantidades antes de comprar o comparar presupuestos.",
      searches: ["calculadora hormigon", "calculadora tejado", "calculadora aislamiento", "calculadora azulejos"]
    },
    "html-tools": {
      eyebrow: "Hub HTML",
      title: "Herramientas HTML para formato, extraccion y limpieza",
      description:
        "Formatea, valida, convierte y extrae datos de HTML en flujos de trabajo de marcado.",
      intro:
        "Este hub HTML ayuda a pasar de marcado desordenado a una salida legible y reutilizable.",
      searches: ["formatear html", "html pretty", "extraer enlaces html", "html a markdown"]
    },
    "image-tools": {
      eyebrow: "Hub de imagen",
      title: "Herramientas de imagen para redimensionar, comprimir y exportar",
      description:
        "Prepara imagenes con compresion, recorte, conversion y lectura de metadatos.",
      intro:
        "Este hub reune tareas frecuentes para preparar imagenes antes de publicarlas o compartirlas.",
      searches: ["comprimir imagen", "redimensionar imagen", "convertir imagen", "recortar imagen"]
    }
  },
  fr: {
    converters: {
      eyebrow: "Hub convertisseurs",
      title: "Convertisseurs pour unites, fichiers et mesures courantes",
      description:
        "Convertissez stockage, temperature, couleurs et mesures avec des outils de navigateur.",
      intro:
        "Ce hub aide lorsqu'un nombre, une unite ou un format doit devenir une sortie plus utile.",
      searches: ["gb en mb", "celsius en fahrenheit", "cm en pouces", "hex en rgb"]
    },
    calculators: {
      eyebrow: "Hub calculateurs",
      title: "Calculateurs pour finances, pourcentages et planification",
      description:
        "Calculez pourcentages, mensualites, interets, remises et valeurs de planification.",
      intro:
        "Utilisez ce hub lorsqu'une formule aide a comparer des options ou preparer une estimation.",
      searches: ["calculateur pourcentage", "calculateur pret", "interets composes", "calculateur remise"]
    },
    generators: {
      eyebrow: "Hub generateurs",
      title: "Generateurs de mots de passe, QR, IDs et snippets",
      description:
        "Creez mots de passe, QR codes, UUID, slugs, placeholders et metadonnees.",
      intro:
        "Ce hub rassemble les generateurs utiles quand une sortie doit etre creee puis copiee.",
      searches: ["generateur mot de passe", "generateur qr", "generateur uuid", "generateur meta tags"]
    },
    "text-tools": {
      eyebrow: "Hub texte",
      title: "Outils texte pour compter, nettoyer et transformer",
      description:
        "Comptez les mots, verifiez les caracteres, nettoyez les espaces et controlez les termes.",
      intro:
        "Ce hub aide a preparer un texte avant publication, envoi ou migration vers un autre outil.",
      searches: ["compteur mots", "compteur caracteres", "convertir casse", "densite mots cles"]
    },
    "developer-tools": {
      eyebrow: "Hub developpeur",
      title: "Outils developpeur pour JSON, URL, Base64 et IDs",
      description:
        "Formatez, validez, encodez et decodez des donnees techniques courantes dans le navigateur.",
      intro:
        "Utilisez ce hub pour les petites taches de donnees pendant debug, tests ou documentation.",
      searches: ["json formatter", "json validator", "base64 encoder", "url encoder"]
    },
    "security-tools": {
      eyebrow: "Hub securite",
      title: "Outils securite pour mots de passe et SHA-256",
      description:
        "Generez des mots de passe et calculez des hashes SHA-256 pour des verifications rapides.",
      intro:
        "Ce hub reste volontairement limite et couvre les mots de passe ainsi que SHA-256.",
      searches: ["generateur mot de passe", "generateur sha256", "hash texte", "mot de passe fort"]
    },
    "construction-calculators": {
      eyebrow: "Hub construction",
      title: "Calculateurs de construction pour materiaux et planification",
      description:
        "Estimez beton, toiture, isolation, carrelage et materiaux de chantier.",
      intro:
        "Ce hub regroupe des calculateurs pour verifier les quantites avant achat ou devis.",
      searches: ["calculateur beton", "calculateur toiture", "calculateur isolation", "calculateur carrelage"]
    },
    "html-tools": {
      eyebrow: "Hub HTML",
      title: "Outils HTML pour formatage, extraction et nettoyage",
      description:
        "Formatez, validez, convertissez et extrayez des donnees HTML pour vos workflows.",
      intro:
        "Ce hub HTML aide a transformer un markup difficile a lire en sortie exploitable.",
      searches: ["formater html", "html pretty", "extraire liens html", "html vers markdown"]
    },
    "image-tools": {
      eyebrow: "Hub image",
      title: "Outils image pour redimensionner, compresser et exporter",
      description:
        "Preparez vos images avec compression, recadrage, conversion et lecture de metadonnees.",
      intro:
        "Ce hub rassemble les taches frequentes pour preparer des images avant publication.",
      searches: ["compresser image", "redimensionner image", "convertir image", "recadrer image"]
    }
  }
};

function buildLocalizedBrief(
  locale: Exclude<Locale, "en" | "pl">,
  category: ToolCategory
): CategoryHubContent | null {
  const labels = localeFallbackBriefLabels[locale][category];
  const base = curatedCategoryBriefs.en[category] ?? categoryHubContent.en?.[category];

  if (!labels || !base) {
    return null;
  }

  return {
    ...base,
    eyebrow: labels.eyebrow,
    title: labels.title,
    description: labels.description,
    intro: `${labels.intro} ${labels.description}`,
    featuredSearches: labels.searches
  };
}

export function buildStorageHubHref(locale: Locale) {
  return storageHubContent[locale]?.slug ? `/${locale}/${storageHubContent[locale].slug}` : null;
}

export function getStorageHubContent(locale: Locale) {
  return storageHubContent[locale] ?? null;
}

export function getCategoryHubContent(locale: Locale, category: ToolCategory) {
  const generated = generatedCategoryContent[category]?.[locale];

  if (generated) {
    return generated;
  }

  const manual = categoryHubContent[locale]?.[category];

  if (manual) {
    return manual;
  }

  const curated =
    curatedCategoryBriefs[locale]?.[category] ??
    localizedCategoryBriefs[locale]?.[category];

  if (curated) {
    return curated;
  }

  if (locale !== "en" && locale !== "pl") {
    return buildLocalizedBrief(locale, category);
  }

  return null;
}

export function hasIndexableCategoryHubContent(locale: Locale, category: ToolCategory) {
  return Boolean(
    generatedCategoryContent[category]?.[locale] ??
      categoryHubContent[locale]?.[category] ??
      curatedCategoryBriefs[locale]?.[category] ??
      localizedCategoryBriefs[locale]?.[category]
  );
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
