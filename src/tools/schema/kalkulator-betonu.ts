import { z } from "zod";

export const kalkulatorBetonuInputSchema = z
  .object({
    projectType: z.enum(["slab", "footing", "post-hole"]),
    length: z.number().finite().positive().optional(),
    width: z.number().finite().positive().optional(),
    thicknessCm: z.number().finite().positive(),
    count: z.number().int().positive(),
    diameterCm: z.number().finite().positive().optional(),
    wastePercent: z.number().finite().min(0),
    bagYield: z.number().finite().positive(),
    readyMixStep: z.number().finite().positive(),
  })
  .superRefine((value, ctx) => {
    if (value.projectType === "post-hole") {
      if (!value.diameterCm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Diameter is required for post holes.",
          path: ["diameterCm"],
        });
      }
      return;
    }

    if (!value.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Length is required for slabs and footings.",
        path: ["length"],
      });
    }

    if (!value.width) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Width is required for slabs and footings.",
        path: ["width"],
      });
    }
  });

export const kalkulatorBetonuOutputSchema = z.object({
  unitVolume: z.number().finite().nonnegative(),
  volume: z.number().finite().nonnegative(),
  volumeWithWaste: z.number().finite().nonnegative(),
  bags: z.number().int().nonnegative(),
  readyMixOrder: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorBetonuInputSchema;
export const toolOutputSchema = kalkulatorBetonuOutputSchema;

export type KalkulatorBetonuInput = z.infer<typeof kalkulatorBetonuInputSchema>;
export type KalkulatorBetonuOutput = z.infer<typeof kalkulatorBetonuOutputSchema>;
