import { z } from 'zod';

export const kalkulatorPlytGkInputSchema = z.object({
  area: z.number().finite().positive('Powierzchnia zabudowy musi byc wieksza od 0.'),
  boardWidthCm: z.number().finite().positive('Szerokosc plyty musi byc wieksza od 0.'),
  boardHeightCm: z.number().finite().positive('Wysokosc plyty musi byc wieksza od 0.'),
  wastePercent: z.number().finite().min(0, 'Zapas nie moze byc ujemny.').max(100, 'Zapas nie moze przekraczac 100%.'),
  screwsPerBoard: z.number().finite().positive('Liczba wkretow na plyte musi byc wieksza od 0.'),
  profilesPerSqm: z.number().finite().min(0, 'Ilosc profili na m2 nie moze byc ujemna.')
});

export const kalkulatorPlytGkOutputSchema = z.object({
  boards: z.number().finite().nonnegative(),
  screws: z.number().finite().nonnegative(),
  profilesMeters: z.number().finite().nonnegative()
});

export const toolInputSchema = kalkulatorPlytGkInputSchema;
export const toolOutputSchema = kalkulatorPlytGkOutputSchema;

export type KalkulatorPlytGkInput = z.infer<typeof kalkulatorPlytGkInputSchema>;
export type KalkulatorPlytGkOutput = z.infer<typeof kalkulatorPlytGkOutputSchema>;
