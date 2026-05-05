"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { run } from "@/tools/logic/kalkulator-kostki-brukowej";
import { kalkulatorKostkiBrukowejInputSchema } from "@/tools/schema/kalkulator-kostki-brukowej";

const initialState = {
  area: 100,
  blockWidthCm: 20,
  blockLengthCm: 10,
  wastePercent: 5,
  packCoverage: 10,
  edgingPerSqm: 0.4,
};

export default function KalkulatorKostkiBrukowejTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    const parsed = kalkulatorKostkiBrukowejInputSchema.safeParse(values);
    if (!parsed.success) return null;
    return run(parsed.data);
  }, [values]);

  const onChange = (name: keyof typeof initialState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [name]: Number(event.target.value) }));
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = kalkulatorKostkiBrukowejInputSchema.safeParse(values);
    if (!parsed.success) {
      setError(t("Sprawdz wszystkie pola i podaj poprawne wartosci wieksze od zera.", "Check all fields and enter valid values greater than zero."));
      return;
    }

    setError(null);
    setValues(parsed.data);
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-2xl font-bold tracking-tight text-slate-900">{t("Kalkulator kostki brukowej", "Paving block calculator")}</p>
        <p className="mt-2 text-sm text-slate-600">
          {t(
            "Sprawdz ile kostki potrzeba na podjazd, chodnik lub taras oraz policz obrzeza i palety.",
            "Estimate how many paving blocks you need for a driveway, path, or terrace and calculate edging and pallets.",
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        {[
          ["area", t("Powierzchnia nawierzchni (m2)", "Surface area (m2)")],
          ["blockWidthCm", t("Szerokosc kostki (cm)", "Block width (cm)")],
          ["blockLengthCm", t("Dlugosc kostki (cm)", "Block length (cm)")],
          ["wastePercent", t("Zapas (%)", "Waste allowance (%)")],
          ["packCoverage", t("Pokrycie jednej palety lub paczki (m2)", "Coverage per pallet or pack (m2)")],
          ["edgingPerSqm", t("Obrzeza na 1 m2 (mb)", "Edging per 1 m2 (rm)")],
        ].map(([name, label]) => (
          <label key={name} className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
              type="number"
              step="any"
              value={(values as Record<string, number>)[name]}
              onChange={onChange(name as keyof typeof initialState)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </label>
        ))}

        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            {t("Oblicz", "Calculate")}
          </button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </form>

      {result ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">{t("Liczba kostek", "Block count")}</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{formatPlNumber(result.blocks, 0, locale)}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">{t("Liczba palet lub paczek", "Pallet or pack count")}</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{formatPlNumber(result.packs, 0, locale)}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">{t("Obrzeza (mb)", "Edging (rm)")}</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{formatPlNumber(result.edgingMeters, 2, locale)}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
