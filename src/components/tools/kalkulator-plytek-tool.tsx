"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { run } from "@/tools/logic/kalkulator-plytek";
import { kalkulatorPlytekInputSchema } from "@/tools/schema/kalkulator-plytek";

export type KalkulatorPlytekToolProps = {
  className?: string;
};

const defaultValues = {
  area: 10,
  tileWidthCm: 30,
  tileHeightCm: 30,
  wastePercent: 10,
  tilesPerBox: 10,
};

export function KalkulatorPlytekTool({ className = "" }: KalkulatorPlytekToolProps) {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState(defaultValues);
  const [result, setResult] = useState<ReturnType<typeof run> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tileAreaM2 = useMemo(() => (form.tileWidthCm * form.tileHeightCm) / 10000, [form.tileWidthCm, form.tileHeightCm]);

  const onChange = (name: keyof typeof defaultValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setForm((prev: typeof defaultValues) => ({
      ...prev,
      [name]: Number.isFinite(value) ? value : 0,
    }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = kalkulatorPlytekInputSchema.safeParse(form);
    if (!parsed.success) {
      setError(t("Sprawdz wszystkie pola i wpisz poprawne wartosci wieksze od zera.", "Check all fields and enter valid values greater than zero."));
      setResult(null);
      return;
    }

    setError(null);
    setResult(run(parsed.data));
  };

  return (
    <div className={`mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-6 space-y-2">
        <p className="text-2xl font-semibold tracking-tight text-slate-900">{t("Kalkulator plytek", "Tile calculator")}</p>
        <p className="text-sm leading-6 text-slate-600">
          {t(
            "Oblicz, ile plytek potrzeba na podloge lub sciane z uwzglednieniem docinek i zapasu.",
            "Estimate how many tiles you need for a floor or wall including cuts and waste allowance.",
          )}
        </p>
      </div>

      <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
        {[
          ["area", t("Powierzchnia (m2)", "Area (m2)")],
          ["tileWidthCm", t("Szerokosc plytki (cm)", "Tile width (cm)")],
          ["tileHeightCm", t("Wysokosc plytki (cm)", "Tile height (cm)")],
          ["wastePercent", t("Zapas na docinki (%)", "Waste for cuts (%)")],
          ["tilesPerBox", t("Liczba plytek w paczce", "Tiles per box")],
        ].map(([name, label]) => (
          <label key={name} className={`grid gap-2 text-sm font-medium text-slate-700 ${name === "area" ? "sm:col-span-2" : ""}`}>
            <span>{label}</span>
            <input
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-slate-400"
              type="number"
              step={name === "tilesPerBox" ? "1" : "0.01"}
              value={form[name as keyof typeof defaultValues]}
              onChange={onChange(name as keyof typeof defaultValues)}
            />
          </label>
        ))}

        <div className="sm:col-span-2 flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span>{t("Pole jednej plytki", "Single tile area")}: {formatPlNumber(tileAreaM2, 4, locale)} m2</span>
          <button className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800" type="submit">{t("Oblicz", "Calculate")}</button>
        </div>
      </form>

      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {result ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{t("Liczba plytek", "Tile count")}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPlNumber(result.tiles, 0, locale)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{t("Liczba paczek", "Box count")}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPlNumber(result.boxes, 0, locale)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{t("Powierzchnia z zapasem (m2)", "Area with waste (m2)")}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPlNumber(result.areaWithWaste, 4, locale)}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default KalkulatorPlytekTool;
