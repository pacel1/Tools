"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runCharacterCounter } from "@/tools/logic/character-counter";

const labels = {
  "en": {
    "text": "Text",
    "labelOne": "Characters",
    "labelTwo": "No spaces",
    "labelThree": "Words"
  },
  "pl": {
    "text": "Tekst",
    "labelOne": "Znaki",
    "labelTwo": "Bez spacji",
    "labelThree": "Slowa"
  },
  "es": {
    "text": "Texto",
    "labelOne": "Caracteres",
    "labelTwo": "Sin espacios",
    "labelThree": "Palabras"
  },
  "de": {
    "text": "Text",
    "labelOne": "Zeichen",
    "labelTwo": "Ohne Leerzeichen",
    "labelThree": "Woerter"
  },
  "fr": {
    "text": "Texte",
    "labelOne": "Caracteres",
    "labelTwo": "Sans espaces",
    "labelThree": "Mots"
  }
} as const;

export default function CharacterCounterTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [text, setText] = useState("Write or paste text here to analyze the content instantly.");
  const result = useMemo(() => runCharacterCounter({ text }), [text]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="character-counter-text">{t.text}</label>
        <textarea id="character-counter-text" className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label={t.labelOne} value={String(result.primary)} />
        <MetricCard label={t.labelTwo} value={String(result.secondary)} />
        <MetricCard label={t.labelThree} value={String(result.tertiary)} />
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
