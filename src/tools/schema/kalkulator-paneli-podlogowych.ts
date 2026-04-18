import { z } from "zod";

export const kalkulatorPaneliPodlogowychInputSchema = z.object({
  area: z.coerce.number().finite().positive("Powierzchnia podlogi musi byc wieksza od 0."),
  panelWidthCm: z.coerce.number().finite().positive("Szerokosc panela musi byc wieksza od 0."),
  panelLengthCm: z.coerce.number().finite().positive("Dlugosc panela musi byc wieksza od 0."),
  wastePercent: z.coerce
    .number()
    .finite()
    .min(0, "Zapas na docinki nie moze byc ujemny.")
    .max(100, "Zapas na docinki nie moze przekraczac 100%"),
  packCoverage: z.coerce.number().finite().positive("Pokrycie jednej paczki musi byc wieksze od 0."),
});

export const kalkulatorPaneliPodlogowychOutputSchema = z.object({
  panels: z.number().finite().nonnegative(),
  packs: z.number().finite().nonnegative(),
  areaWithWaste: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorPaneliPodlogowychInputSchema;
export const toolOutputSchema = kalkulatorPaneliPodlogowychOutputSchema;
