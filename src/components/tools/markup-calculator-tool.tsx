"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runMarkupCalculator } from "@/tools/logic/markup-calculator";

const labels = {
  "en": {
    "result": "Result",
    "detail": "Calculated result",
    "cost": "Cost",
    "markupPercent": "Markup (%)"
  },
  "pl": {
    "result": "Wynik",
    "detail": "Obliczony wynik",
    "cost": "Koszt",
    "markupPercent": "Marza (%)"
  },
  "es": {
    "result": "Resultado",
    "detail": "Resultado calculado",
    "cost": "Costo",
    "markupPercent": "Margen (%)"
  },
  "de": {
    "result": "Ergebnis",
    "detail": "Berechnetes Ergebnis",
    "cost": "Kosten",
    "markupPercent": "Aufschlag (%)"
  },
  "fr": {
    "result": "Resultat",
    "detail": "Resultat calcule",
    "cost": "Cout",
    "markupPercent": "Marge (%)"
  }
} as const;

export default function MarkupCalculatorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [form, setForm] = useState({
    cost: "50",
    markupPercent: "30"
  });
  const result = useMemo(() => runMarkupCalculator({
      cost: Number(form.cost || 0),
      markupPercent: Number(form.markupPercent || 0)
  }), [form]);
  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }
  return (
    <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="markup-calculator-cost">{t.cost}</label>
          <input id="markup-calculator-cost" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.cost} onChange={(event) => update("cost", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="markup-calculator-markupPercent">{t.markupPercent}</label>
          <input id="markup-calculator-markupPercent" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.markupPercent} onChange={(event) => update("markupPercent", event.target.value)} />
        </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>
      </div>
    </div>
  );
}
