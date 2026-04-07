"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runInchesToMmConverter } from "@/tools/logic/inches-to-mm-converter";

const labels = {
  "en": {
    "input": "Inches",
    "output": "Millimeters"
  },
  "pl": {
    "input": "Cale",
    "output": "Milimetry"
  },
  "es": {
    "input": "Pulgadas",
    "output": "Milimetros"
  },
  "de": {
    "input": "Zoll",
    "output": "Millimeter"
  },
  "fr": {
    "input": "Pouces",
    "output": "Millimetres"
  }
} as const;

export default function InchesToMmConverterTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [value, setValue] = useState("4");
  const result = useMemo(() => runInchesToMmConverter({ value: Number(value || 0) }), [value]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="inches-to-mm-converter-value">{t.input}</label>
        <input id="inches-to-mm-converter-value" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" min="0" step="any" type="number" value={value} onChange={(event) => setValue(event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.output}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
      </div>
    </div>
  );
}
