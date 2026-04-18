"use client";

import { useMemo, useState } from "react";
import {
  CalculatorShell,
  FieldGrid,
  FieldLabel,
  InfoBox,
  ResultGrid,
  ResultTile,
  formatPlNumber,
  inputClassName,
  parseDecimalInput,
  pickConstructionText,
  selectClassName,
  useConstructionLocale,
} from "@/components/tools/construction-calculator-ui";
import { runKalkulatorZbrojenia } from "@/tools/logic/kalkulator-zbrojenia";
import type { KalkulatorZbrojeniaInput } from "@/tools/schema/kalkulator-zbrojenia";

type FormState = {
  layoutType: KalkulatorZbrojeniaInput["layoutType"];
  length: string;
  width: string;
  spacingCm: string;
  coverCm: string;
  lapPercent: string;
  barLength: string;
  unitWeight: string;
};

const initialForm: FormState = {
  layoutType: "two-way",
  length: "6",
  width: "4",
  spacingCm: "15",
  coverCm: "5",
  lapPercent: "10",
  barLength: "12",
  unitWeight: "0.888",
};

function toInput(form: FormState): KalkulatorZbrojeniaInput {
  return {
    layoutType: form.layoutType,
    length: parseDecimalInput(form.length),
    width: parseDecimalInput(form.width),
    spacingCm: parseDecimalInput(form.spacingCm),
    coverCm: parseDecimalInput(form.coverCm),
    lapPercent: parseDecimalInput(form.lapPercent),
    barLength: parseDecimalInput(form.barLength),
    unitWeight: parseDecimalInput(form.unitWeight),
  };
}

export function KalkulatorZbrojeniaTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<FormState>(initialForm);

  const result = useMemo(() => {
    try {
      return runKalkulatorZbrojenia(toInput(form));
    } catch {
      return null;
    }
  }, [form]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <CalculatorShell
      title={t("Kalkulator zbrojenia", "Rebar calculator")}
      description={t(
        "Szybko oszacuj liczbe pretow, laczna dlugosc stali i mase zbrojenia dla prostej siatki jedno- lub dwukierunkowej.",
        "Quickly estimate bar count, total steel length, and rebar weight for a simple one-way or two-way mesh.",
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <FieldGrid>
            <FieldLabel label={t("Uklad zbrojenia", "Rebar layout")}>
              <select
                className={selectClassName}
                value={form.layoutType}
                onChange={(event) =>
                  updateField("layoutType", event.target.value as FormState["layoutType"])
                }
              >
                <option value="two-way">{t("Dwukierunkowe", "Two-way")}</option>
                <option value="one-way">{t("Jednokierunkowe", "One-way")}</option>
              </select>
            </FieldLabel>
            <FieldLabel label={t("Dlugosc plyty lub elementu (m)", "Slab or element length (m)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.length}
                onChange={(event) => updateField("length", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Szerokosc plyty lub elementu (m)", "Slab or element width (m)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.width}
                onChange={(event) => updateField("width", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Rozstaw pretow (cm)", "Bar spacing (cm)")}>
              <input
                className={inputClassName}
                type="number"
                step="1"
                value={form.spacingCm}
                onChange={(event) => updateField("spacingCm", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Otulina betonu (cm)", "Concrete cover (cm)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.5"
                value={form.coverCm}
                onChange={(event) => updateField("coverCm", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Naddatek na zaklady (%)", "Lap allowance (%)")}>
              <input
                className={inputClassName}
                type="number"
                step="1"
                value={form.lapPercent}
                onChange={(event) => updateField("lapPercent", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Dlugosc handlowa preta (m)", "Stock bar length (m)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.barLength}
                onChange={(event) => updateField("barLength", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Masa 1 mb preta (kg)", "Weight per running meter (kg)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.001"
                value={form.unitWeight}
                onChange={(event) => updateField("unitWeight", event.target.value)}
              />
            </FieldLabel>
          </FieldGrid>
        </div>

        <div className="space-y-4">
          {result ? (
            <ResultGrid>
              <ResultTile label={t("Prety w kierunku dlugosci", "Bars along length")} value={formatPlNumber(result.barsAlongLength, 0, locale)} />
              <ResultTile label={t("Prety w kierunku szerokosci", "Bars along width")} value={formatPlNumber(result.barsAlongWidth, 0, locale)} />
              <ResultTile label={t("Laczna dlugosc", "Total length")} value={`${formatPlNumber(result.totalLength, 2, locale)} m`} />
              <ResultTile label={t("Prety handlowe", "Stock bars")} value={formatPlNumber(result.bars, 0, locale)} />
              <ResultTile label={t("Masa stali", "Steel weight")} value={`${formatPlNumber(result.weight, 2, locale)} kg`} />
            </ResultGrid>
          ) : (
            <InfoBox title={t("Brak wyniku", "No result yet")}>
              {t(
                "Sprawdz, czy wszystkie pola wymiarowe i materialowe sa dodatnie.",
                "Check that all dimensional and material fields are positive.",
              )}
            </InfoBox>
          )}

          <InfoBox title={t("Wazne", "Important")}>
            {t(
              "To jest kalkulator orientacyjny do prostych siatek. Dla konstrukcji nosnych i projektowych zawsze trzymaj sie dokumentacji konstruktora.",
              "This is a rough calculator for simple meshes. For structural and engineered elements, always follow the structural design documentation.",
            )}
          </InfoBox>
        </div>
      </div>
    </CalculatorShell>
  );
}

export default KalkulatorZbrojeniaTool;
