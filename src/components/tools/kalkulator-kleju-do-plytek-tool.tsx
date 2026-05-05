"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { run } from "@/tools/logic/kalkulator-kleju-do-plytek";
import type { KalkulatorKlejuDoPlytekInput } from "@/tools/logic/kalkulator-kleju-do-plytek";

const initialForm: KalkulatorKlejuDoPlytekInput = {
  area: 10,
  consumptionPerMm: 1.5,
  layerMm: 5,
  wastePercent: 10,
  bagWeight: 25,
};

function toNumber(value: string): number {
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function KalkulatorKlejuDoPlytekTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<KalkulatorKlejuDoPlytekInput>(initialForm);

  const result = useMemo(() => run(form), [form]);

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-2xl font-semibold tracking-tight text-slate-900">{t("Kalkulator kleju do plytek", "Tile adhesive calculator")}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {t("Oblicz ile kilogramow i ile workow kleju trzeba na dana powierzchnie.", "Estimate how many kilograms and bags of adhesive you need for a given area.")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["area", t("Powierzchnia (m2)", "Area (m2)")],
          ["consumptionPerMm", t("Zuzycie na 1 mm (kg/m2/mm)", "Consumption per 1 mm (kg/m2/mm)")],
          ["layerMm", t("Grubosc warstwy (mm)", "Layer thickness (mm)")],
          ["wastePercent", t("Zapas (%)", "Waste allowance (%)")],
          ["bagWeight", t("Waga worka (kg)", "Bag weight (kg)")],
        ].map(([name, label]) => (
          <label key={name} className={`block ${name === "bagWeight" ? "sm:col-span-2" : ""}`}>
            <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form[name as keyof KalkulatorKlejuDoPlytekInput]}
              onChange={(event) =>
                setForm((prev: KalkulatorKlejuDoPlytekInput) => ({
                  ...prev,
                  [name]: toNumber(event.target.value),
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t("Wynik", "Result")}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-500">{t("Klej bez zapasu", "Adhesive without waste")}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{formatPlNumber(result.kgBase, 3, locale)} kg</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-500">{t("Klej z zapasem", "Adhesive with waste")}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{formatPlNumber(result.kgTotal, 3, locale)} kg</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-500">{t("Liczba workow", "Bag count")}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{formatPlNumber(result.bags, 0, locale)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KalkulatorKlejuDoPlytekTool;
