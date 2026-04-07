"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { formatJson } from "@/tools/logic/json-formatter";

const sample = `{"name":"Utility Globe","features":["i18n","SEO","CLI"],"live":true}`;
const labels = {
  en: {
    indent: "Indent",
    input: "JSON input",
    formatted: "Formatted JSON",
    minifiedLength: "Minified length",
    lines: "Lines",
    spaces: "spaces"
  },
  pl: {
    indent: "Wcięcie",
    input: "Wejście JSON",
    formatted: "Sformatowany JSON",
    minifiedLength: "Długość minified",
    lines: "Linie",
    spaces: "spacje"
  },
  es: {
    indent: "Indentacion",
    input: "Entrada JSON",
    formatted: "JSON formateado",
    minifiedLength: "Longitud minificada",
    lines: "Lineas",
    spaces: "espacios"
  },
  de: {
    indent: "Einruckung",
    input: "JSON Eingabe",
    formatted: "Formatiertes JSON",
    minifiedLength: "Minifizierte Lange",
    lines: "Zeilen",
    spaces: "Leerzeichen"
  },
  fr: {
    indent: "Indentation",
    input: "Entree JSON",
    formatted: "JSON formate",
    minifiedLength: "Longueur minifiee",
    lines: "Lignes",
    spaces: "espaces"
  }
} as const;

export function JsonFormatterTool() {
  const locale = useLocale() as keyof typeof labels;
  const [json, setJson] = useState(sample);
  const [indent, setIndent] = useState("2");

  let formatted = "";
  let minified = "";
  let lineCount = 0;
  let error: string | null = null;

  try {
    const output = formatJson({ json, indent: Number(indent) });
    formatted = output.formatted;
    minified = output.minified;
    lineCount = output.lineCount;
  } catch (issue) {
    error = issue instanceof Error ? issue.message : "Invalid JSON";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-44 flex-1">
          <label className="mb-2 block text-sm text-white/70" htmlFor="indent">
            {labels[locale].indent}
          </label>
          <select
            id="indent"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
            value={indent}
            onChange={(event) => setIndent(event.target.value)}
          >
            {[2, 4, 6, 8].map((value) => (
              <option key={value} value={value}>
                {value} {labels[locale].spaces}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="json-input">
          {labels[locale].input}
        </label>
        <textarea
          id="json-input"
          className="min-h-44 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-cyan-300/50"
          value={json}
          onChange={(event) => setJson(event.target.value)}
        />
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">
              {labels[locale].formatted}
            </p>
            <pre className="mt-3 overflow-x-auto text-sm text-white/80">{formatted}</pre>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label={labels[locale].minifiedLength} value={String(minified.length)} />
            <MetricCard label={labels[locale].lines} value={String(lineCount)} />
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export default JsonFormatterTool;
