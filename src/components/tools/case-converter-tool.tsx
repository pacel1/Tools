"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runCaseConverter } from "@/tools/logic/case-converter";

const labels = {
  "en": {
    "text": "Text",
    "upper": "UPPER CASE",
    "lower": "lower case",
    "title": "Title Case",
    "sentence": "Sentence case"
  },
  "pl": {
    "text": "Tekst",
    "upper": "WIELKIE LITERY",
    "lower": "male litery",
    "title": "Kazde Slowo Wielka Litera",
    "sentence": "Zdanie"
  },
  "es": {
    "text": "Texto",
    "upper": "MAYUSCULAS",
    "lower": "minusculas",
    "title": "Tipo Titulo",
    "sentence": "Tipo frase"
  },
  "de": {
    "text": "Text",
    "upper": "GROSSBUCHSTABEN",
    "lower": "kleinbuchstaben",
    "title": "Titelgrossschreibung",
    "sentence": "Satzschreibung"
  },
  "fr": {
    "text": "Texte",
    "upper": "MAJUSCULES",
    "lower": "minuscules",
    "title": "Style Titre",
    "sentence": "Style phrase"
  }
} as const;

export default function CaseConverterTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [text, setText] = useState("best seo tool page title");
  const result = useMemo(() => runCaseConverter({ text }), [text]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="case-converter-text">{t.text}</label>
        <textarea id="case-converter-text" className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <ResultCard label={t.upper} value={result.upper} />
        <ResultCard label={t.lower} value={result.lower} />
        <ResultCard label={t.title} value={result.title} />
        <ResultCard label={t.sentence} value={result.sentence} />
      </div>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-2 break-words text-base font-medium text-white">{value}</p>
    </div>
  );
}
