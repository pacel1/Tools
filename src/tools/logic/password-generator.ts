import { passwordGeneratorInputSchema, passwordGeneratorOutputSchema, type PasswordGeneratorInput, type PasswordGeneratorOutput } from "@/tools/schema/password-generator";

const groups = {
  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lowercase: "abcdefghijkmnopqrstuvwxyz",
  numbers: "23456789",
  symbols: "!@#$%^&*()-_=+?"
} as const;

function randomIndex(limit: number) {
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return values[0] % limit;
  }
  return Math.floor(Math.random() * limit);
}

export function runPasswordGenerator(input: PasswordGeneratorInput): PasswordGeneratorOutput {
  const parsed = passwordGeneratorInputSchema.parse(input);
  const charset = [parsed.uppercase ? groups.uppercase : "", parsed.lowercase ? groups.lowercase : "", parsed.numbers ? groups.numbers : "", parsed.symbols ? groups.symbols : ""].join("") || groups.lowercase;
  let password = "";
  for (let index = 0; index < parsed.length; index += 1) {
    password += charset[randomIndex(charset.length)];
  }
  return passwordGeneratorOutputSchema.parse({ password, length: password.length });
}

export const toolLogic = runPasswordGenerator;
