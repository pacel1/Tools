"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { runKalkulatorTynku } from "@/tools/logic/kalkulator-tynku";
import type { KalkulatorTynkuInput } from "@/tools/logic/kalkulator-tynku";

const initialState: KalkulatorTynkuInput = {
  area: 100,
  consumptionPerMm: 1.5,
  layerMm: 10,
  wastePercent: 10,
  bagWeight: 25,
};

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function KalkulatorTynkuTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [values, setValues] = useState<KalkulatorTynkuInput>(initialState);

  const result = useMemo(() => {
    try {
      return runKalkulatorTynku(values);
    } catch {
      return null;
    }
  }, [values]);

  const update = (key: keyof KalkulatorTynkuInput) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [key]: toNumber(event.target.value) }));
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 space-y-2">
        <p className="text-2xl font-semibold tracking-tight text-slate-900">{t("Kalkulator tynku", "Plaster calculator")}</p>
        <p className="text-sm leading-6 text-slate-600">
          {t(
            "Oblicz ile tynku potrzeba na elewacje lub sciany wewnetrzne oraz ile workow tynku potrzeba.",
            "Estimate how much plaster you need for facades or interior walls and how many bags to buy.",
          )}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["area", t("Powierzchnia (m2)", "Area (m2)")],
          ["consumptionPerMm", t("Zuzycie na 1 mm (kg/m2/mm)", "Consumption per 1 mm (kg/m2/mm)")],
          ["layerMm", t("Grubosc warstwy (mm)", "Layer thickness (mm)")],
          ["wastePercent", t("Zapas (%)", "Waste allowance (%)")],
          ["bagWeight", t("Waga worka (kg)", "Bag weight (kg)")],
        ].map(([name, label]) => (
          <label key={name} className={`space-y-2 ${name === "bagWeight" ? "md:col-span-2" : ""}`}>
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
              type="number"
              min="0"
              step="any"
              value={values[name as keyof KalkulatorTynkuInput]}
              onChange={update(name as keyof KalkulatorTynkuInput)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t("Tynk bez zapasu (kg)", "Plaster without waste (kg)")}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{result ? formatPlNumber(result.kgBase, 3, locale) : "-"}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t("Tynk z zapasem (kg)", "Plaster with waste (kg)")}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{result ? formatPlNumber(result.kgTotal, 3, locale) : "-"}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t("Liczba workow", "Bag count")}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{result ? formatPlNumber(result.bags, 0, locale) : "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default KalkulatorTynkuTool;
