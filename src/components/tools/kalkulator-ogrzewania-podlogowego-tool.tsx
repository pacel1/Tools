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
import { runKalkulatorOgrzewaniaPodlogowego } from "@/tools/logic/kalkulator-ogrzewania-podlogowego";
import type { KalkulatorOgrzewaniaPodlogowegoInput } from "@/tools/schema/kalkulator-ogrzewania-podlogowego";

type FormState = {
  pattern: KalkulatorOgrzewaniaPodlogowegoInput["pattern"];
  area: string;
  spacingCm: string;
  maxLoopLength: string;
  feedLength: string;
  wastePercent: string;
};

const initialForm: FormState = {
  pattern: "spiral",
  area: "90",
  spacingCm: "15",
  maxLoopLength: "100",
  feedLength: "8",
  wastePercent: "5",
};

function toInput(form: FormState): KalkulatorOgrzewaniaPodlogowegoInput {
  return {
    pattern: form.pattern,
    area: parseDecimalInput(form.area),
    spacingCm: parseDecimalInput(form.spacingCm),
    maxLoopLength: parseDecimalInput(form.maxLoopLength),
    feedLength: parseDecimalInput(form.feedLength),
    wastePercent: parseDecimalInput(form.wastePercent),
  };
}

export function KalkulatorOgrzewaniaPodlogowegoTool() {
  const locale = useConstructionLocale();
  const t = (pl: string, en: string) => pickConstructionText(locale, pl, en);
  const [form, setForm] = useState<FormState>(initialForm);

  const result = useMemo(() => {
    try {
      return runKalkulatorOgrzewaniaPodlogowego(toInput(form));
    } catch {
      return null;
    }
  }, [form]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <CalculatorShell
      title={t("Kalkulator ogrzewania podlogowego", "Underfloor heating calculator")}
      description={t(
        "Oszacuj dlugosc rury, liczbe petli i liczbe obwodow rozdzielacza dla wodnego ogrzewania podlogowego.",
        "Estimate pipe length, loop count, and manifold circuit count for hydronic underfloor heating.",
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <FieldGrid>
            <FieldLabel label={t("Uklad rur", "Pipe pattern")}>
              <select
                className={selectClassName}
                value={form.pattern}
                onChange={(event) =>
                  updateField("pattern", event.target.value as FormState["pattern"])
                }
              >
                <option value="spiral">{t("Spiralny", "Spiral")}</option>
                <option value="meander">{t("Meander", "Meander")}</option>
              </select>
            </FieldLabel>
            <FieldLabel label={t("Powierzchnia grzana (m2)", "Heated area (m2)")}>
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.area}
                onChange={(event) => updateField("area", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Rozstaw rur (cm)", "Pipe spacing (cm)")}>
              <input
                className={inputClassName}
                type="number"
                step="1"
                value={form.spacingCm}
                onChange={(event) => updateField("spacingCm", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={t("Maksymalna dlugosc petli (m)", "Maximum loop length (m)")}>
              <input
                className={inputClassName}
                type="number"
                step="1"
                value={form.maxLoopLength}
                onChange={(event) => updateField("maxLoopLength", event.target.value)}
              />
            </FieldLabel>
            <FieldLabel
              label={t("Dodatkowa dlugosc na dojscie do rozdzielacza (m)", "Extra length to the manifold (m)")}
              hint={t("Liczona dla kazdej petli osobno.", "Calculated for each loop separately.")}
            >
              <input
                className={inputClassName}
                type="number"
                step="0.1"
                value={form.feedLength}
                onChange={(event) => updateField("feedLength", event.target.value)}
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
              <ResultTile label={t("Rura w polu grzewczym", "Pipe in heated area")} value={`${formatPlNumber(result.fieldPipeLength, 2, locale)} m`} />
              <ResultTile label={t("Laczna dlugosc rury", "Total pipe length")} value={`${formatPlNumber(result.pipeLength, 2, locale)} m`} />
              <ResultTile label={t("Liczba petli", "Loop count")} value={formatPlNumber(result.loops, 0, locale)} />
              <ResultTile label={t("Srednia dlugosc petli", "Average loop length")} value={`${formatPlNumber(result.loopLength, 2, locale)} m`} />
              <ResultTile label={t("Obwody rozdzielacza", "Manifold circuits")} value={formatPlNumber(result.manifoldPorts, 0, locale)} />
            </ResultGrid>
          ) : (
            <InfoBox title={t("Brak wyniku", "No result yet")}>
              {t(
                "Sprawdz, czy pola sa dodatnie i czy rozstaw rur nie jest zerowy.",
                "Check that the fields are positive and that the pipe spacing is greater than zero.",
              )}
            </InfoBox>
          )}

          <InfoBox title={t("Jak czytac wynik", "How to read the result")}>
            {t(
              "Jezeli srednia petla wychodzi zbyt dluga jak na producenta rury albo projekt instalacji, zmniejsz maksymalna dlugosc petli lub zwieksz liczbe obwodow.",
              "If the average loop is too long for the pipe manufacturer or installation design, reduce the maximum loop length or increase the number of circuits.",
            )}
          </InfoBox>
        </div>
      </div>
    </CalculatorShell>
  );
}

export default KalkulatorOgrzewaniaPodlogowegoTool;
