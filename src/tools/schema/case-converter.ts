import { z } from "zod";

export const caseConverterInputSchema = z.object({ text: z.string().min(1, "Enter text to convert.") });
export const caseConverterOutputSchema = z.object({ upper: z.string(), lower: z.string(), title: z.string(), sentence: z.string() });
export const toolInputSchema = caseConverterInputSchema;
export const toolOutputSchema = caseConverterOutputSchema;
export type CaseConverterInput = z.infer<typeof caseConverterInputSchema>;
export type CaseConverterOutput = z.infer<typeof caseConverterOutputSchema>;
