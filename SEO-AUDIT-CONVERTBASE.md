# SEO Audit — ConvertBase.app
**Data audytu:** 27 maja 2026  
**Stan:** ~0 zaindeksowanych stron, 0 impressions (od ok. 27 kwietnia 2026)  
**Stack:** Next.js 15 / App Router, next-intl, Vercel, 107 narzędzi, 5 języków (en/pl/es/de/fr)

---

## 🔴 DIAGNOZA — DLACZEGO GOOGLE ZDEINDEKSOWAŁO STRONĘ

### Główna przyczyna: duplikat treści non-www vs www

Google indeksował **dwie wersje strony jednocześnie**:
- `https://convertbase.app/en/converters/gb-to-mb-converter` (non-www)
- `https://www.convertbase.app/en/converters/gb-to-mb-converter` (www)

**Dowód z GSC Strony.csv** — wszystkie zaindeksowane URL-e miały postać `convertbase.app/...` (bez www), mimo że kod generuje canonical z `https://www.convertbase.app`. Google widział:

> "Canonical mówi www, ale indeksowałem non-www od początku i strona jest dostępna pod oboma adresami."

Przy 107 narzędzi × 5 języków = **535 duplikatów stron**. Google potraktował to jako thin/duplicate content i zdeindeksował.

**Dlaczego przekierowanie nie działało dla wszystkich ścieżek:**

Stary matcher w `middleware.ts`:
```ts
matcher: ["/", "/(en|pl|es|de|fr)/:path*"]
```

Ścieżki **POZA** matcherem = brak przekierowania non-www → www:
- `/sitemap.xml` → Google crawlował sitemap z obu domen
- `/robots.txt`
- Wszelkie inne ścieżki bez locale (np. po błędach 404)

---

## ✅ ZMIANY WDROŻONE W TYM AUDYCIE

### Fix #1 — `middleware.ts` (KRYTYCZNY)
Rozszerzono matcher aby obejmował **wszystkie ścieżki** włącznie z `/sitemap.xml` i `/robots.txt`:

```ts
// PRZED
matcher: ["/", "/(en|pl|es|de|fr)/:path*"]

// PO
matcher: [
  "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|ico|svg|css|js|woff2?|ttf|eot)$).*)"
]
```

### Fix #2 — `src/lib/seo/sitemap-entries.ts`
Dodano `lastModified: BUILD_DATE` do wszystkich wpisów sitemapy. Google używa tego pola do oceny świeżości treści i alokacji crawl budget.

### Fix #3 — `src/lib/seo/structured-data.ts`
- Dodano schema `SoftwareApplication` dla każdego narzędzia (otwiera drogę do rich results)
- Dodano `author` w `WebPage` schema (sygnał EEAT)
- Poprawiono `homeName` per-locale (wcześniej de/es/fr miały angielskie "Home")

### Fix #4 — `.env`
Zmieniono `SITE_URL=https://example.com` → `SITE_URL=http://localhost:3000`.  
Przy starym ustawieniu lokalny `sitemap.xml` i canonical wskazywały na `example.com` — mylące przy debugowaniu.

---

## 📋 PRIORYTETOWANA LISTA ZADAŃ

### PRIORYTET 1 — Wykonaj natychmiast (przed następnym deployem)

**[ ] 1. Wdróż obecne zmiany na Vercel**
- Zrób deploy z powyższymi fixami
- Sprawdź że `curl -I https://convertbase.app/sitemap.xml` zwraca 301 → `www.convertbase.app/sitemap.xml`

**[ ] 2. Vercel Dashboard → Domains — ustaw redirect na poziomie infrastruktury**
- Wejdź w Vercel → Project → Settings → Domains
- Dodaj obie domeny: `convertbase.app` i `www.convertbase.app`
- Ustaw `convertbase.app` jako "Redirect to www.convertbase.app" (301)
- To jest backup dla middleware — działa nawet jeśli Next.js zwróci błąd

