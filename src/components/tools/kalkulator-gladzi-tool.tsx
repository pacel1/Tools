"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { run } from "@/tools/logic/kalkulator-gladzi";
import type { KalkulatorGladziInput, KalkulatorGladziOutput } from "@/tools/schema/kalkulator-gladzi";

const defaultValues: KalkulatorGladziInput = {
  area: 100,
  consumptionPerMm: 1.0,
  layerMm: 2,
  wastePercent: 10,
  bagWeight: 20,
};

export default function KalkulatorGladziTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [values, setValues] = useState<KalkulatorGladziInput>(defaultValues);
  const [result, setResult] = useState<KalkulatorGladziOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canCalculate = useMemo(
    () => Object.values(values).every((value) => Number.isFinite(value)),
    [values],
  );

  const handleChange = (name: keyof KalkulatorGladziInput, value: string) => {
    setValues((current) => ({
      ...current,
      [name]: value === "" ? Number.NaN : Number(value),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError(null);
      setResult(run(values));
    } catch {
      setResult(null);
      setError(t("Nie udalo sie obliczyc wyniku.", "Could not calculate the result."));
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{t("Kalkulator gladzi", "Skim coat calculator")}</h2>
        <p className="text-sm leading-6 text-slate-600">
          {t(
            "Sprawdz ile gladzi potrzeba na sciany i sufity. Oblicz zuzycie, zapas oraz liczbe workow.",
            "Estimate how much skim coat you need for walls and ceilings. Calculate consumption, waste allowance, and bag count.",
          )}
        </p>
      </div>

      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        {[
          ["area", t("Powierzchnia (m2)", "Area (m2)")],
          ["consumptionPerMm", t("Zuzycie na 1 mm (kg/m2/mm)", "Consumption per 1 mm (kg/m2/mm)")],
          ["layerMm", t("Grubosc warstwy (mm)", "Layer thickness (mm)")],
          ["wastePercent", t("Zapas (%)", "Waste allowance (%)")],
          ["bagWeight", t("Waga worka (kg)", "Bag weight (kg)")],
        ].map(([name, label]) => (
          <label key={name} className={`grid gap-2 text-sm font-medium text-slate-700 ${name === "bagWeight" ? "sm:col-span-2" : ""}`}>
            {label}
            <input
              type="number"
              min="0"
              step="0.01"
              value={Number.isNaN(values[name as keyof KalkulatorGladziInput]) ? "" : values[name as keyof KalkulatorGladziInput]}
              onChange={(event) => handleChange(name as keyof KalkulatorGladziInput, event.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="0"
            />
          </label>
        ))}

        <div className="sm:col-span-2 flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!canCalculate}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {t("Oblicz", "Calculate")}
          </button>
        </div>
      </form>

      {error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <ResultCard label={t("Gladz bez zapasu (kg)", "Skim coat without waste (kg)")} value={formatPlNumber(result.kgBase, 3, locale)} />
          <ResultCard label={t("Gladz z zapasem (kg)", "Skim coat with waste (kg)")} value={formatPlNumber(result.kgTotal, 3, locale)} />
          <ResultCard label={t("Liczba workow", "Bag count")} value={formatPlNumber(result.bags, 0, locale)} />
        </div>
      ) : null}
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
    </div>
  );
}
