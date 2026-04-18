"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { run } from "@/tools/logic/kalkulator-welny-mineralnej";
import type { KalkulatorWelnyMineralnejInput, KalkulatorWelnyMineralnejOutput } from "@/tools/schema/kalkulator-welny-mineralnej";

const initialValues: KalkulatorWelnyMineralnejInput = {
  area: 100,
  thicknessCm: 20,
  packageCoverage: 5,
  wastePercent: 10,
  packageVolume: 0.5,
};

export default function KalkulatorWelnyMineralnejTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [values, setValues] = useState<KalkulatorWelnyMineralnejInput>(initialValues);
  const result = useMemo<KalkulatorWelnyMineralnejOutput>(() => run(values), [values]);

  function updateField(name: keyof KalkulatorWelnyMineralnejInput, rawValue: string) {
    const next = Number(rawValue);
    setValues((current) => ({ ...current, [name]: Number.isFinite(next) ? next : 0 }));
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t("Kalkulator welny mineralnej", "Mineral wool calculator")}</h1>
        <p className="text-sm leading-6 text-slate-600">
          {t(
            "Sprawdz ile welny potrzeba do ocieplenia poddasza, scian lub stropu. Oblicz powierzchnie z zapasem, objetosc izolacji i liczbe paczek albo rolek.",
            "Estimate how much mineral wool you need for an attic, walls, or ceiling. Calculate area with waste, insulation volume, and the number of packs or rolls.",
          )}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["area", t("Powierzchnia ocieplenia (m2)", "Insulated area (m2)")],
          ["thicknessCm", t("Grubosc izolacji (cm)", "Insulation thickness (cm)")],
          ["packageCoverage", t("Pokrycie jednej paczki (m2)", "Coverage per pack (m2)")],
          ["wastePercent", t("Zapas (%)", "Waste allowance (%)")],
          ["packageVolume", t("Objetosc jednej paczki (m3)", "Volume per pack (m3)")],
        ].map(([name, label]) => (
          <label key={name} className={`space-y-1 ${name === "packageVolume" ? "md:col-span-2" : ""}`}>
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
              type="number"
              min="0"
              step="0.01"
              value={values[name as keyof KalkulatorWelnyMineralnejInput]}
              onChange={(event) => updateField(name as keyof KalkulatorWelnyMineralnejInput, event.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t("Objetosc izolacji (m3)", "Insulation volume (m3)")}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{formatPlNumber(result.volume, 4, locale)}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t("Liczba paczek lub rolek", "Packs or rolls")}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{formatPlNumber(result.packages, 0, locale)}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t("Powierzchnia z zapasem (m2)", "Area with waste (m2)")}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{formatPlNumber(result.areaWithWaste, 2, locale)}</div>
        </div>
      </div>
    </div>
  );
}
