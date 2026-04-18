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
import { runKalkulatorWylewki } from "@/tools/logic/kalkulator-wylewki";
import type { KalkulatorWylewkiInput } from "@/tools/schema/kalkulator-wylewki";

type FormState = {
  materialType: KalkulatorWylewkiInput["materialType"];
  area: string;
  thicknessMm: string;
  densityKgPerM3: string;
  wastePercent: string;
  bagWeight: string;
};

const presets: Record<
  FormState["materialType"],
  { densityKgPerM3: string; bagWeight: string }
> = {
  cement: {
    densityKgPerM3: "2000",
    bagWeight: "25",
  },
  anhydrite: {
    densityKgPerM3: "1900",
    bagWeight: "30",
  },
  "self-leveling": {
    densityKgPerM3: "1700",
    bagWeight: "20",
  },
};

const initialForm: FormState = {
  materialType: "cement",
  area: "50",
  thicknessMm: "60",
  densityKgPerM3: presets.cement.densityKgPerM3,
  wastePercent: "8",
  bagWeight: presets.cement.bagWeight,
};

function toInput(form: FormState): KalkulatorWylewkiInput {
  return {
    materialType: form.materialType,
    area: parseDecimalInput(form.area),
    thicknessMm: parseDecimalInput(form.thicknessMm),
    densityKgPerM3: parseDecimalInput(form.densityKgPerM3),
    wastePercent: parseDecimalInput(form.wastePercent),
    bagWeight: parseDecimalInput(form.bagWeight),
  };
}

export function KalkulatorWylewkiTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<FormState>(initialForm);

  const result = useMemo(() => {
    try {
      return runKalkulatorWylewki(toInput(form));
    } catch {
      return null;
    }
  }, [form]);

  const materialHint =
    form.materialType === "cement"
      ? t(
          "Klasyczna wylewka cementowa sprawdza sie w garazach, kotlowniach i standardowych pomieszczeniach.",
          "Classic cement screed works well in garages, utility rooms, and standard interior spaces.",
        )
      : form.materialType === "anhydrite"
        ? t(
            "Wylewka anhydrytowa dobrze wspolpracuje z ogrzewaniem podlogowym i zwykle daje rowna powierzchnie.",
            "Anhydrite screed pairs well with underfloor heating and usually gives a very even surface.",
          )
        : t(
            "Masa samopoziomujaca jest dobra do cienkich warstw wyrownujacych, nie do grubych konstrukcyjnych wylewek.",
            "Self-leveling compound is good for thin leveling layers, not for thick structural screeds.",
          );

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateMaterialType(nextType: FormState["materialType"]) {
    setForm((current) => ({
      ...current,
      materialType: nextType,
      densityKgPerM3: presets[nextType].densityKgPerM3,
      bagWeight: presets[nextType].bagWeight,
    }));
  }

  return (
    <CalculatorShell
      title={t("Kalkulator wylewki", "Screed calculator")}
      description={t(
        "Policz objetosc i mase materialu dla wylewki cementowej, anhydrytowej albo masy samopoziomujacej. Wynik pokazuje tez liczbe workow i orientacyjny czas schniecia.",
        "Estimate volume and material mass for cement screed, anhydrite screed, or self-leveling compound. The result also shows bag count and approximate drying time.",
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <FieldGrid>
            <FieldLabel label={t("Rodzaj materialu", "Material type")}>
              <select
                className={selectClassName}
                value={form.materialType}
                onChange={(event) =>
                  updateMaterialType(event.target.value as FormState["materialType"])
                }
              >
                <option value="cement">{t("Wylewka cementowa", "Cement screed")}</option>
                <option value="anhydrite">{t("Wylewka anhydrytowa", "Anhydrite screed")}</option>
                <option value="self-leveling">{t("Masa samopoziomujaca", "Self-leveling compound")}</option>
              </select>
            </FieldLabel>

            <FieldLabel label={t("Powierzchnia (m2)", "Area (m2)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.area}
                onChange={(event) => updateField("area", event.target.value)}
              />
            </FieldLabel>

            <FieldLabel label={t("Grubosc wylewki (mm)", "Screed thickness (mm)")}>
              <input
                className={inputClassName}
                type="number"
                step="1"
                value={form.thicknessMm}
                onChange={(event) => updateField("thicknessMm", event.target.value)}
              />
            </FieldLabel>

            <FieldLabel
              label={t("Gestosc materialu (kg/m3)", "Material density (kg/m3)")}
              hint={t(
                "Wstepnie ustawiana z presetu, ale mozna ja nadpisac wedlug danych producenta.",
                "Pre-filled from the preset, but you can override it with the manufacturer's data.",
              )}
            >
              <input
                className={inputClassName}
                type="number"
                step="1"
                value={form.densityKgPerM3}
                onChange={(event) => updateField("densityKgPerM3", event.target.value)}
              />
            </FieldLabel>

            <FieldLabel label={t("Zapas (%)", "Waste allowance (%)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.wastePercent}
                onChange={(event) => updateField("wastePercent", event.target.value)}
              />
            </FieldLabel>

            <FieldLabel label={t("Waga worka (kg)", "Bag weight (kg)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.bagWeight}
                onChange={(event) => updateField("bagWeight", event.target.value)}
              />
            </FieldLabel>
          </FieldGrid>
        </div>

        <div className="space-y-4">
          {result ? (
            <ResultGrid>
              <ResultTile
                label={t("Objetosc", "Volume")}
                value={`${formatPlNumber(result.volume, 3, locale)} m3`}
              />
              <ResultTile
                label={t("Material bez zapasu", "Material without waste")}
                value={`${formatPlNumber(result.kgBase, 2, locale)} kg`}
              />
              <ResultTile
                label={t("Material z zapasem", "Material with waste")}
                value={`${formatPlNumber(result.kgTotal, 2, locale)} kg`}
              />
              <ResultTile
                label={t("Liczba workow", "Bag count")}
                value={formatPlNumber(result.bags, 0, locale)}
              />
              <ResultTile
                label={t("Orientacyjny czas schniecia", "Approximate drying time")}
                value={`${formatPlNumber(result.dryTimeDays, 0, locale)} ${t("dni", "days")}`}
              />
            </ResultGrid>
          ) : (
            <InfoBox title={t("Brak wyniku", "No result yet")}>
              {t(
                "Sprawdz, czy wszystkie pola maja dodatnie wartosci.",
                "Check that all fields contain positive values.",
              )}
            </InfoBox>
          )}

          <InfoBox title={t("Podpowiedz dla wybranego materialu", "Hint for the selected material")}>
            {materialHint}
          </InfoBox>
          <InfoBox title={t("Wazne", "Important")}>
            {t(
              "Kalkulator daje wynik zakupowy. Rzeczywisty czas schniecia zalezy od temperatury, wilgotnosci, wentylacji i zalecen producenta.",
              "This calculator is meant for purchasing estimates. Actual drying time depends on temperature, humidity, ventilation, and the manufacturer's guidance.",
            )}
          </InfoBox>
        </div>
      </div>
    </CalculatorShell>
  );
}

export default KalkulatorWylewkiTool;
