"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { runRandomTokenGenerator } from "@/tools/logic/random-token-generator";
import type { RandomTokenGeneratorInput } from "@/tools/schema/random-token-generator";

const labels = {
  en: {
    length: "Length",
    count: "Count",
    format: "Format",
    prefix: "Prefix",
    generatedTokens: "Generated tokens",
    base64url: "Base64URL",
    hex: "Hex",
    alphanumeric: "Alphanumeric"
  },
  pl: {
    length: "Dlugosc",
    count: "Liczba",
    format: "Format",
    prefix: "Prefiks",
    generatedTokens: "Wygenerowane tokeny",
    base64url: "Base64URL",
    hex: "Hex",
    alphanumeric: "Alfanumeryczny"
  },
  es: {
    length: "Longitud",
    count: "Cantidad",
    format: "Formato",
    prefix: "Prefijo",
    generatedTokens: "Tokens generados",
    base64url: "Base64URL",
    hex: "Hex",
    alphanumeric: "Alfanumerico"
  },
  de: {
    length: "Laenge",
    count: "Anzahl",
    format: "Format",
    prefix: "Praefix",
    generatedTokens: "Generierte Tokens",
    base64url: "Base64URL",
    hex: "Hex",
    alphanumeric: "Alphanumerisch"
  },
  fr: {
    length: "Longueur",
    count: "Nombre",
    format: "Format",
    prefix: "Prefixe",
    generatedTokens: "Tokens generes",
    base64url: "Base64URL",
    hex: "Hex",
    alphanumeric: "Alphanumerique"
  }
} as const;

export default function RandomTokenGeneratorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [length, setLength] = useState("32");
  const [count, setCount] = useState("5");
  const [format, setFormat] = useState<RandomTokenGeneratorInput["format"]>("base64url");
  const [prefix, setPrefix] = useState("");
  const result = useMemo(
    () =>
      runRandomTokenGenerator({
        length: Number(length || 32),
        count: Number(count || 1),
        format,
        prefix
      }),
    [count, format, length, prefix]
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t.length} id="random-token-generator-length">
          <input
            id="random-token-generator-length"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
            type="number"
            min="8"
            max="256"
            value={length}
            onChange={(event) => setLength(event.target.value)}
          />
        </Field>
        <Field label={t.count} id="random-token-generator-count">
          <input
            id="random-token-generator-count"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </Field>
        <Field label={t.format} id="random-token-generator-format">
          <select
            id="random-token-generator-format"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
            value={format}
            onChange={(event) =>
              setFormat(event.target.value as RandomTokenGeneratorInput["format"])
            }
          >
            <option value="base64url">{t.base64url}</option>
            <option value="hex">{t.hex}</option>
            <option value="alphanumeric">{t.alphanumeric}</option>
          </select>
        </Field>
        <Field label={t.prefix} id="random-token-generator-prefix">
          <input
            id="random-token-generator-prefix"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
            type="text"
            maxLength={32}
            value={prefix}
            onChange={(event) => setPrefix(event.target.value)}
          />
        </Field>
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm tracking-[0.24em] text-cyan-100/80 uppercase">
          {t.generatedTokens}
        </p>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm text-white/90">
          {result.formatted}
        </pre>
      </div>
    </div>
  );
}

function Field({
  children,
  id,
  label
}: {
  children: ReactNode;
  id: string;
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}
