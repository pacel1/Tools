"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { countWords } from "@/tools/logic/word-counter";

const labels = {
  en: {
    text: "Text",
    words: "Words",
    characters: "Characters",
    noSpaces: "Characters without spaces",
    reading: "Reading time"
  },
  pl: {
    text: "Tekst",
    words: "Słowa",
    characters: "Znaki",
    noSpaces: "Znaki bez spacji",
    reading: "Czas czytania"
  },
  es: {
    text: "Texto",
    words: "Palabras",
    characters: "Caracteres",
    noSpaces: "Caracteres sin espacios",
    reading: "Tiempo de lectura"
  },
  de: {
    text: "Text",
    words: "Wörter",
    characters: "Zeichen",
    noSpaces: "Zeichen ohne Leerzeichen",
    reading: "Lesezeit"
  },
  fr: {
    text: "Texte",
    words: "Mots",
    characters: "Caracteres",
    noSpaces: "Caracteres sans espaces",
    reading: "Temps de lecture"
  }
} as const;

export function WordCounterTool() {
  const locale = useLocale() as keyof typeof labels;
  const [text, setText] = useState(
    "Count words, estimate reading time and measure text length in one place."
  );

  const result = countWords({ text });

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="text">
          {labels[locale].text}
        </label>
        <textarea
          id="text"
          className="min-h-44 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard label={labels[locale].words} value={String(result.words)} />
        <MetricCard label={labels[locale].characters} value={String(result.characters)} />
        <MetricCard label={labels[locale].noSpaces} value={String(result.charactersNoSpaces)} />
        <MetricCard
          label={labels[locale].reading}
          value={`${result.readingTimeMinutes.toFixed(2)} min`}
        />
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

export default WordCounterTool;
