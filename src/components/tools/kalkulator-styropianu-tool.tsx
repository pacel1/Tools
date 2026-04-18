"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { run } from "@/tools/logic/kalkulator-styropianu";
import type { KalkulatorStyropianuInput, KalkulatorStyropianuOutput } from "@/tools/schema/kalkulator-styropianu";

const initialValues: KalkulatorStyropianuInput = {
  area: 100,
  thicknessCm: 15,
  packageCoverage: 3.0,
  wastePercent: 10,
  packageVolume: 0.3,
};

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function KalkulatorStyropianuTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [values, setValues] = useState<KalkulatorStyropianuInput>(initialValues);

  const result: KalkulatorStyropianuOutput = useMemo(() => {
    try {
      return run(values);
    } catch {
      return { volume: 0, packages: 0, areaWithWaste: 0 };
    }
  }, [values]);

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{t("Kalkulator styropianu", "EPS insulation calculator")}</h2>
        <p className="text-sm leading-6 text-slate-600">
          {t(
            "Sprawdz, ile paczek styropianu potrzeba do ocieplenia scian, podlogi, dachu lub fundamentu.",
            "Estimate how many EPS packs you need for walls, floors, roofs, or foundations.",
          )}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { key: "area", label: t("Powierzchnia ocieplenia (m2)", "Insulated area (m2)") },
          { key: "thicknessCm", label: t("Grubosc ocieplenia (cm)", "Insulation thickness (cm)") },
          { key: "packageCoverage", label: t("Pokrycie jednej paczki (m2)", "Coverage per pack (m2)") },
          { key: "wastePercent", label: t("Zapas (%)", "Waste allowance (%)") },
          { key: "packageVolume", label: t("Objetosc jednej paczki (m3)", "Volume per pack (m3)") },
        ].map((field) => (
          <label key={field.key} className="space-y-2">
            <span className="block text-sm font-medium text-slate-700">{field.label}</span>
            <input
              type="number"
              inputMode="decimal"
              value={String((values as Record<string, number>)[field.key])}
              onChange={(event) => setValues((prev) => ({ ...prev, [field.key]: toNumber(event.target.value) }))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">{t("Wynik", "Result")}</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard label={t("Objetosc izolacji (m3)", "Insulation volume (m3)")} value={formatPlNumber(result.volume, 2, locale)} />
          <ResultCard label={t("Liczba paczek", "Pack count")} value={formatPlNumber(result.packages, 0, locale)} />
          <ResultCard label={t("Powierzchnia z zapasem (m2)", "Area with waste (m2)")} value={formatPlNumber(result.areaWithWaste, 2, locale)} />
        </div>
      </div>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
