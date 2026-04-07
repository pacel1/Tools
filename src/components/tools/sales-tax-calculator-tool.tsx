"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runSalesTaxCalculator } from "@/tools/logic/sales-tax-calculator";

const labels = {
  "en": {
    "result": "Result",
    "detail": "Calculated result",
    "amount": "Amount",
    "percent": "Percent"
  },
  "pl": {
    "result": "Wynik",
    "detail": "Obliczony wynik",
    "amount": "Kwota",
    "percent": "Procent"
  },
  "es": {
    "result": "Resultado",
    "detail": "Resultado calculado",
    "amount": "Cantidad",
    "percent": "Porcentaje"
  },
  "de": {
    "result": "Ergebnis",
    "detail": "Berechnetes Ergebnis",
    "amount": "Betrag",
    "percent": "Prozent"
  },
  "fr": {
    "result": "Resultat",
    "detail": "Resultat calcule",
    "amount": "Montant",
    "percent": "Pourcentage"
  }
} as const;

export default function SalesTaxCalculatorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [form, setForm] = useState({
    amount: "100",
    percent: "8"
  });
  const result = useMemo(() => runSalesTaxCalculator({
      amount: Number(form.amount || 0),
      percent: Number(form.percent || 0)
  }), [form]);
  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }
  return (
    <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="sales-tax-calculator-amount">{t.amount}</label>
          <input id="sales-tax-calculator-amount" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.amount} onChange={(event) => update("amount", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="sales-tax-calculator-percent">{t.percent}</label>
          <input id="sales-tax-calculator-percent" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.percent} onChange={(event) => update("percent", event.target.value)} />
        </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>
      </div>
    </div>
  );
}
