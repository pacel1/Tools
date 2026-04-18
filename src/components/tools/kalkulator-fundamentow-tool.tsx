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
import { runKalkulatorFundamentow } from "@/tools/logic/kalkulator-fundamentow";
import type { KalkulatorFundamentowInput } from "@/tools/schema/kalkulator-fundamentow";

type FormState = {
  projectType: KalkulatorFundamentowInput["projectType"];
  length: string;
  width: string;
  heightCm: string;
  count: string;
  wastePercent: string;
  bagYield: string;
};

const initialForm: FormState = {
  projectType: "strip-footing",
  length: "20",
  width: "0.4",
  heightCm: "40",
  count: "1",
  wastePercent: "8",
  bagYield: "0.025",
};

function toInput(form: FormState): KalkulatorFundamentowInput {
  return {
    projectType: form.projectType,
    length: parseDecimalInput(form.length),
    width: parseDecimalInput(form.width),
    heightCm: parseDecimalInput(form.heightCm),
    count: Math.max(1, Math.round(parseDecimalInput(form.count))),
    wastePercent: parseDecimalInput(form.wastePercent),
    bagYield: parseDecimalInput(form.bagYield),
  };
}

export function KalkulatorFundamentowTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<FormState>(initialForm);

  const result = useMemo(() => {
    try {
      return runKalkulatorFundamentow(toInput(form));
    } catch {
      return null;
    }
  }, [form]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <CalculatorShell
      title={t("Kalkulator fundamentow", "Foundation calculator")}
      description={t(
        "Oszacuj beton i powierzchnie do hydroizolacji dla lawy fundamentowej, plyty fundamentowej albo stopy pod slupek.",
        "Estimate concrete volume and waterproofing area for a strip footing, foundation slab, or post pad footing.",
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <FieldGrid>
            <FieldLabel label={t("Typ fundamentu", "Foundation type")}>
              <select
                className={selectClassName}
                value={form.projectType}
                onChange={(event) =>
                  updateField("projectType", event.target.value as FormState["projectType"])
                }
              >
                <option value="strip-footing">{t("Lawa fundamentowa", "Strip footing")}</option>
                <option value="slab">{t("Plyta fundamentowa", "Foundation slab")}</option>
                <option value="pad-footing">{t("Stopa pod slupek", "Pad footing")}</option>
              </select>
            </FieldLabel>

            <FieldLabel
              label={
                form.projectType === "strip-footing"
                  ? t("Laczna dlugosc lawy (m)", "Total footing length (m)")
                  : t("Dlugosc elementu (m)", "Element length (m)")
              }
            >
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.length}
                onChange={(event) => updateField("length", event.target.value)}
              />
            </FieldLabel>

            <FieldLabel label={t("Szerokosc (m)", "Width (m)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.width}
                onChange={(event) => updateField("width", event.target.value)}
              />
            </FieldLabel>

            <FieldLabel
              label={
                form.projectType === "slab"
                  ? t("Grubosc plyty (cm)", "Slab thickness (cm)")
                  : t("Wysokosc fundamentu (cm)", "Foundation height (cm)")
              }
            >
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.heightCm}
                onChange={(event) => updateField("heightCm", event.target.value)}
              />
            </FieldLabel>

            <FieldLabel label={t("Liczba elementow", "Number of elements")}>
              <input
                className={inputClassName}
                type="number"
                min="1"
                step="1"
                value={form.count}
                onChange={(event) => updateField("count", event.target.value)}
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

            <FieldLabel label={t("Wydajnosc jednego worka (m3)", "Yield per bag (m3)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.001"
                value={form.bagYield}
                onChange={(event) => updateField("bagYield", event.target.value)}
              />
            </FieldLabel>
          </FieldGrid>
        </div>

        <div className="space-y-4">
          {result ? (
            <ResultGrid>
              <ResultTile
                label={t("Objetosc jednego elementu", "Volume per element")}
                value={`${formatPlNumber(result.unitVolume, 3, locale)} m3`}
              />
              <ResultTile
                label={t("Laczna objetosc", "Total volume")}
                value={`${formatPlNumber(result.totalVolume, 3, locale)} m3`}
              />
              <ResultTile
                label={t("Objetosc z zapasem", "Volume with waste")}
                value={`${formatPlNumber(result.volumeWithWaste, 3, locale)} m3`}
              />
              <ResultTile
                label={t("Liczba workow", "Bag count")}
                value={formatPlNumber(result.bags, 0, locale)}
              />
              <ResultTile
                label={t("Powierzchnia do hydroizolacji", "Waterproofing area")}
                value={`${formatPlNumber(result.waterproofArea, 2, locale)} m2`}
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

          <InfoBox title={t("Po co powierzchnia do hydroizolacji", "Why waterproofing area matters")}>
            {t(
              "Ten wynik pomaga orientacyjnie policzyc ilosc masy KMB, papy albo folii do izolacji pionowej fundamentu.",
              "This estimate helps you approximate how much waterproofing compound, membrane, or foil you may need for vertical foundation insulation.",
            )}
          </InfoBox>
        </div>
      </div>
    </CalculatorShell>
  );
}

export default KalkulatorFundamentowTool;
