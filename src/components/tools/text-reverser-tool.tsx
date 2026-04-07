"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runTextReverser } from "@/tools/logic/text-reverser";

const labels = {
  "en": {
    "input": "Input",
    "result": "Result"
  },
  "pl": {
    "input": "Dane",
    "result": "Wynik"
  },
  "es": {
    "input": "Entrada",
    "result": "Resultado"
  },
  "de": {
    "input": "Eingabe",
    "result": "Ergebnis"
  },
  "fr": {
    "input": "Entree",
    "result": "Resultat"
  }
} as const;

export default function TextReverserTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [text, setText] = useState("utility");
  const result = useMemo(() => runTextReverser({ text }), [text]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="text-reverser-text">{t.input}</label>
        <textarea id="text-reverser-text" className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-sm text-white/90">{result.result}</pre>
      </div>
    </div>
  );
}
