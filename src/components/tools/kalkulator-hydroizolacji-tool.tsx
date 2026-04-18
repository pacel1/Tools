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
import { runKalkulatorHydroizolacji } from "@/tools/logic/kalkulator-hydroizolacji";
import type { KalkulatorHydroizolacjiInput } from "@/tools/schema/kalkulator-hydroizolacji";

type FormState = {
  surfaceType: KalkulatorHydroizolacjiInput["surfaceType"];
  area: string;
  coats: string;
  coverage: string;
  wastePercent: string;
  packSize: string;
  tapeMeters: string;
};

const presets: Record<
  FormState["surfaceType"],
  { coats: string; coverage: string; packSize: string }
> = {
  bathroom: {
    coats: "2",
    coverage: "1.2",
    packSize: "5",
  },
  balcony: {
    coats: "2",
    coverage: "1",
    packSize: "10",
  },
  terrace: {
    coats: "2",
    coverage: "0.9",
    packSize: "10",
  },
  foundation: {
    coats: "2",
    coverage: "0.8",
    packSize: "20",
  },
};

const initialForm: FormState = {
  surfaceType: "bathroom",
  area: "20",
  coats: presets.bathroom.coats,
  coverage: presets.bathroom.coverage,
  wastePercent: "10",
  packSize: presets.bathroom.packSize,
  tapeMeters: "18",
};

function toInput(form: FormState): KalkulatorHydroizolacjiInput {
  return {
    surfaceType: form.surfaceType,
    area: parseDecimalInput(form.area),
    coats: Math.max(1, Math.round(parseDecimalInput(form.coats))),
    coverage: parseDecimalInput(form.coverage),
    wastePercent: parseDecimalInput(form.wastePercent),
    packSize: parseDecimalInput(form.packSize),
    tapeMeters: parseDecimalInput(form.tapeMeters),
  };
}

export function KalkulatorHydroizolacjiTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<FormState>(initialForm);

  const result = useMemo(() => {
    try {
      return runKalkulatorHydroizolacji(toInput(form));
    } catch {
      return null;
    }
  }, [form]);

  const surfaceHint =
    form.surfaceType === "bathroom"
      ? t(
          "W lazience najczesciej liczy sie folie w plynie i tasme uszczelniajaca przy narozach i przejsciach.",
          "Bathrooms usually rely on liquid waterproofing and sealing tape around corners and service penetrations.",
        )
      : form.surfaceType === "balcony"
        ? t(
            "Na balkonach i loggiach warto zalozyc zapas na detale, slupki balustrad i spadki przy krawedziach.",
            "For balconies and loggias it is worth adding extra material for details, railing posts, and edge falls.",
          )
        : form.surfaceType === "terrace"
          ? t(
              "Tarasy zewnetrzne zwykle wymagaja pelniejszej izolacji i uwzglednienia stref przy progach oraz odplywach.",
              "Outdoor terraces usually need fuller waterproofing and extra attention around thresholds and drains.",
            )
          : t(
              "Dla fundamentow uwzglednij tez zaklady, nierownosci sciany i trudne miejsca przy lawie.",
              "For foundations, also account for overlaps, wall irregularities, and difficult transitions around the footing.",
            );

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateSurfaceType(nextType: FormState["surfaceType"]) {
    setForm((current) => ({
      ...current,
      surfaceType: nextType,
      coats: presets[nextType].coats,
      coverage: presets[nextType].coverage,
      packSize: presets[nextType].packSize,
    }));
  }

  return (
    <CalculatorShell
      title={t("Kalkulator hydroizolacji", "Waterproofing calculator")}
      description={t(
        "Policz ilosc folii w plynie lub masy hydroizolacyjnej oraz dlugosc tasmy uszczelniajacej dla lazienki, balkonu, tarasu albo fundamentu.",
        "Estimate liquid waterproofing or membrane quantity and sealing tape length for a bathroom, balcony, terrace, or foundation.",
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <FieldGrid>
            <FieldLabel label={t("Rodzaj powierzchni", "Surface type")}>
              <select
                className={selectClassName}
                value={form.surfaceType}
                onChange={(event) =>
                  updateSurfaceType(event.target.value as FormState["surfaceType"])
                }
              >
                <option value="bathroom">{t("Lazienka", "Bathroom")}</option>
                <option value="balcony">{t("Balkon", "Balcony")}</option>
                <option value="terrace">{t("Taras", "Terrace")}</option>
                <option value="foundation">{t("Fundament", "Foundation")}</option>
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
            <FieldLabel label={t("Liczba warstw", "Number of coats")}>
              <input
                className={inputClassName}
                type="number"
                min="1"
                step="1"
                value={form.coats}
                onChange={(event) => updateField("coats", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Wydajnosc (m2 z 1 kg lub 1 l)", "Coverage (m2 from 1 kg or 1 l)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.coverage}
                onChange={(event) => updateField("coverage", event.target.value)}
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
            <FieldLabel label={t("Wielkosc opakowania (kg lub l)", "Pack size (kg or l)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.packSize}
                onChange={(event) => updateField("packSize", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel
              label={t("Dlugosc tasmy uszczelniajacej (m)", "Sealing tape length (m)")}
              hint={t(
                "Narozniki, styki sciana-podloga, przejscia instalacyjne.",
                "Corners, wall-floor junctions, and service penetrations.",
              )}
            >
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.tapeMeters}
                onChange={(event) => updateField("tapeMeters", event.target.value)}
              />
            </FieldLabel>
          </FieldGrid>
        </div>

        <div className="space-y-4">
          {result ? (
            <ResultGrid>
              <ResultTile label={t("Material bez zapasu", "Material without waste")} value={formatPlNumber(result.quantityBase, 2, locale)} />
              <ResultTile label={t("Material z zapasem", "Material with waste")} value={formatPlNumber(result.quantityTotal, 2, locale)} />
              <ResultTile label={t("Liczba opakowan", "Pack count")} value={formatPlNumber(result.packs, 0, locale)} />
              <ResultTile label={t("Tasma uszczelniajaca", "Sealing tape")} value={`${formatPlNumber(result.tapeLength, 2, locale)} m`} />
            </ResultGrid>
          ) : (
            <InfoBox title={t("Brak wyniku", "No result yet")}>
              {t(
                "Sprawdz, czy powierzchnia, wydajnosc i wielkosc opakowania maja dodatnie wartosci.",
                "Check that area, coverage, and pack size contain positive values.",
              )}
            </InfoBox>
          )}

          <InfoBox title={t("Wskazowka dla wybranej powierzchni", "Hint for the selected surface")}>
            {surfaceHint}
          </InfoBox>
        </div>
      </div>
    </CalculatorShell>
  );
}

export default KalkulatorHydroizolacjiTool;
