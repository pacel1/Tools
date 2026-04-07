"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runUuidGenerator } from "@/tools/logic/uuid-generator";

const labels = {
  "en": {
    "count": "Count",
    "uuidValues": "UUID values"
  },
  "pl": {
    "count": "Liczba",
    "uuidValues": "Wartosci UUID"
  },
  "es": {
    "count": "Cantidad",
    "uuidValues": "Valores UUID"
  },
  "de": {
    "count": "Anzahl",
    "uuidValues": "UUID Werte"
  },
  "fr": {
    "count": "Nombre",
    "uuidValues": "Valeurs UUID"
  }
} as const;

export default function UuidGeneratorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [count, setCount] = useState("1");
  const result = useMemo(() => runUuidGenerator({ count: Number(count || 1) }), [count]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="uuid-generator-count">{t.count}</label>
        <input id="uuid-generator-count" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" min="1" max="10" value={count} onChange={(event) => setCount(event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.uuidValues}</p>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm text-white/90">{result.formatted}</pre>
      </div>
    </div>
  );
}
