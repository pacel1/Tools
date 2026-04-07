"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runKeywordDensityChecker } from "@/tools/logic/keyword-density-checker";

const labels = {
  "en": {
    "text": "Text",
    "keyword": "Keyword",
    "density": "Density",
    "occurrences": "Occurrences",
    "totalWords": "Total words"
  },
  "pl": {
    "text": "Tekst",
    "keyword": "Slowo kluczowe",
    "density": "Gestosc",
    "occurrences": "Wystapienia",
    "totalWords": "Liczba slow"
  },
  "es": {
    "text": "Texto",
    "keyword": "Palabra clave",
    "density": "Densidad",
    "occurrences": "Apariciones",
    "totalWords": "Total de palabras"
  },
  "de": {
    "text": "Text",
    "keyword": "Schluesselwort",
    "density": "Dichte",
    "occurrences": "Vorkommen",
    "totalWords": "Woerter gesamt"
  },
  "fr": {
    "text": "Texte",
    "keyword": "Mot cle",
    "density": "Densite",
    "occurrences": "Occurrences",
    "totalWords": "Nombre de mots"
  }
} as const;

export default function KeywordDensityCheckerTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [text, setText] = useState("SEO tools improve organic traffic when each keyword appears naturally in the text. SEO content should stay readable.");
  const [keyword, setKeyword] = useState("seo");
  const result = useMemo(() => runKeywordDensityChecker({ text, keyword }), [text, keyword]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="keyword-density-checker-text">{t.text}</label>
        <textarea id="keyword-density-checker-text" className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="keyword-density-checker-keyword">{t.keyword}</label>
        <input id="keyword-density-checker-keyword" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label={t.density} value={result.formatted} />
        <MetricCard label={t.occurrences} value={String(result.secondary)} />
        <MetricCard label={t.totalWords} value={String(result.tertiary)} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
