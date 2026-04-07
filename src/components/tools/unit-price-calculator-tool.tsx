"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { runUnitPriceCalculator } from "@/tools/logic/unit-price-calculator";

const labels = {
  "en": {
    "result": "Result",
    "detail": "Calculated result",
    "totalPrice": "Total price",
    "quantity": "Quantity"
  },
  "pl": {
    "result": "Wynik",
    "detail": "Obliczony wynik",
    "totalPrice": "Cena laczna",
    "quantity": "Ilosc"
  },
  "es": {
    "result": "Resultado",
    "detail": "Resultado calculado",
    "totalPrice": "Precio total",
    "quantity": "Cantidad"
  },
  "de": {
    "result": "Ergebnis",
    "detail": "Berechnetes Ergebnis",
    "totalPrice": "Gesamtpreis",
    "quantity": "Menge"
  },
  "fr": {
    "result": "Resultat",
    "detail": "Resultat calcule",
    "totalPrice": "Prix total",
    "quantity": "Quantite"
  }
} as const;

export default function UnitPriceCalculatorTool() {
  const locale = useLocale() as keyof typeof labels;
  const t = labels[locale] ?? labels.en;
  const [form, setForm] = useState({
    totalPrice: "12",
    quantity: "3"
  });
  const result = useMemo(() => runUnitPriceCalculator({
      totalPrice: Number(form.totalPrice || 0),
      quantity: Number(form.quantity || 0)
  }), [form]);
  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }
  return (
    <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="unit-price-calculator-totalPrice">{t.totalPrice}</label>
          <input id="unit-price-calculator-totalPrice" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.totalPrice} onChange={(event) => update("totalPrice", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="unit-price-calculator-quantity">{t.quantity}</label>
          <input id="unit-price-calculator-quantity" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.quantity} onChange={(event) => update("quantity", event.target.value)} />
        </div>
      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>
        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>
      </div>
    </div>
  );
}