**[ ] 3. Google Search Console — skonfiguruj oba properties**
- Zweryfikuj `https://www.convertbase.app` jako osobny property (jeśli jeszcze nie masz)
- W GSC dla `www.convertbase.app`: Sitemaps → Dodaj `https://www.convertbase.app/sitemap.xml`
- Usuń stary sitemap z `convertbase.app` jeśli był dodany

**[ ] 4. Google Search Console — Usuwanie URL-i non-www**
- W GSC → Removals → New Request (tymczasowe usunięcie non-www wersji)
- Dodaj: `https://convertbase.app/` (prefix removal) aby wyczyścić stary indeks non-www
- To przyspieszy reindeksację — bez tego Google może trzymać cache non-www przez miesiące

**[ ] 5. URL Inspection → Request indexing dla kluczowych stron**
Po deploy, użyj URL Inspection w GSC i kliknij "Request indexing" dla:
- `https://www.convertbase.app/en`
- `https://www.convertbase.app/en/converters/gb-to-mb-converter` (były top page)
- `https://www.convertbase.app/pl/converters/konwerter-gb-na-mb`
- `https://www.convertbase.app/de/image-tools/bildkomprimierer`
- `https://www.convertbase.app/en/generators/css-gradient-generator`
- `https://www.convertbase.app/en/html-tools/html-link-extractor`

---

### PRIORYTET 2 — Następny sprint (1-2 tygodnie)

**[ ] 6. Popraw content na stronach z najlepszymi pozycjami z GSC**

Z Zapytania.csv strona ma już pewne pozycje w Google (tylko za niskie by klikano):

| Zapytanie | Pozycja | Strona do optymalizacji |
|---|---|---|
| `kalkulator cen jednostkowych` | 14.67 | `/pl/calculators/kalkulator-ceny-za-jednostke` |
| `zollumrechner` | 27.86 | `/de/converters/cm-zu-zoll-umrechner` |
| `km na mile` | 33.33 | `/pl/converters/kalkulator-km-na-mile` |
| `konwerter mb na gb` | 21.45 | `/pl/converters/konwerter-mb-na-gb` |
| `calcul augmentation pourcentage` | 39.83 | `/fr/calculators/...` |

Dla każdej z tych stron: rozbuduj H1, dodaj intro paragraph z naturalnym użyciem frazy kluczowej, dodaj tabelę przykładów.

**[ ] 7. Rozszerz AuthorBanner na strony kategorii**
Aktualnie `AuthorBanner` jest tylko na stronach narzędzi. Dodaj go też do `[locale]/[category]/page.tsx` — wzmocni EEAT dla stron hubów kategorii.

```tsx
// W CategoryPage component, przed zamknięciem głównego div:
import { AuthorBanner } from "@/components/AuthorBanner";
// ...
<AuthorBanner locale={locale} />
```

