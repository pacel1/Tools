"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runContrastChecker } from "@/tools/logic/contrast-checker";

const labels = {
  en: { foreground: "Text color", background: "Background color", ratio: "Contrast ratio" },
  pl: { foreground: "Kolor tekstu", background: "Kolor tla", ratio: "Wspolczynnik kontrastu" },
  de: { foreground: "Textfarbe", background: "Hintergrundfarbe", ratio: "Kontrastwert" }
} as const;

function Badge({ active, children }: { active: boolean; children: string }) {
  return (
    <span
      className={
        active
          ? "rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100"
          : "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
      }
    >
      {children}
    </span>
  );
}

export default function ContrastCheckerTool() {
  const locale = (useLocale() as keyof typeof labels) || "en";
  const t = labels[locale] ?? labels.en;
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#FFFFFF");
  const result = useMemo(
    () => runContrastChecker({ foreground, background }),
    [background, foreground]
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="contrast-foreground">
            {t.foreground}
          </label>
          <input
            id="contrast-foreground"
            type="color"
            value={foreground}
            onChange={(event) => setForeground(event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="contrast-background">
            {t.background}
          </label>
          <input
            id="contrast-background"
            type="color"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2"
          />
        </div>
      </div>

      <div
        className="rounded-[28px] border border-white/10 p-6"
        style={{ backgroundColor: background, color: foreground }}
      >
        <p className="text-sm uppercase tracking-[0.24em]">{t.ratio}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.ratio}:1</p>
        <p className="mt-2 text-sm">{result.summary}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Badge active={result.aaLarge}>AA Large</Badge>
        <Badge active={result.aaNormal}>AA Normal</Badge>
        <Badge active={result.aaaNormal}>AAA Normal</Badge>
      </div>
    </div>
  );
}
