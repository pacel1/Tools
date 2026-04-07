"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runBmiCalculator } from "@/tools/logic/bmi-calculator";

const labels = {
  "en": {
    "result": "Result",
    "detail": "Calculated result",
    "weightKg": "Weight (kg)",
    "heightCm": "Height (cm)"
  },
  "pl": {
    "result": "Wynik",
    "detail": "Obliczony wynik",
    "weightKg": "Waga (kg)",
    "heightCm": "Wzrost (cm)"
  },
  "es": {
    "result": "Resultado",
    "detail": "Resultado calculado",
    "weightKg": "Peso (kg)",
    "heightCm": "Altura (cm)"
  },
  "de": {
    "result": "Ergebnis",
    "detail": "Berechnetes Ergebnis",
    "weightKg": "Gewicht (kg)",
    "heightCm": "Groesse (cm)"
  },
  "fr": {
    "result": "Resultat",
    "detail": "Resultat calcule",
    "weightKg": "Poids (kg)",
    "heightCm": "Taille (cm)"
  }
} as const;

export default function BmiCalculatorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [form, setForm] = useState({
    weightKg: "70",
    heightCm: "175"
  });
  const result = useMemo(() => runBmiCalculator({
      weightKg: Number(form.weightKg || 0),
      heightCm: Number(form.heightCm || 0)
  }), [form]);
  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }
  return (
    <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="bmi-calculator-weightKg">{t.weightKg}</label>
          <input id="bmi-calculator-weightKg" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.weightKg} onChange={(event) => update("weightKg", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="bmi-calculator-heightCm">{t.heightCm}</label>
          <input id="bmi-calculator-heightCm" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.heightCm} onChange={(event) => update("heightCm", event.target.value)} />
        </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>
      </div>
    </div>
  );
}
