import { z } from "zod";

export const kalkulatorOgrzewaniaPodlogowegoInputSchema = z.object({
  pattern: z.enum(["spiral", "meander"]),
  area: z.number().finite().positive(),
  spacingCm: z.number().finite().positive(),
  maxLoopLength: z.number().finite().positive(),
  feedLength: z.number().finite().min(0),
  wastePercent: z.number().finite().min(0),
});

export const kalkulatorOgrzewaniaPodlogowegoOutputSchema = z.object({
  fieldPipeLength: z.number().finite().nonnegative(),
  pipeLength: z.number().finite().nonnegative(),
  loops: z.number().int().nonnegative(),
  loopLength: z.number().finite().nonnegative(),
  manifoldPorts: z.number().int().nonnegative(),
});

export const toolInputSchema = kalkulatorOgrzewaniaPodlogowegoInputSchema;
export const toolOutputSchema = kalkulatorOgrzewaniaPodlogowegoOutputSchema;

export type KalkulatorOgrzewaniaPodlogowegoInput = z.infer<
  typeof kalkulatorOgrzewaniaPodlogowegoInputSchema
>;
export type KalkulatorOgrzewaniaPodlogowegoOutput = z.infer<
  typeof kalkulatorOgrzewaniaPodlogowegoOutputSchema
>;
