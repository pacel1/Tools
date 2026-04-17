"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runInchConverter } from "@/tools/logic/inch-converter";

const labels = {
  en: {
    value: "Value",
    from: "From",
    to: "To",
    result: "Converted value",
    swap: "Swap",
    units: { IN: "Inches", CM: "Centimeters", MM: "Millimeters", FT: "Feet" }
  },
  pl: {
    value: "Wartosc",
    from: "Z",
    to: "Na",
    result: "Wynik",
    swap: "Zamien",
    units: { IN: "Cale", CM: "Centymetry", MM: "Milimetry", FT: "Stopy" }
  },
  de: {
    value: "Wert",
    from: "Von",
    to: "Nach",
    result: "Ergebnis",
    swap: "Tauschen",
    units: { IN: "Zoll", CM: "Zentimeter", MM: "Millimeter", FT: "Fuss" }
  }
} as const;

export default function InchConverterTool() {
  const locale = (useLocale() as keyof typeof labels) || "en";
  const t = labels[locale] ?? labels.en;
  const [value, setValue] = useState("10");
  const [fromUnit, setFromUnit] = useState<"IN" | "CM" | "MM" | "FT">("IN");
  const [toUnit, setToUnit] = useState<"IN" | "CM" | "MM" | "FT">("CM");
  const result = useMemo(
    () =>
      runInchConverter({
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
        <label className="mb-2 block text-sm text-white/70" htmlFor="inch-converter-value">
          {t.value}
        </label>
        <input
          id="inch-converter-value"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
          step="any"
          type="number"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="inch-converter-from">
            {t.from}
          </label>
          <select
            id="inch-converter-from"
            value={fromUnit}
            onChange={(event) => setFromUnit(event.target.value as "IN" | "CM" | "MM" | "FT")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
          >
            {Object.entries(t.units).map(([key, label]) => (
              <option key={key} value={key}>
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
          <label className="mb-2 block text-sm text-white/70" htmlFor="inch-converter-to">
            {t.to}
          </label>
          <select
            id="inch-converter-to"
            value={toUnit}
            onChange={(event) => setToUnit(event.target.value as "IN" | "CM" | "MM" | "FT")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
          >
            {Object.entries(t.units).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">
          {result.formatted} {t.units[result.toUnit]}
        </p>
      </div>
    </div>
  );
}
