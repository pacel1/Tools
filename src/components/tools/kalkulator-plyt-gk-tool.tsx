"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { run } from "@/tools/logic/kalkulator-plyt-gk";
import { kalkulatorPlytGkInputSchema, type KalkulatorPlytGkInput, type KalkulatorPlytGkOutput } from "@/tools/schema/kalkulator-plyt-gk";

const initialState: Record<keyof KalkulatorPlytGkInput, string> = {
  area: "10",
  boardWidthCm: "120",
  boardHeightCm: "200",
  wastePercent: "10",
  screwsPerBoard: "25",
  profilesPerSqm: "3.5",
};

export default function KalkulatorPlytGkTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [values, setValues] = useState(initialState);
  const [result, setResult] = useState<KalkulatorPlytGkOutput | null>(null);
  const [error, setError] = useState<string>("");

  const inputs = useMemo(() => [
    { name: "area", label: t("Powierzchnia zabudowy (m2)", "Covered area (m2)") },
    { name: "boardWidthCm", label: t("Szerokosc plyty (cm)", "Board width (cm)") },
    { name: "boardHeightCm", label: t("Wysokosc plyty (cm)", "Board height (cm)") },
    { name: "wastePercent", label: t("Zapas (%)", "Waste allowance (%)") },
    { name: "screwsPerBoard", label: t("Wkrety na jedna plyte", "Screws per board") },
    { name: "profilesPerSqm", label: t("Profile na 1 m2 (mb)", "Profiles per 1 m2 (rm)") },
  ] as const, [t]);

  const updateField = (name: keyof KalkulatorPlytGkInput, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const numericInput = {
      area: Number(values.area),
      boardWidthCm: Number(values.boardWidthCm),
      boardHeightCm: Number(values.boardHeightCm),
      wastePercent: Number(values.wastePercent),
      screwsPerBoard: Number(values.screwsPerBoard),
      profilesPerSqm: Number(values.profilesPerSqm),
    };

    const parsed = kalkulatorPlytGkInputSchema.safeParse(numericInput);
    if (!parsed.success) {
      setResult(null);
      setError(t("Nieprawidlowe dane.", "Invalid input data."));
      return;
    }

    try {
      setResult(run(parsed.data));
    } catch {
      setResult(null);
      setError(t("Blad obliczen.", "Calculation error."));
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-2xl font-semibold text-slate-900">{t("Kalkulator plyt GK", "Drywall board calculator")}</p>
        <p className="mt-2 text-sm text-slate-600">{t("Oblicz ile plyt gk trzeba, a takze ile wkretow i profili przygotowac do zabudowy.", "Estimate how many drywall boards, screws, and profiles you need for the assembly.")}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        {inputs.map((field) => (
          <label key={field.name} className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">{field.label}</span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={values[field.name]}
              onChange={(event) => updateField(field.name, event.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              placeholder="0"
            />
          </label>
        ))}

        <div className="sm:col-span-2">
          <button type="submit" className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
            {t("Oblicz", "Calculate")}
          </button>
        </div>
      </form>

      {error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {result ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <ResultCard label={t("Liczba plyt", "Board count")} value={formatPlNumber(result.boards, 0, locale)} />
          <ResultCard label={t("Liczba wkretow", "Screw count")} value={formatPlNumber(result.screws, 0, locale)} />
          <ResultCard label={t("Dlugosc profili (mb)", "Profile length (rm)")} value={formatPlNumber(result.profilesMeters, 2, locale)} />
        </div>
      ) : null}
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
