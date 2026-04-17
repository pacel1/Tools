"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runColorPicker } from "@/tools/logic/color-picker";

const labels = {
  en: { color: "Color", hex: "HEX", rgb: "RGB", hsl: "HSL" },
  pl: { color: "Kolor", hex: "HEX", rgb: "RGB", hsl: "HSL" },
  de: { color: "Farbe", hex: "HEX", rgb: "RGB", hsl: "HSL" }
} as const;

export default function ColorPickerTool() {
  const locale = (useLocale() as keyof typeof labels) || "en";
  const t = labels[locale] ?? labels.en;
  const [hex, setHex] = useState("#0EA5E9");
  const result = useMemo(() => runColorPicker({ hex }), [hex]);

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="color-picker-hex">
          {t.color}
        </label>
        <div className="flex gap-3">
          <input
            type="color"
            value={result.hex}
            onChange={(event) => setHex(event.target.value)}
            className="h-12 w-16 rounded-2xl border border-white/10 bg-slate-950/90 p-2"
          />
          <input
            id="color-picker-hex"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 font-mono outline-none transition focus:border-cyan-300/50"
            value={hex}
            onChange={(event) => setHex(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: t.hex, value: result.hex },
          { label: t.rgb, value: result.rgb },
          { label: t.hsl, value: result.hsl }
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-white/10 bg-white/5 p-5"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">
              {item.label}
            </p>
            <p className="mt-3 font-mono text-lg text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
