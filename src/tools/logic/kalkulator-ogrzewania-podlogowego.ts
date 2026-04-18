import {
  kalkulatorOgrzewaniaPodlogowegoInputSchema,
  kalkulatorOgrzewaniaPodlogowegoOutputSchema,
  type KalkulatorOgrzewaniaPodlogowegoInput,
  type KalkulatorOgrzewaniaPodlogowegoOutput,
} from "../schema/kalkulator-ogrzewania-podlogowego";

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

function getPatternFactor(pattern: KalkulatorOgrzewaniaPodlogowegoInput["pattern"]) {
  return pattern === "spiral" ? 1.04 : 1.08;
}

export function runKalkulatorOgrzewaniaPodlogowego(
  input: KalkulatorOgrzewaniaPodlogowegoInput,
): KalkulatorOgrzewaniaPodlogowegoOutput {
  const parsed = kalkulatorOgrzewaniaPodlogowegoInputSchema.parse(input);
  const fieldPipeLength =
    parsed.area * (100 / parsed.spacingCm) * getPatternFactor(parsed.pattern);
  const pipeWithWaste = fieldPipeLength * (1 + parsed.wastePercent / 100);
  const loops = Math.max(1, Math.ceil(pipeWithWaste / parsed.maxLoopLength));
  const pipeLength = pipeWithWaste + loops * parsed.feedLength;
  const loopLength = pipeLength / loops;

  return kalkulatorOgrzewaniaPodlogowegoOutputSchema.parse({
    fieldPipeLength: round(fieldPipeLength),
    pipeLength: round(pipeLength),
    loops,
    loopLength: round(loopLength),
    manifoldPorts: loops,
  });
}

export const toolLogic = runKalkulatorOgrzewaniaPodlogowego;
