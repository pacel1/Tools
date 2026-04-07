import { characterCounterInputSchema, characterCounterOutputSchema, type CharacterCounterInput, type CharacterCounterOutput } from "@/tools/schema/character-counter";

export function runCharacterCounter(input: CharacterCounterInput): CharacterCounterOutput {
  const parsed = characterCounterInputSchema.parse(input);
  const characters = parsed.text.length; const secondary = parsed.text.replace(/\s+/g, "").length; const tertiary = parsed.text.trim() ? parsed.text.trim().split(/\s+/).length : 0; const primary = characters;
  return characterCounterOutputSchema.parse({ primary, secondary, tertiary, formatted: String(primary) });
}

export const toolLogic = runCharacterCounter;
