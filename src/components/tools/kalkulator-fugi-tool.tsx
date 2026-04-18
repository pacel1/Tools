"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { kalkulatorFugiInputSchema } from "@/tools/schema/kalkulator-fugi";
import { run as runKalkulatorFugi } from "@/tools/logic/kalkulator-fugi";

type FormState = {
  area: string;
  tileWidthCm: string;
  tileHeightCm: string;
  jointWidthMm: string;
  jointDepthMm: string;
  groutDensity: string;
  wastePercent: string;
  bagWeight: string;
};

const initialState: FormState = {
  area: "10",
  tileWidthCm: "30",
  tileHeightCm: "60",
  jointWidthMm: "3",
  jointDepthMm: "8",
  groutDensity: "1.8",
  wastePercent: "10",
  bagWeight: "5",
};

export default function KalkulatorFugiTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [values, setValues] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ kgBase: number; kgTotal: number; bags: number } | null>(null);

  const payload = useMemo(() => ({
    area: values.area,
    tileWidthCm: values.tileWidthCm,
    tileHeightCm: values.tileHeightCm,
    jointWidthMm: values.jointWidthMm,
    jointDepthMm: values.jointDepthMm,
    groutDensity: values.groutDensity,
    wastePercent: values.wastePercent,
    bagWeight: values.bagWeight,
  }), [values]);

  const onChange = (name: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = kalkulatorFugiInputSchema.safeParse(payload);

    if (!parsed.success) {
      setError(t("Nieprawidlowe dane.", "Invalid input data."));
      setResult(null);
      return;
    }

    setError(null);
    setResult(runKalkulatorFugi(parsed.data));
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">{t("Kalkulator fugi", "Grout calculator")}</h2>
        <p className="text-sm leading-6 text-slate-600">
          {t(
            "Sprawdz, ile fugi potrzeba do plytek. To szybka estymacja planistyczna dla doboru materialu.",
            "Estimate how much grout you need for tiles. This is a quick planning estimate for selecting material.",
          )}
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        {[
          ["area", t("Powierzchnia (m2)", "Area (m2)")],
          ["tileWidthCm", t("Szerokosc plytki (cm)", "Tile width (cm)")],
          ["tileHeightCm", t("Wysokosc plytki (cm)", "Tile height (cm)")],
          ["jointWidthMm", t("Szerokosc spoiny (mm)", "Joint width (mm)")],
          ["jointDepthMm", t("Glebokosc spoiny (mm)", "Joint depth (mm)")],
          ["groutDensity", t("Gestosc fugi (kg/dm3)", "Grout density (kg/dm3)")],
          ["wastePercent", t("Zapas (%)", "Waste allowance (%)")],
          ["bagWeight", t("Waga worka (kg)", "Bag weight (kg)")],
        ].map(([name, label]) => (
          <label key={name} className="space-y-1">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
              value={values[name as keyof FormState]}
              onChange={onChange(name as keyof FormState)}
              inputMode="decimal"
              type="number"
              step="any"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </label>
        ))}

        <div className="md:col-span-2 flex items-center gap-3">
          <button type="submit" className="rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700">
            {t("Oblicz", "Calculate")}
          </button>
          <span className="text-sm text-slate-500">{t("Kalkulator fugi - ile fugi potrzeba w kilka sekund.", "Grout calculator - estimate grout in a few seconds.")}</span>
        </div>
      </form>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {result ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [t("Fuga bez zapasu (kg)", "Grout without waste (kg)"), formatPlNumber(result.kgBase, 2, locale)],
            [t("Fuga z zapasem (kg)", "Grout with waste (kg)"), formatPlNumber(result.kgTotal, 2, locale)],
            [t("Liczba workow", "Bag count"), formatPlNumber(result.bags, 0, locale)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
