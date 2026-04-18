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
import { runKalkulatorBetonu } from "@/tools/logic/kalkulator-betonu";
import type { KalkulatorBetonuInput } from "@/tools/schema/kalkulator-betonu";

type FormState = {
  projectType: KalkulatorBetonuInput["projectType"];
  length: string;
  width: string;
  thicknessCm: string;
  count: string;
  diameterCm: string;
  wastePercent: string;
  bagYield: string;
  readyMixStep: string;
};

const initialForm: FormState = {
  projectType: "slab",
  length: "5",
  width: "3",
  thicknessCm: "12",
  count: "1",
  diameterCm: "30",
  wastePercent: "10",
  bagYield: "0.025",
  readyMixStep: "0.25",
};

function toInput(form: FormState): KalkulatorBetonuInput {
  return {
    projectType: form.projectType,
    length: parseDecimalInput(form.length) || undefined,
    width: parseDecimalInput(form.width) || undefined,
    thicknessCm: parseDecimalInput(form.thicknessCm),
    count: Math.max(1, Math.round(parseDecimalInput(form.count))),
    diameterCm: parseDecimalInput(form.diameterCm) || undefined,
    wastePercent: parseDecimalInput(form.wastePercent),
    bagYield: parseDecimalInput(form.bagYield),
    readyMixStep: parseDecimalInput(form.readyMixStep),
  };
}

export function KalkulatorBetonuTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<FormState>(initialForm);

  const result = useMemo(() => {
    try {
      return runKalkulatorBetonu(toInput(form));
    } catch {
      return null;
    }
  }, [form]);

  const isPostHole = form.projectType === "post-hole";

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <CalculatorShell
      title={t("Kalkulator betonu", "Concrete calculator")}
      description={t(
        "Wybierz typ projektu i szybko policz objetosc betonu, zapas, liczbe workow oraz bezpieczna wielkosc zamowienia z betoniarni.",
        "Choose the project type and quickly estimate concrete volume, waste allowance, bag count, and a safe ready-mix order size.",
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <FieldGrid>
            <FieldLabel label={t("Typ projektu", "Project type")}>
              <select
                className={selectClassName}
                value={form.projectType}
                onChange={(event) =>
                  updateField("projectType", event.target.value as FormState["projectType"])
                }
              >
                <option value="slab">{t("Plyta", "Slab")}</option>
                <option value="footing">{t("Lawa lub stopa prostokatna", "Footing or rectangular pad")}</option>
                <option value="post-hole">{t("Otwor pod slupek", "Post hole")}</option>
              </select>
            </FieldLabel>

            <FieldLabel
              label={
                isPostHole
                  ? t("Glebokosc otworu (cm)", "Hole depth (cm)")
                  : t("Grubosc lub wysokosc (cm)", "Thickness or height (cm)")
              }
            >
              <input
                className={inputClassName}
                inputMode="decimal"
                type="number"
                step="0.1"
                value={form.thicknessCm}
                onChange={(event) => updateField("thicknessCm", event.target.value)}
              />
            </FieldLabel>

            {isPostHole ? (
              <FieldLabel label={t("Srednica otworu (cm)", "Hole diameter (cm)")}>
                <input
                  className={inputClassName}
                  inputMode="decimal"
                  type="number"
                  step="0.1"
                  value={form.diameterCm}
                  onChange={(event) => updateField("diameterCm", event.target.value)}
                />
              </FieldLabel>
            ) : (
              <>
                <FieldLabel
                  label={
                    form.projectType === "slab"
                      ? t("Dlugosc plyty (m)", "Slab length (m)")
                      : t("Dlugosc elementu (m)", "Element length (m)")
                  }
                >
                  <input
                    className={inputClassName}
                    inputMode="decimal"
                    type="number"
                    step="0.1"
                    value={form.length}
                    onChange={(event) => updateField("length", event.target.value)}
                  />
                </FieldLabel>
                <FieldLabel label={t("Szerokosc (m)", "Width (m)")}>
                  <input
                    className={inputClassName}
                    inputMode="decimal"
                    type="number"
                    step="0.1"
                    value={form.width}
                    onChange={(event) => updateField("width", event.target.value)}
                  />
                </FieldLabel>
              </>
            )}

            <FieldLabel
              label={isPostHole ? t("Liczba otworow", "Number of holes") : t("Liczba elementow", "Number of elements")}
              hint={t(
                "Jesli liczysz jedna plyte lub jedna lawe, zostaw 1.",
                "Leave 1 if you are estimating a single slab or footing.",
              )}
            >
              <input
                className={inputClassName}
                inputMode="numeric"
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
                inputMode="decimal"
                type="number"
                min="0"
                step="0.1"
                value={form.wastePercent}
                onChange={(event) => updateField("wastePercent", event.target.value)}
              />
            </FieldLabel>

            <FieldLabel label={t("Wydajnosc jednego worka (m3)", "Yield per bag (m3)")}>
              <input
                className={inputClassName}
                inputMode="decimal"
                type="number"
                min="0"
                step="0.001"
                value={form.bagYield}
                onChange={(event) => updateField("bagYield", event.target.value)}
              />
            </FieldLabel>

            <FieldLabel
              label={t("Krok zamowienia z betoniarni (m3)", "Ready-mix order step (m3)")}
              hint={t(
                "Czesto przyjmuje sie zamawianie co 0,25 m3 lub 0,5 m3.",
                "Many suppliers effectively round orders to 0.25 m3 or 0.5 m3 steps.",
              )}
            >
              <input
                className={inputClassName}
                inputMode="decimal"
                type="number"
                min="0.01"
                step="0.01"
                value={form.readyMixStep}
                onChange={(event) => updateField("readyMixStep", event.target.value)}
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
                value={`${formatPlNumber(result.volume, 3, locale)} m3`}
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
                label={t("Sugestia zamowienia", "Suggested order")}
                value={`${formatPlNumber(result.readyMixOrder, 2, locale)} m3`}
                hint={t("Zaokraglone do zadanego kroku zamowienia.", "Rounded up to the selected order step.")}
              />
            </ResultGrid>
          ) : (
            <InfoBox title={t("Brak wyniku", "No result yet")}>
              {t(
                "Sprawdz, czy wszystkie aktywne pola maja wartosci wieksze od zera.",
                "Check that every active field contains a value greater than zero.",
              )}
            </InfoBox>
          )}

          <InfoBox title={t("Jak liczymy", "How it works")}>
            {isPostHole
              ? t(
                  "Dla otworow pod slupki liczymy objetosc walca: pi x r2 x glebokosc, a potem mnozymy przez liczbe otworow.",
                  "For post holes we calculate the cylinder volume: pi x r2 x depth, then multiply it by the number of holes.",
                )
              : t(
                  "Dla plyt i law liczymy objetosc prostopadloscianu: dlugosc x szerokosc x wysokosc, a potem mnozymy przez liczbe elementow.",
                  "For slabs and footings we calculate cuboid volume: length x width x height, then multiply it by the number of elements.",
                )}
          </InfoBox>
          <InfoBox title={t("Praktyczna wskazowka", "Practical tip")}>
            {t(
              "Do malych prac worki sprawdzaja sie dobrze, ale przy wiekszych wylewkach i lawach zwykle taniej i bezpieczniej wychodzi beton towarowy z zapasem kilku procent.",
              "Bagged concrete works well for smaller jobs, but larger slabs and footings are usually cheaper and safer with ready-mix ordered with a small reserve.",
            )}
          </InfoBox>
        </div>
      </div>
    </CalculatorShell>
  );
}

export default KalkulatorBetonuTool;
