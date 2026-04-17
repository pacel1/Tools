"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runPaletteGenerator } from "@/tools/logic/palette-generator";

const labels = {
  en: { base: "Base color", count: "Palette size" },
  pl: { base: "Kolor bazowy", count: "Liczba probek" },
  de: { base: "Basisfarbe", count: "Palette" }
} as const;

export default function PaletteGeneratorTool() {
  const locale = (useLocale() as keyof typeof labels) || "en";
  const t = labels[locale] ?? labels.en;
  const [baseColor, setBaseColor] = useState("#14B8A6");
  const [count, setCount] = useState("5");
  const result = useMemo(
    () => runPaletteGenerator({ baseColor, count: Number(count) }),
    [baseColor, count]
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="palette-base">
            {t.base}
          </label>
          <input
            id="palette-base"
            type="color"
            value={result.baseColor}
            onChange={(event) => setBaseColor(event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="palette-count">
            {t.count}
          </label>
          <select
            id="palette-count"
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
          >
            {[4, 5, 6, 7, 8].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {result.palette.map((color) => (
          <div
            key={color}
            className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5"
          >
            <div className="h-24" style={{ backgroundColor: color }} />
            <p className="px-4 py-3 font-mono text-sm text-white/80">{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
