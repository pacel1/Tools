"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runFeetToMetersConverter } from "@/tools/logic/feet-to-meters-converter";

const labels = {
  "en": {
    "input": "Feet",
    "output": "Meters"
  },
  "pl": {
    "input": "Stopy",
    "output": "Metry"
  },
  "es": {
    "input": "Pies",
    "output": "Metros"
  },
  "de": {
    "input": "Fuss",
    "output": "Meter"
  },
  "fr": {
    "input": "Pieds",
    "output": "Metres"
  }
} as const;

export default function FeetToMetersConverterTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [value, setValue] = useState("6");
  const result = useMemo(() => runFeetToMetersConverter({ value: Number(value || 0) }), [value]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="feet-to-meters-converter-value">{t.input}</label>
        <input id="feet-to-meters-converter-value" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" min="0" step="any" type="number" value={value} onChange={(event) => setValue(event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.output}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
      </div>
    </div>
  );
}
