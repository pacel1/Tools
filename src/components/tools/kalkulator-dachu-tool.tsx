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
import { runKalkulatorDachu } from "@/tools/logic/kalkulator-dachu";
import type { KalkulatorDachuInput } from "@/tools/schema/kalkulator-dachu";

type FormState = {
  roofType: KalkulatorDachuInput["roofType"];
  materialType: KalkulatorDachuInput["materialType"];
  buildingLength: string;
  buildingWidth: string;
  pitchDegrees: string;
  eaveCm: string;
  wastePercent: string;
  coveragePerPack: string;
};

const initialForm: FormState = {
  roofType: "gable",
  materialType: "tile",
  buildingLength: "10",
  buildingWidth: "8",
  pitchDegrees: "35",
  eaveCm: "30",
  wastePercent: "10",
  coveragePerPack: "1.2",
};

function toInput(form: FormState): KalkulatorDachuInput {
  return {
    roofType: form.roofType,
    materialType: form.materialType,
    buildingLength: parseDecimalInput(form.buildingLength),
    buildingWidth: parseDecimalInput(form.buildingWidth),
    pitchDegrees: parseDecimalInput(form.pitchDegrees),
    eaveCm: parseDecimalInput(form.eaveCm),
    wastePercent: parseDecimalInput(form.wastePercent),
    coveragePerPack: parseDecimalInput(form.coveragePerPack),
  };
}

export function KalkulatorDachuTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<FormState>(initialForm);

  const result = useMemo(() => {
    try {
      return runKalkulatorDachu(toInput(form));
    } catch {
      return null;
    }
  }, [form]);

  const materialHint =
    form.materialType === "tile"
      ? t(
          "Dla dachowki zwykle warto zalozyc troche wiekszy zapas na docinki i kalenice.",
          "For tile roofs it is usually worth keeping a slightly larger reserve for cuts and ridge elements.",
        )
      : form.materialType === "metal"
        ? t(
            "Blachodachowka lub panele dachowe czesto maja wieksze realne pokrycie jednego arkusza.",
            "Metal tiles and roofing panels often have a higher effective coverage per sheet.",
          )
        : t(
            "Gont bitumiczny zwykle liczy sie paczkami o konkretnym pokryciu netto producenta.",
            "Bitumen shingles are usually sold in packs with a fixed net coverage declared by the manufacturer.",
          );

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <CalculatorShell
      title={t("Kalkulator dachu", "Roof calculator")}
      description={t(
        "Policz powierzchnie dachu dla prostego dachu dwuspadowego lub jednospadowego, dolicz zapas i sprawdz ile paczek albo arkuszy pokrycia trzeba kupic.",
        "Estimate roof area for a simple gable or shed roof, add waste, and see how many packs or sheets of covering you need.",
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
                <option value="shed">{t("Jednospadowy", "Shed")}</option>
              </select>
            </FieldLabel>

            <FieldLabel label={t("Material pokrycia", "Roofing material")}>
              <select
                className={selectClassName}
                value={form.materialType}
                onChange={(event) =>
                  updateField("materialType", event.target.value as FormState["materialType"])
                }
              >
                <option value="tile">{t("Dachowka", "Tile")}</option>
                <option value="metal">{t("Blachodachowka lub panel", "Metal sheet or panel")}</option>
                <option value="shingle">{t("Gont bitumiczny", "Bitumen shingle")}</option>
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

            <FieldLabel label={t("Kat nachylenia (stopnie)", "Pitch angle (degrees)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.pitchDegrees}
                onChange={(event) => updateField("pitchDegrees", event.target.value)}
              />
            </FieldLabel>

            <FieldLabel label={t("Okap z jednej strony (cm)", "Eave overhang on one side (cm)")}>
              <input
                className={inputClassName}
                type="number"
                step="1"
                value={form.eaveCm}
                onChange={(event) => updateField("eaveCm", event.target.value)}
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

            <FieldLabel
              label={t("Pokrycie jednej paczki lub arkusza (m2)", "Coverage per pack or sheet (m2)")}
              hint={t("Wpisz pokrycie netto z karty produktu.", "Enter the net coverage from the product sheet.")}
            >
              <input
                className={inputClassName}
                type="number"
                step="0.01"
                value={form.coveragePerPack}
                onChange={(event) => updateField("coveragePerPack", event.target.value)}
              />
            </FieldLabel>
          </FieldGrid>
        </div>

        <div className="space-y-4">
          {result ? (
            <ResultGrid>
              <ResultTile
                label={t("Dlugosc polaci", "Slope length")}
                value={`${formatPlNumber(result.slopeLength, 2, locale)} m`}
              />
              <ResultTile
                label={t("Powierzchnia dachu", "Roof area")}
                value={`${formatPlNumber(result.roofArea, 2, locale)} m2`}
              />
              <ResultTile
                label={t("Powierzchnia z zapasem", "Area with waste")}
                value={`${formatPlNumber(result.roofAreaWithWaste, 2, locale)} m2`}
              />
              <ResultTile
                label={t("Membrana lub pelne krycie", "Membrane or full decking")}
                value={`${formatPlNumber(result.membraneArea, 2, locale)} m2`}
              />
              <ResultTile
                label={t("Liczba paczek lub arkuszy", "Packs or sheets")}
                value={formatPlNumber(result.packs, 0, locale)}
              />
              <ResultTile
                label={t("Dlugosc kalenicy", "Ridge length")}
                value={`${formatPlNumber(result.ridgeLength, 2, locale)} m`}
                hint={
                  form.roofType === "shed"
                    ? t("Dla dachu jednospadowego kalenica nie wystepuje.", "A shed roof does not have a ridge.")
                    : undefined
                }
              />
            </ResultGrid>
          ) : (
            <InfoBox title={t("Brak wyniku", "No result yet")}>
              {t(
                "Sprawdz wymiary i kat dachu. Kat powinien byc wiekszy od 0 i mniejszy niz 80 stopni.",
                "Check the dimensions and roof pitch. The angle should be greater than 0 and lower than 80 degrees.",
              )}
            </InfoBox>
          )}

          <InfoBox title={t("Na co zwrocic uwage", "What to watch for")}>{materialHint}</InfoBox>
          <InfoBox title={t("Zakres kalkulatora", "Calculator scope")}>
            {t(
              "W tej wersji liczymy prosty dach dwuspadowy albo jednospadowy. To dobry punkt startowy do zamowienia pokrycia, membrany i akcesoriow.",
              "This version estimates a simple gable or shed roof. It is a good starting point for ordering covering, membrane, and accessories.",
            )}
          </InfoBox>
        </div>
      </div>
    </CalculatorShell>
  );
}

export default KalkulatorDachuTool;
