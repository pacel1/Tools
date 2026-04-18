"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";

export type ConstructionLocale = "en" | "pl";

export const inputClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200";

export const selectClassName = inputClassName;

export const sectionCardClassName =
  "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

export function useConstructionLocale(): ConstructionLocale {
  const locale = useLocale();
  return locale === "en" ? "en" : "pl";
}

export function pickConstructionText<T>(
  locale: ConstructionLocale,
  plValue: T,
  enValue: T,
) {
  return locale === "en" ? enValue : plValue;
}

export function formatPlNumber(
  value: number,
  maximumFractionDigits = 2,
  locale: ConstructionLocale = "pl",
) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "pl-PL", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function parseDecimalInput(value: string) {
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function CalculatorShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className={`${sectionCardClassName} mx-auto w-full max-w-5xl`}>
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function FieldLabel({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function ResultGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function ResultTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-sm leading-5 text-slate-500">{label}</div>
      <div className="mt-1 break-words text-xl font-semibold leading-tight text-slate-900 sm:text-2xl">
        {value}
      </div>
      {hint ? <div className="mt-2 text-xs leading-5 text-slate-500">{hint}</div> : null}
    </div>
  );
}

export function InfoBox({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm font-semibold text-slate-800">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600">{children}</div>
    </div>
  );
}
