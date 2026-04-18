import { kalkulatorPlytGkInputSchema, kalkulatorPlytGkOutputSchema, type KalkulatorPlytGkInput, type KalkulatorPlytGkOutput } from '../schema/kalkulator-plyt-gk';

export function run(input: KalkulatorPlytGkInput): KalkulatorPlytGkOutput {
  const parsed = kalkulatorPlytGkInputSchema.parse(input);
  const boardAreaM2 = (parsed.boardWidthCm / 100) * (parsed.boardHeightCm / 100);

  if (boardAreaM2 <= 0) {
    throw new Error('Powierzchnia plyty musi byc wieksza od 0.');
  }

  const boardsWithoutWaste = parsed.area / boardAreaM2;
  const boards = Math.ceil(boardsWithoutWaste * (1 + parsed.wastePercent / 100));
  const screws = Math.ceil(boards * parsed.screwsPerBoard);
  const profilesMeters = Number((parsed.area * parsed.profilesPerSqm).toFixed(2));

  return kalkulatorPlytGkOutputSchema.parse({
    boards,
    screws,
    profilesMeters
  });
}

export const toolLogic = run;
