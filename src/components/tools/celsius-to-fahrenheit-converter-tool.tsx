"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runCelsiusToFahrenheitConverter } from "@/tools/logic/celsius-to-fahrenheit-converter";

const labels = {
  "en": {
    "input": "Celsius",
    "output": "Fahrenheit"
  },
  "pl": {
    "input": "Celsjusz",
    "output": "Fahrenheit"
  },
  "es": {
    "input": "Celsius",
    "output": "Fahrenheit"
  },
  "de": {
    "input": "Celsius",
    "output": "Fahrenheit"
  },
  "fr": {
    "input": "Celsius",
    "output": "Fahrenheit"
  }
} as const;

export default function CelsiusToFahrenheitConverterTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [value, setValue] = useState("20");
  const result = useMemo(() => runCelsiusToFahrenheitConverter({ value: Number(value || 0) }), [value]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="celsius-to-fahrenheit-converter-value">{t.input}</label>
        <input id="celsius-to-fahrenheit-converter-value" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" min="0" step="any" type="number" value={value} onChange={(event) => setValue(event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.output}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
      </div>
    </div>
  );
}
