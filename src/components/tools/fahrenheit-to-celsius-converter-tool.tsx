"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runFahrenheitToCelsiusConverter } from "@/tools/logic/fahrenheit-to-celsius-converter";

const labels = {
  "en": {
    "input": "Fahrenheit",
    "output": "Celsius"
  },
  "pl": {
    "input": "Fahrenheit",
    "output": "Celsjusz"
  },
  "es": {
    "input": "Fahrenheit",
    "output": "Celsius"
  },
  "de": {
    "input": "Fahrenheit",
    "output": "Celsius"
  },
  "fr": {
    "input": "Fahrenheit",
    "output": "Celsius"
  }
} as const;

export default function FahrenheitToCelsiusConverterTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [value, setValue] = useState("68");
  const result = useMemo(() => runFahrenheitToCelsiusConverter({ value: Number(value || 0) }), [value]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="fahrenheit-to-celsius-converter-value">{t.input}</label>
        <input id="fahrenheit-to-celsius-converter-value" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" min="0" step="any" type="number" value={value} onChange={(event) => setValue(event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.output}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
      </div>
    </div>
  );
}
