import { z } from 'zod';

export const kalkulatorFugiInputSchema = z.object({
  area: z.coerce.number().positive('Powierzchnia musi byc wieksza od zera.'),
  tileWidthCm: z.coerce.number().positive('Szerokosc plytki musi byc wieksza od zera.'),
  tileHeightCm: z.coerce.number().positive('Wysokosc plytki musi byc wieksza od zera.'),
  jointWidthMm: z.coerce.number().positive('Szerokosc spoiny musi byc wieksza od zera.'),
  jointDepthMm: z.coerce.number().positive('Glebokosc spoiny musi byc wieksza od zera.'),
  groutDensity: z.coerce.number().positive('Gestosc fugi musi byc wieksza od zera.').default(1.8),
  wastePercent: z.coerce.number().min(0, 'Zapas nie moze byc ujemny.').max(100, 'Zapas nie moze przekraczac 100%.').default(10),
  bagWeight: z.coerce.number().positive('Waga worka musi byc wieksza od zera.')
});

export const kalkulatorFugiOutputSchema = z.object({
  kgBase: z.number(),
  kgTotal: z.number(),
  bags: z.number()
});

export const toolInputSchema = kalkulatorFugiInputSchema;
export const toolOutputSchema = kalkulatorFugiOutputSchema;
