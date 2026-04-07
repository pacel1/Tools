"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runMmToInchesConverter } from "@/tools/logic/mm-to-inches-converter";

const labels = {
  "en": {
    "input": "Millimeters",
    "output": "Inches"
  },
  "pl": {
    "input": "Milimetry",
    "output": "Cale"
  },
  "es": {
    "input": "Milimetros",
    "output": "Pulgadas"
  },
  "de": {
    "input": "Millimeter",
    "output": "Zoll"
  },
  "fr": {
    "input": "Millimetres",
    "output": "Pouces"
  }
} as const;

export default function MmToInchesConverterTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [value, setValue] = useState("25");
  const result = useMemo(() => runMmToInchesConverter({ value: Number(value || 0) }), [value]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="mm-to-inches-converter-value">{t.input}</label>
        <input id="mm-to-inches-converter-value" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" min="0" step="any" type="number" value={value} onChange={(event) => setValue(event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.output}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
      </div>
    </div>
  );
}
