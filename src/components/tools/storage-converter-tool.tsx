"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runStorageConverter } from "@/tools/logic/storage-converter";

const labels = {
  en: {
    value: "Value",
    from: "From",
    to: "To",
    result: "Converted value",
    swap: "Swap"
  },
  pl: {
    value: "Wartosc",
    from: "Z",
    to: "Na",
    result: "Wynik",
    swap: "Zamien"
  },
  de: {
    value: "Wert",
    from: "Von",
    to: "Nach",
    result: "Ergebnis",
    swap: "Tauschen"
  }
} as const;

const unitLabels = {
  en: { KB: "KB", MB: "MB", GB: "GB", TB: "TB" },
  pl: { KB: "KB", MB: "MB", GB: "GB", TB: "TB" },
  de: { KB: "KB", MB: "MB", GB: "GB", TB: "TB" }
} as const;

export default function StorageConverterTool() {
  const locale = (useLocale() as keyof typeof labels) || "en";
  const t = labels[locale] ?? labels.en;
  const units = unitLabels[locale] ?? unitLabels.en;
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<"KB" | "MB" | "GB" | "TB">("GB");
  const [toUnit, setToUnit] = useState<"KB" | "MB" | "GB" | "TB">("MB");
  const result = useMemo(
    () =>
      runStorageConverter({
        value: Number(value || 0),
        fromUnit,
        toUnit
      }),
    [fromUnit, toUnit, value]
  );

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="storage-converter-value">
          {t.value}
        </label>
        <input
          id="storage-converter-value"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
          min="0"
          step="any"
          type="number"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="storage-converter-from">
            {t.from}
          </label>
          <select
            id="storage-converter-from"
            value={fromUnit}
            onChange={(event) => setFromUnit(event.target.value as "KB" | "MB" | "GB" | "TB")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
          >
            {Object.entries(units).map(([valueKey, label]) => (
              <option key={valueKey} value={valueKey}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={swapUnits}
          className="rounded-full border border-cyan-300/30 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
        >
          {t.swap}
        </button>

        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="storage-converter-to">
            {t.to}
          </label>
          <select
            id="storage-converter-to"
            value={toUnit}
            onChange={(event) => setToUnit(event.target.value as "KB" | "MB" | "GB" | "TB")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
          >
            {Object.entries(units).map(([valueKey, label]) => (
              <option key={valueKey} value={valueKey}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">
          {result.formatted} {result.toUnit}
        </p>
      </div>
    </div>
  );
}
