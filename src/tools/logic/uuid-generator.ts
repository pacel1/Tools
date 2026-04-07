import { uuidGeneratorInputSchema, uuidGeneratorOutputSchema, type UuidGeneratorInput, type UuidGeneratorOutput } from "@/tools/schema/uuid-generator";

function fallbackUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function runUuidGenerator(input: UuidGeneratorInput): UuidGeneratorOutput {
  const parsed = uuidGeneratorInputSchema.parse(input);
  const values = Array.from({ length: parsed.count }, () => globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : fallbackUuid());
  return uuidGeneratorOutputSchema.parse({ values, formatted: values.join("\n") });
}

export const toolLogic = runUuidGenerator;
