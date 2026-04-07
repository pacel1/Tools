"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runLoanPaymentCalculator } from "@/tools/logic/loan-payment-calculator";

const labels = {
  "en": {
    "result": "Result",
    "detail": "Calculated result",
    "principal": "Principal",
    "annualRate": "Annual rate (%)",
    "termMonths": "Term (months)"
  },
  "pl": {
    "result": "Wynik",
    "detail": "Obliczony wynik",
    "principal": "Kapital",
    "annualRate": "Oprocentowanie roczne (%)",
    "termMonths": "Okres (miesiace)"
  },
  "es": {
    "result": "Resultado",
    "detail": "Resultado calculado",
    "principal": "Capital",
    "annualRate": "Tasa anual (%)",
    "termMonths": "Plazo (meses)"
  },
  "de": {
    "result": "Ergebnis",
    "detail": "Berechnetes Ergebnis",
    "principal": "Kapital",
    "annualRate": "Jahreszins (%)",
    "termMonths": "Laufzeit (Monate)"
  },
  "fr": {
    "result": "Resultat",
    "detail": "Resultat calcule",
    "principal": "Capital",
    "annualRate": "Taux annuel (%)",
    "termMonths": "Duree (mois)"
  }
} as const;

export default function LoanPaymentCalculatorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [form, setForm] = useState({
    principal: "25000",
    annualRate: "6",
    termMonths: "60"
  });
  const result = useMemo(() => runLoanPaymentCalculator({
      principal: Number(form.principal || 0),
      annualRate: Number(form.annualRate || 0),
      termMonths: Number(form.termMonths || 0)
  }), [form]);
  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }
  return (
    <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="loan-payment-calculator-principal">{t.principal}</label>
          <input id="loan-payment-calculator-principal" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.principal} onChange={(event) => update("principal", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="loan-payment-calculator-annualRate">{t.annualRate}</label>
          <input id="loan-payment-calculator-annualRate" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.annualRate} onChange={(event) => update("annualRate", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="loan-payment-calculator-termMonths">{t.termMonths}</label>
          <input id="loan-payment-calculator-termMonths" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.termMonths} onChange={(event) => update("termMonths", event.target.value)} />
        </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>
      </div>
    </div>
  );
}
