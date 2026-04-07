"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runCompoundInterestCalculator } from "@/tools/logic/compound-interest-calculator";

const labels = {
  "en": {
    "result": "Result",
    "detail": "Calculated result",
    "principal": "Principal",
    "annualRate": "Annual rate (%)",
    "years": "Years",
    "compoundsPerYear": "Compounds per year"
  },
  "pl": {
    "result": "Wynik",
    "detail": "Obliczony wynik",
    "principal": "Kapital",
    "annualRate": "Oprocentowanie roczne (%)",
    "years": "Lata",
    "compoundsPerYear": "Kapitalizacja w roku"
  },
  "es": {
    "result": "Resultado",
    "detail": "Resultado calculado",
    "principal": "Capital",
    "annualRate": "Tasa anual (%)",
    "years": "Anos",
    "compoundsPerYear": "Capitalizaciones por ano"
  },
  "de": {
    "result": "Ergebnis",
    "detail": "Berechnetes Ergebnis",
    "principal": "Kapital",
    "annualRate": "Jahreszins (%)",
    "years": "Jahre",
    "compoundsPerYear": "Verzinsungen pro Jahr"
  },
  "fr": {
    "result": "Resultat",
    "detail": "Resultat calcule",
    "principal": "Capital",
    "annualRate": "Taux annuel (%)",
    "years": "Annees",
    "compoundsPerYear": "Capitalisations par an"
  }
} as const;

export default function CompoundInterestCalculatorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [form, setForm] = useState({
    principal: "5000",
    annualRate: "5",
    years: "10",
    compoundsPerYear: "12"
  });
  const result = useMemo(() => runCompoundInterestCalculator({
      principal: Number(form.principal || 0),
      annualRate: Number(form.annualRate || 0),
      years: Number(form.years || 0),
      compoundsPerYear: Number(form.compoundsPerYear || 0)
  }), [form]);
  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }
  return (
    <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="compound-interest-calculator-principal">{t.principal}</label>
          <input id="compound-interest-calculator-principal" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.principal} onChange={(event) => update("principal", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="compound-interest-calculator-annualRate">{t.annualRate}</label>
          <input id="compound-interest-calculator-annualRate" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.annualRate} onChange={(event) => update("annualRate", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="compound-interest-calculator-years">{t.years}</label>
          <input id="compound-interest-calculator-years" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.years} onChange={(event) => update("years", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="compound-interest-calculator-compoundsPerYear">{t.compoundsPerYear}</label>
          <input id="compound-interest-calculator-compoundsPerYear" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.compoundsPerYear} onChange={(event) => update("compoundsPerYear", event.target.value)} />
        </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>
      </div>
    </div>
  );
}
