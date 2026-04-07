"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runJsonMinifier } from "@/tools/logic/json-minifier";

const labels = {
  "en": {
    "json": "JSON",
    "statusValid": "Status: valid",
    "statusInvalid": "Status: invalid",
    "validMessage": "JSON minified successfully"
  },
  "pl": {
    "json": "JSON",
    "statusValid": "Status: poprawny",
    "statusInvalid": "Status: niepoprawny",
    "validMessage": "JSON zostal zminimalizowany"
  },
  "es": {
    "json": "JSON",
    "statusValid": "Estado: valido",
    "statusInvalid": "Estado: no valido",
    "validMessage": "JSON minimizado correctamente"
  },
  "de": {
    "json": "JSON",
    "statusValid": "Status: gueltig",
    "statusInvalid": "Status: ungueltig",
    "validMessage": "JSON wurde minifiziert"
  },
  "fr": {
    "json": "JSON",
    "statusValid": "Statut : valide",
    "statusInvalid": "Statut : invalide",
    "validMessage": "JSON minifie avec succes"
  }
} as const;

export default function JsonMinifierTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [source, setSource] = useState(`{
  "name": "tool",
  "value": 1,
  "items": [1, 2, 3]
}`);
  const result = useMemo(() => runJsonMinifier({ source }), [source]);
  const message = result.valid ? t.validMessage : result.message;
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="json-minifier-source">{t.json}</label>
        <textarea id="json-minifier-source" className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-cyan-300/50" value={source} onChange={(event) => setSource(event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{result.valid ? t.statusValid : t.statusInvalid}</p>
        <p className="mt-3 text-sm text-white/80">{message}</p>
        {result.result ? <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950/70 p-4 font-mono text-sm text-white/90">{result.result}</pre> : null}
      </div>
    </div>
  );
}
