"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { convertKgToLbs } from "@/tools/logic/kg-to-lbs-converter";

const labels = {
  en: { kilograms: "Kilograms", result: "Result" },
  pl: { kilograms: "Kilogramy", result: "Wynik" },
  es: { kilograms: "Kilogramos", result: "Resultado" },
  de: { kilograms: "Kilogramm", result: "Ergebnis" },
  fr: { kilograms: "Kilogrammes", result: "Resultat" }
} as const;

export function KgToLbsTool() {
  const locale = useLocale() as keyof typeof labels;
  const [kilograms, setKilograms] = useState("1");

  const result = convertKgToLbs({ kilograms: Number(kilograms || 0) });

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="kilograms">
          {labels[locale].kilograms}
        </label>
        <input
          id="kilograms"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none ring-0 transition focus:border-cyan-300/50"
          min="0"
          step="0.01"
          type="number"
          value={kilograms}
          onChange={(event) => setKilograms(event.target.value)}
        />
      </div>

      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">
          {labels[locale].result}
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
      </div>
    </div>
  );
}

export default KgToLbsTool;
