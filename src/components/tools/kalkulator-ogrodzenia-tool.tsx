"use client";

import React, { useMemo, useState } from "react";
import {
  formatPlNumber,
  pickConstructionText,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { runKalkulatorOgrodzenia } from "@/tools/logic/kalkulator-ogrodzenia";

const defaultValues = {
  lengthMeters: 20,
  panelWidthMeters: 2.5,
  gateWidthMeters: 4,
  wicketWidthMeters: 1,
  wastePercent: 5,
};

export function KalkulatorOgrodzeniaTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [lengthMeters, setLengthMeters] = useState(String(defaultValues.lengthMeters));
  const [panelWidthMeters, setPanelWidthMeters] = useState(String(defaultValues.panelWidthMeters));
  const [gateWidthMeters, setGateWidthMeters] = useState(String(defaultValues.gateWidthMeters));
  const [wicketWidthMeters, setWicketWidthMeters] = useState(String(defaultValues.wicketWidthMeters));
  const [wastePercent, setWastePercent] = useState(String(defaultValues.wastePercent));

  const result = useMemo(() => {
    const parsed = {
      lengthMeters: Number(lengthMeters),
      panelWidthMeters: Number(panelWidthMeters),
      gateWidthMeters: Number(gateWidthMeters),
      wicketWidthMeters: Number(wicketWidthMeters),
      wastePercent: Number(wastePercent),
    };

    if (
      Object.values(parsed).some((value) => Number.isNaN(value)) ||
      parsed.panelWidthMeters <= 0 ||
      parsed.lengthMeters < 0 ||
      parsed.gateWidthMeters < 0 ||
      parsed.wicketWidthMeters < 0 ||
      parsed.wastePercent < 0
    ) {
      return null;
    }

    try {
      return runKalkulatorOgrodzenia(parsed);
    } catch {
      return null;
    }
  }, [gateWidthMeters, lengthMeters, panelWidthMeters, wastePercent, wicketWidthMeters]);

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">{t("Kalkulator ogrodzenia", "Fence calculator")}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {t(
            "Sprawdz, ile paneli ogrodzeniowych potrzeba oraz jaka bedzie liczba slupkow i dlugosc wypelnienia.",
            "Estimate how many fence panels you need and how many posts and how much infill length the project requires.",
          )}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "lengthMeters", label: t("Dlugosc ogrodzenia (m)", "Fence length (m)"), value: lengthMeters, setter: setLengthMeters },
          { name: "panelWidthMeters", label: t("Szerokosc panelu (m)", "Panel width (m)"), value: panelWidthMeters, setter: setPanelWidthMeters },
          { name: "gateWidthMeters", label: t("Szerokosc bramy (m)", "Gate width (m)"), value: gateWidthMeters, setter: setGateWidthMeters },
          { name: "wicketWidthMeters", label: t("Szerokosc furtki (m)", "Wicket width (m)"), value: wicketWidthMeters, setter: setWicketWidthMeters },
          { name: "wastePercent", label: t("Zapas (%)", "Waste allowance (%)"), value: wastePercent, setter: setWastePercent },
        ].map(({ name, label, value, setter }) => (
          <label key={name} className={`block ${name === "wastePercent" ? "md:col-span-2" : ""}`}>
            <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
            <input
              type="number"
              min={name === "panelWidthMeters" ? "0.01" : "0"}
              step="0.01"
              value={value}
              onChange={(event) => setter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ResultCard label={t("Liczba paneli", "Panel count")} value={result ? formatPlNumber(result.panels, 0, locale) : "-"} />
        <ResultCard label={t("Liczba slupkow", "Post count")} value={result ? formatPlNumber(result.posts, 0, locale) : "-"} />
        <ResultCard label={t("Dlugosc wypelnienia (m)", "Infill length (m)")} value={result ? formatPlNumber(result.fillableLength, 3, locale) : "-"} />
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {t(
          "Wynik dotyczy paneli ogrodzeniowych i uwzglednia brame oraz furtke jako otwory w ogrodzeniu.",
          "The result applies to fence panels and treats the gate and wicket as openings in the fence line.",
        )}
      </p>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default KalkulatorOgrodzeniaTool;
