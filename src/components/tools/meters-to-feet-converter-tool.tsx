"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runMetersToFeetConverter } from "@/tools/logic/meters-to-feet-converter";

const labels = {
  "en": {
    "input": "Meters",
    "output": "Feet"
  },
  "pl": {
    "input": "Metry",
    "output": "Stopy"
  },
  "es": {
    "input": "Metros",
    "output": "Pies"
  },
  "de": {
    "input": "Meter",
    "output": "Fuss"
  },
  "fr": {
    "input": "Metres",
    "output": "Pieds"
  }
} as const;

export default function MetersToFeetConverterTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [value, setValue] = useState("2");
  const result = useMemo(() => runMetersToFeetConverter({ value: Number(value || 0) }), [value]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="meters-to-feet-converter-value">{t.input}</label>
        <input id="meters-to-feet-converter-value" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" min="0" step="any" type="number" value={value} onChange={(event) => setValue(event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.output}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
      </div>
    </div>
  );
}
