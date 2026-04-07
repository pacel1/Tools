import { sha256GeneratorInputSchema, sha256GeneratorOutputSchema, type Sha256GeneratorInput, type Sha256GeneratorOutput } from "@/tools/schema/sha256-generator";

export async function runSha256Generator(input: Sha256GeneratorInput): Promise<Sha256GeneratorOutput> {
  const parsed = sha256GeneratorInputSchema.parse(input);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(parsed.text));
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return sha256GeneratorOutputSchema.parse({ hash });
}

export const toolLogic = runSha256Generator;
