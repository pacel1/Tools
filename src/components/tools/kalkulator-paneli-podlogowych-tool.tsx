"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { runKalkulatorPaneliPodlogowych } from "@/tools/logic/kalkulator-paneli-podlogowych";
import type { KalkulatorPaneliPodlogowychInput, KalkulatorPaneliPodlogowychOutput } from "@/tools/logic/kalkulator-paneli-podlogowych";

const initialForm: KalkulatorPaneliPodlogowychInput = {
  area: 20,
  panelWidthCm: 20,
  panelLengthCm: 120,
  wastePercent: 10,
  packCoverage: 2.4,
};

export function KalkulatorPaneliPodlogowychTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<KalkulatorPaneliPodlogowychInput>(initialForm);
  const [result, setResult] = useState<KalkulatorPaneliPodlogowychOutput>(() => runKalkulatorPaneliPodlogowych(initialForm));
  const [error, setError] = useState<string>("");

  const summary = useMemo(() => {
    return {
      areaLabel: formatPlNumber(result.areaWithWaste, 4, locale),
      panelsLabel: formatPlNumber(result.panels, 0, locale),
      packsLabel: formatPlNumber(result.packs, 0, locale),
    };
  }, [locale, result]);

  const update = (name: keyof KalkulatorPaneliPodlogowychInput, value: string) => {
    setForm((prev: KalkulatorPaneliPodlogowychInput) => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value),
    }));
  };

  const handleCalculate = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const next = runKalkulatorPaneliPodlogowych(form);
      setResult(next);
      setError("");
    } catch {
      setError(t("Wystapil blad obliczen.", "Calculation error."));
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">{t("Kalkulator paneli podlogowych", "Floor panel calculator")}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {t(
            "Sprawdz ile paneli kupic i ile paczek bedzie potrzebnych z uwzglednieniem zapasu na docinki.",
            "Estimate how many floor panels and packs you need with waste included for cuts.",
          )}
        </p>
      </div>

      <form onSubmit={handleCalculate} className="grid gap-4 sm:grid-cols-2">
        {[
          ["area", t("Powierzchnia podlogi (m2)", "Floor area (m2)")],
          ["panelWidthCm", t("Szerokosc panela (cm)", "Panel width (cm)")],
          ["panelLengthCm", t("Dlugosc panela (cm)", "Panel length (cm)")],
          ["wastePercent", t("Zapas na docinki (%)", "Waste for cuts (%)")],
          ["packCoverage", t("Pokrycie jednej paczki (m2)", "Coverage per pack (m2)")],
        ].map(([name, label]) => (
          <label key={name} className={`grid gap-2 ${name === "packCoverage" ? "sm:col-span-2" : ""}`}>
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              type="number"
              step="0.01"
              value={form[name as keyof KalkulatorPaneliPodlogowychInput]}
              onChange={(event) => update(name as keyof KalkulatorPaneliPodlogowychInput, event.target.value)}
            />
          </label>
        ))}

        <div className="sm:col-span-2">
          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-800">
            {t("Oblicz", "Calculate")}
          </button>
        </div>
      </form>

      {error ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t("Liczba paneli", "Panel count")}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{summary.panelsLabel}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t("Liczba paczek", "Pack count")}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{summary.packsLabel}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t("Powierzchnia z zapasem (m2)", "Area with waste (m2)")}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{summary.areaLabel}</div>
        </div>
      </div>
    </div>
  );
}

export default KalkulatorPaneliPodlogowychTool;
