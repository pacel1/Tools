"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { runSha256Generator } from "@/tools/logic/sha256-generator";

const labels = {
  "en": {
    "text": "Text",
    "sha256Hash": "SHA256 hash"
  },
  "pl": {
    "text": "Tekst",
    "sha256Hash": "Hash SHA256"
  },
  "es": {
    "text": "Texto",
    "sha256Hash": "Hash SHA256"
  },
  "de": {
    "text": "Text",
    "sha256Hash": "SHA256 Hash"
  },
  "fr": {
    "text": "Texte",
    "sha256Hash": "Hash SHA256"
  }
} as const;

export default function Sha256GeneratorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [text, setText] = useState("hash this text");
  const [hash, setHash] = useState("");

  useEffect(() => {
    let active = true;
    async function compute() {
      const result = await runSha256Generator({ text });
      if (active) {
        setHash(result.hash);
      }
    }
    void compute();
    return () => {
      active = false;
    };
  }, [text]);

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="sha256-generator-text">{t.text}</label>
        <textarea id="sha256-generator-text" className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />
      </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.sha256Hash}</p>
        <p className="mt-3 break-all font-mono text-sm text-white/90">{hash}</p>
      </div>
    </div>
  );
}
