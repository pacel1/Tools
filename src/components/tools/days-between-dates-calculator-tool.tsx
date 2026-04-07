"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runDaysBetweenDatesCalculator } from "@/tools/logic/days-between-dates-calculator";

const labels = {
  "en": {
    "startDate": "Start date",
    "endDate": "End date",
    "result": "Result",
    "detail": "Difference in days"
  },
  "pl": {
    "startDate": "Data poczatkowa",
    "endDate": "Data koncowa",
    "result": "Wynik",
    "detail": "Roznica w dniach"
  },
  "es": {
    "startDate": "Fecha inicial",
    "endDate": "Fecha final",
    "result": "Resultado",
    "detail": "Diferencia en dias"
  },
  "de": {
    "startDate": "Startdatum",
    "endDate": "Enddatum",
    "result": "Ergebnis",
    "detail": "Differenz in Tagen"
  },
  "fr": {
    "startDate": "Date de debut",
    "endDate": "Date de fin",
    "result": "Resultat",
    "detail": "Difference en jours"
  }
} as const;

export default function DaysBetweenDatesCalculatorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [form, setForm] = useState({ startDate: "2025-01-01", endDate: "2025-01-31" });
  const result = useMemo(() => runDaysBetweenDatesCalculator({ startDate: form.startDate, endDate: form.endDate }), [form]);
  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="days-between-dates-calculator-startDate">{t.startDate}</label>
        <input id="days-between-dates-calculator-startDate" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="days-between-dates-calculator-endDate">{t.endDate}</label>
        <input id="days-between-dates-calculator-endDate" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="date" value={form.endDate} onChange={(event) => update("endDate", event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>
      </div>
    </div>
  );
}
