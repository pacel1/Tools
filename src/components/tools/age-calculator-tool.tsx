"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runAgeCalculator } from "@/tools/logic/age-calculator";

const labels = {
  "en": {
    "birthDate": "Birth date",
    "result": "Result",
    "detail": "Exact age in years"
  },
  "pl": {
    "birthDate": "Data urodzenia",
    "result": "Wynik",
    "detail": "Dokladny wiek w latach"
  },
  "es": {
    "birthDate": "Fecha de nacimiento",
    "result": "Resultado",
    "detail": "Edad exacta en anos"
  },
  "de": {
    "birthDate": "Geburtsdatum",
    "result": "Ergebnis",
    "detail": "Genaues Alter in Jahren"
  },
  "fr": {
    "birthDate": "Date de naissance",
    "result": "Resultat",
    "detail": "Age exact en annees"
  }
} as const;

export default function AgeCalculatorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [form, setForm] = useState({ birthDate: "1990-05-15" });
  const result = useMemo(() => runAgeCalculator({ birthDate: form.birthDate }), [form]);
  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="age-calculator-birthDate">{t.birthDate}</label>
        <input id="age-calculator-birthDate" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="date" value={form.birthDate} onChange={(event) => update("birthDate", event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>
      </div>
    </div>
  );
}
