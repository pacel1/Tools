"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runPercentageCalculator } from "@/tools/logic/percentage-calculator";

const labels = {
  "en": {
    "result": "Result",
    "detail": "Calculated result",
    "value": "Value",
    "total": "Total"
  },
  "pl": {
    "result": "Wynik",
    "detail": "Obliczony wynik",
    "value": "Wartosc",
    "total": "Suma"
  },
  "es": {
    "result": "Resultado",
    "detail": "Resultado calculado",
    "value": "Valor",
    "total": "Total"
  },
  "de": {
    "result": "Ergebnis",
    "detail": "Berechnetes Ergebnis",
    "value": "Wert",
    "total": "Gesamt"
  },
  "fr": {
    "result": "Resultat",
    "detail": "Resultat calcule",
    "value": "Valeur",
    "total": "Total"
  }
} as const;

export default function PercentageCalculatorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [form, setForm] = useState({
    value: "25",
    total: "200"
  });
  const result = useMemo(() => runPercentageCalculator({
      value: Number(form.value || 0),
      total: Number(form.total || 0)
  }), [form]);
  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }
  return (
    <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="percentage-calculator-value">{t.value}</label>
          <input id="percentage-calculator-value" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.value} onChange={(event) => update("value", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="percentage-calculator-total">{t.total}</label>
          <input id="percentage-calculator-total" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.total} onChange={(event) => update("total", event.target.value)} />
        </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>
      </div>
    </div>
  );
}
