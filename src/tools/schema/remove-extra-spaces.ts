import { z } from "zod";

export const removeExtraSpacesInputSchema = z.object({ text: z.string().min(1, "Enter text to process.") });
export const removeExtraSpacesOutputSchema = z.object({ result: z.string() });
export const toolInputSchema = removeExtraSpacesInputSchema;
export const toolOutputSchema = removeExtraSpacesOutputSchema;
export type RemoveExtraSpacesInput = z.infer<typeof removeExtraSpacesInputSchema>;
export type RemoveExtraSpacesOutput = z.infer<typeof removeExtraSpacesOutputSchema>;
