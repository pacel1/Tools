"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { runKalkulatorFarby } from "@/tools/logic/kalkulator-farby";
import type { KalkulatorFarbyInput, KalkulatorFarbyOutput } from "@/tools/schema/kalkulator-farby";

const defaults: KalkulatorFarbyInput = {
  area: 50,
  coverage: 11,
  coats: 2,
  wastePercent: 10,
  canSize: 2.5,
};

function toNumber(value: string): number {
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function KalkulatorFarbyTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<KalkulatorFarbyInput>(defaults);
  const [result, setResult] = useState<KalkulatorFarbyOutput | null>(() => runKalkulatorFarby(defaults));

  const canCountText = useMemo(() => {
    if (!result) {
      return "";
    }

    if (locale === "en") {
      return `${result.cans} ${result.cans === 1 ? "can" : "cans"}`;
    }

    return `${result.cans} ${result.cans === 1 ? "puszka" : "puszki/puszek"}`;
  }, [locale, result]);

  const updateField = (name: keyof KalkulatorFarbyInput) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = toNumber(event.target.value);
    const nextForm = { ...form, [name]: nextValue } as KalkulatorFarbyInput;
    setForm(nextForm);

    try {
      setResult(runKalkulatorFarby(nextForm));
    } catch {
      setResult(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t("Kalkulator farby", "Paint calculator")}</h2>
        <p className="text-sm leading-6 text-slate-600">
          {t(
            "Sprawdz ile farby potrzeba na sciany i sufity. Wpisz powierzchnie, wydajnosc, liczbe warstw, zapas i pojemnosc puszki, a kalkulator policzy wynik w litrach oraz liczbe puszek.",
            "Estimate how much paint you need for walls and ceilings. Enter area, coverage, number of coats, waste allowance, and can size to get liters and can count.",
          )}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["area", t("Powierzchnia do malowania (m2)", "Paintable area (m2)")],
            ["coverage", t("Wydajnosc farby (m2/l)", "Paint coverage (m2/l)")],
            ["coats", t("Liczba warstw", "Number of coats")],
            ["wastePercent", t("Zapas (%)", "Waste allowance (%)")],
            ["canSize", t("Pojemnosc puszki (l)", "Can size (l)")],
          ].map(([name, label]) => (
            <label key={name} className={`space-y-2 ${name === "canSize" ? "sm:col-span-2" : ""}`}>
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form[name as keyof KalkulatorFarbyInput]}
                onChange={updateField(name as keyof KalkulatorFarbyInput)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>
          ))}
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">{t("Wynik", "Result")}</h3>
          {result ? (
            <dl className="mt-4 space-y-4">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <dt className="text-sm text-slate-500">{t("Farba bez zapasu", "Paint without waste")}</dt>
                <dd className="mt-1 text-2xl font-bold text-slate-900">{formatPlNumber(result.litersBase, 2, locale)} l</dd>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <dt className="text-sm text-slate-500">{t("Farba z zapasem", "Paint with waste")}</dt>
                <dd className="mt-1 text-2xl font-bold text-slate-900">{formatPlNumber(result.litersTotal, 2, locale)} l</dd>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <dt className="text-sm text-slate-500">{t("Liczba puszek", "Can count")}</dt>
                <dd className="mt-1 text-2xl font-bold text-slate-900">{canCountText}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-rose-600">{t("Sprawdz dane wejsciowe.", "Check the input values.")}</p>
          )}
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {t(
              "Wzor: powierzchnia x liczba warstw / wydajnosc = farba bez zapasu. Nastepnie doliczany jest zapas i obliczana liczba puszek.",
              "Formula: area x coats / coverage = paint without waste. Then the waste allowance is added and the number of cans is calculated.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default KalkulatorFarbyTool;
