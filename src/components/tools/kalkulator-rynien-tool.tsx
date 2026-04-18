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
import { runKalkulatorRynien } from "@/tools/logic/kalkulator-rynien";
import type { KalkulatorRynienInput } from "@/tools/schema/kalkulator-rynien";

type FormState = {
  roofType: KalkulatorRynienInput["roofType"];
  buildingLength: string;
  buildingWidth: string;
  downspoutSpacing: string;
  hangerSpacingCm: string;
  wastePercent: string;
};

const initialForm: FormState = {
  roofType: "gable",
  buildingLength: "10",
  buildingWidth: "8",
  downspoutSpacing: "10",
  hangerSpacingCm: "50",
  wastePercent: "5",
};

function toInput(form: FormState): KalkulatorRynienInput {
  return {
    roofType: form.roofType,
    buildingLength: parseDecimalInput(form.buildingLength),
    buildingWidth: parseDecimalInput(form.buildingWidth),
    downspoutSpacing: parseDecimalInput(form.downspoutSpacing),
    hangerSpacingCm: parseDecimalInput(form.hangerSpacingCm),
    wastePercent: parseDecimalInput(form.wastePercent),
  };
}

export function KalkulatorRynienTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<FormState>(initialForm);

  const result = useMemo(() => {
    try {
      return runKalkulatorRynien(toInput(form));
    } catch {
      return null;
    }
  }, [form]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <CalculatorShell
      title={t("Kalkulator rynien", "Gutter calculator")}
      description={t(
        "Oszacuj dlugosc rynien, liczbe odcinkow 3 m, hakow i rur spustowych dla najczestszych ukladow dachu.",
        "Estimate gutter length, number of 3 m sections, hangers, and downpipes for the most common roof layouts.",
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <FieldGrid>
            <FieldLabel label={t("Typ dachu", "Roof type")}>
              <select
                className={selectClassName}
                value={form.roofType}
                onChange={(event) =>
                  updateField("roofType", event.target.value as FormState["roofType"])
                }
              >
                <option value="gable">{t("Dwuspadowy", "Gable")}</option>
                <option value="hip">{t("Czterospadowy", "Hip")}</option>
                <option value="shed">{t("Jednospadowy", "Shed")}</option>
              </select>
            </FieldLabel>
            <FieldLabel label={t("Dlugosc budynku (m)", "Building length (m)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.buildingLength}
                onChange={(event) => updateField("buildingLength", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Szerokosc budynku (m)", "Building width (m)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.buildingWidth}
                onChange={(event) => updateField("buildingWidth", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Rozstaw rur spustowych (m)", "Downspout spacing (m)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.downspoutSpacing}
                onChange={(event) => updateField("downspoutSpacing", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Rozstaw hakow (cm)", "Hanger spacing (cm)")}>
              <input
                className={inputClassName}
                type="number"
                step="1"
                value={form.hangerSpacingCm}
                onChange={(event) => updateField("hangerSpacingCm", event.target.value)}
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
          </FieldGrid>
        </div>

        <div className="space-y-4">
          {result ? (
            <ResultGrid>
              <ResultTile label={t("Rynny lacznie", "Total gutters")} value={`${formatPlNumber(result.gutterMeters, 2, locale)} mb`} />
              <ResultTile label={t("Odcinki 3 m", "3 m sections")} value={formatPlNumber(result.sections3m, 0, locale)} />
              <ResultTile label={t("Haki", "Hangers")} value={formatPlNumber(result.hangers, 0, locale)} />
              <ResultTile label={t("Rury spustowe", "Downpipes")} value={formatPlNumber(result.downspouts, 0, locale)} />
              <ResultTile label={t("Narozniki", "Corners")} value={formatPlNumber(result.corners, 0, locale)} />
            </ResultGrid>
          ) : (
            <InfoBox title={t("Brak wyniku", "No result yet")}>
              {t(
                "Sprawdz, czy pola wymiarowe maja dodatnie wartosci.",
                "Check that the dimensional fields contain positive values.",
              )}
            </InfoBox>
          )}

          <InfoBox title={t("Wskazowka montazowa", "Installation note")}>
            {t(
              "Przy dachach wietrznych lub z duzym obciazeniem sniegiem warto sprawdzic zalecany rozstaw hakow konkretnego systemu rynnowego.",
              "For windy roofs or areas with heavy snow load, it is worth checking the hanger spacing recommended by the specific gutter system.",
            )}
          </InfoBox>
        </div>
      </div>
    </CalculatorShell>
  );
}

export default KalkulatorRynienTool;
