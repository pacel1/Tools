"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runPasswordGenerator } from "@/tools/logic/password-generator";

const labels = {
  "en": {
    "length": "Length",
    "uppercase": "Uppercase",
    "lowercase": "Lowercase",
    "numbers": "Numbers",
    "symbols": "Symbols",
    "generatedPassword": "Generated password"
  },
  "pl": {
    "length": "Dlugosc",
    "uppercase": "Wielkie litery",
    "lowercase": "Male litery",
    "numbers": "Cyfry",
    "symbols": "Symbole",
    "generatedPassword": "Wygenerowane haslo"
  },
  "es": {
    "length": "Longitud",
    "uppercase": "Mayusculas",
    "lowercase": "Minusculas",
    "numbers": "Numeros",
    "symbols": "Simbolos",
    "generatedPassword": "Contrasena generada"
  },
  "de": {
    "length": "Laenge",
    "uppercase": "Grossbuchstaben",
    "lowercase": "Kleinbuchstaben",
    "numbers": "Zahlen",
    "symbols": "Symbole",
    "generatedPassword": "Generiertes Passwort"
  },
  "fr": {
    "length": "Longueur",
    "uppercase": "Majuscules",
    "lowercase": "Minuscules",
    "numbers": "Chiffres",
    "symbols": "Symboles",
    "generatedPassword": "Mot de passe genere"
  }
} as const;

export default function PasswordGeneratorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [length, setLength] = useState("16");
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const result = useMemo(() => runPasswordGenerator({ length: Number(length || 16), uppercase, lowercase, numbers, symbols }), [length, uppercase, lowercase, numbers, symbols]);
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="password-generator-length">{t.length}</label>
        <input id="password-generator-length" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" min="4" max="64" value={length} onChange={(event) => setLength(event.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle checked={uppercase} label={t.uppercase} onChange={setUppercase} />
        <Toggle checked={lowercase} label={t.lowercase} onChange={setLowercase} />
        <Toggle checked={numbers} label={t.numbers} onChange={setNumbers} />
        <Toggle checked={symbols} label={t.symbols} onChange={setSymbols} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.generatedPassword}</p>
        <p className="mt-3 break-all font-mono text-lg text-white">{result.password}</p>
      </div>
    </div>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}