**[ ] 8. Dodaj zdjęcie autora do public/**
Plik `author-pawel-celinski.webp` jest referencjonowany w strukturze strony. Sprawdź czy:
- Plik istnieje i jest ostry (min 200x200px)
- Jest dostępny pod `https://www.convertbase.app/author-pawel-celinski.webp`
- Jest używany w `eeat-structured-data.ts` (sameAs LinkedIn, jobTitle są OK)

**[ ] 9. Popraw robots.ts — dodaj explicit disallow dla duplikatów**
```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"]
      }
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl()
  };
}
```

**[ ] 10. Sprawdź i wzmocnij hreflang**
Aktualnie `x-default` jest ustawiony na `/en` co jest poprawne. Zweryfikuj w GSC po reindeksacji że hreflang nie zwraca błędów.

---

### PRIORYTET 3 — Wzrost ruchu organicznego (miesiąc+)

**[ ] 11. Luki contentowe — tematy bez pokrycia**

Strona ma narzędzia ale brakuje stron "answer pages" dla zapytań informacyjnych. Przykłady:
- "how many MB in a GB" → `/en/converters/gb-to-mb-converter` powinno mieć sekcję odpowiadającą wprost
- "how to convert inches to cm" → odpowiedź w intro
- "zoll umrechnen tabelle" → tabela przeliczeniowa w treści narzędzia

**[ ] 12. Internal linking — dodaj linki kontekstowe w treści**
Każda strona narzędzia powinna linkować do 3-5 powiązanych narzędzi **w treści artykułu** (nie tylko w sidebarze "Related tools"). Google ceni linki kontekstowe wyżej niż nawigacyjne.

**[ ] 13. Budowanie linków zewnętrznych**
Strona ma praktycznie 0 backlinków. Priorytetowe strategie:
- Zgłoś narzędzia do katalogów: Product Hunt, AlternativeTo, Capterra (free tools)
- Napisz do 5 blogów technicznych (PL/DE/EN) proponując wzmiankę o narzędziach budowlanych (`kalkulator-betonu`, `kalkulator-plytek` etc.)
- Reddit: r/webdev, r/Poland — share narzędzia bez spamu, z wartością

**[ ] 14. Rozszerz pokrycie słów kluczowych**
Top queries z GSC są mocno niszowe (pozycja 14-90). Nowe narzędzia z potencjałem:
- `procent kalkulator` (duży wolumen PL)
- `kalkulator BMI` (jest w repo! — sprawdź pokrycie treści)
- `json formatter online` (duży wolumen EN, masz narzędzie)
- `html formatter` (masz, pozycja ~69 — wzmocnij content)

**[ ] 15. PageSpeed — mobile**
GSC pokazuje mobile pozycja 36 vs desktop 59 — mobile rankings są LEPSZE. Oznacza to że mobile ma mniej konkurencji dla Twoich queries, warto zoptymalizować pod mobile first:
- Sprawdź Core Web Vitals dla mobile w PageSpeed Insights
- Upewnij się że narzędzia są w pełni funkcjonalne na telefonie

---

## 📅 PLAN POWROTU DO INDEKSU (timeline)

```
Tydzień 1 (teraz):
├── Deploy fixów z tego audytu
├── Vercel domain redirect (panel)
├── GSC: dodaj sitemap www, usuń non-www URLs
└── GSC: request indexing dla 5-6 kluczowych stron

Tydzień 2-3:
├── Monitoruj GSC Coverage report
├── Powinny pojawić się pierwsze zaindeksowane strony
└── Rozbuduj content dla top-10 stron z GSC (pozycja < 50)

Tydzień 4-6:
├── Pierwsze kliknięcia powinny wrócić
├── Dodaj AuthorBanner na kategorii
└── Zacznij budować linki zewnętrzne

Miesiąc 2-3:
├── Pełna reindeksacja (Google potrzebuje czasu po karze/deindeksacji)
├── Skup się na keywords z pozycją 10-30 (najłatwiejsze do "wbicia na 1 stronę")
└── Target: 100+ clicks/day
```

---

## 🔍 METRYKI DO ŚLEDZENIA W GSC

Po wdrożeniu monitoruj co 3-5 dni:
1. **Coverage** → Valid pages (powinna rosnąć od 0)
2. **Performance** → Impressions (powinna rosnąć zanim wzrosną kliknięcia)
3. **Coverage → Excluded** → sprawdź czy nie ma "Duplicate without user-selected canonical"
4. **Enhancements → FAQ** → po reindeksacji FAQ rich results powinny się pojawić
5. **Links → Top linked pages** → weryfikacja internal linking

---

## ⚠️ RZECZY KTÓRYCH NIE ROBIĆ

- **Nie dodawaj nowych narzędzi** dopóki stare nie wrócą do indeksu — to rozmywa crawl budget
- **Nie zmieniaj URL-i narzędzi** — 301 redirect history jest ważna
- **Nie używaj noindex na stronach narzędzi** — nawet jeśli content jest cienki
- **Nie zmieniaj domeny** — obecna www.convertbase.app jest właściwą wersją

---

*Wygenerowano przez audyt SEO z analizą kodu i danych GSC (kwiecień 2026)*
