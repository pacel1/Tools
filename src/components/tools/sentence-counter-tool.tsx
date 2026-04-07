"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runSentenceCounter } from "@/tools/logic/sentence-counter";

const labels = {
  "en": {
    "text": "Text",
    "labelOne": "Sentences",
    "labelTwo": "Words",
    "labelThree": "Characters"
  },
  "pl": {
    "text": "Tekst",
    "labelOne": "Zdania",
    "labelTwo": "Slowa",
    "labelThree": "Znaki"
  },
  "es": {
    "text": "Texto",
    "labelOne": "Frases",
    "labelTwo": "Palabras",
    "labelThree": "Caracteres"
  },
  "de": {
    "text": "Text",
    "labelOne": "Saetze",
    "labelTwo": "Woerter",
    "labelThree": "Zeichen"
  },
  "fr": {
    "text": "Texte",
    "labelOne": "Phrases",
    "labelTwo": "Mots",
    "labelThree": "Caracteres"
  }
} as const;

export default function SentenceCounterTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [text, setText] = useState("Write or paste text here to analyze the content instantly.");
  const result = useMemo(() => runSentenceCounter({ text }), [text]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="sentence-counter-text">{t.text}</label>
        <textarea id="sentence-counter-text" className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />
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
