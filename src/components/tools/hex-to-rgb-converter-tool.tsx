"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runHexToRgbConverter } from "@/tools/logic/hex-to-rgb-converter";

const labels = {
  en: { hex: "HEX color", result: "RGB result" },
  pl: { hex: "Kolor HEX", result: "Wynik RGB" },
  de: { hex: "HEX-Farbe", result: "RGB-Ergebnis" }
} as const;

export default function HexToRgbConverterTool() {
  const locale = (useLocale() as keyof typeof labels) || "en";
  const t = labels[locale] ?? labels.en;
  const [hex, setHex] = useState("#FF7A18");
  const result = useMemo(() => runHexToRgbConverter({ hex }), [hex]);

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="hex-to-rgb-hex">
          {t.hex}
        </label>
        <div className="flex gap-3">
          <input
            type="color"
            value={result.normalizedHex}
            onChange={(event) => setHex(event.target.value)}
            className="h-12 w-16 rounded-2xl border border-white/10 bg-slate-950/90 p-2"
          />
          <input
            id="hex-to-rgb-hex"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 font-mono outline-none transition focus:border-cyan-300/50"
            value={hex}
            onChange={(event) => setHex(event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.rgb}</p>
        <p className="mt-2 text-sm text-cyan-50/80">
          R: {result.red} | G: {result.green} | B: {result.blue}
        </p>
      </div>
    </div>
  );
}
