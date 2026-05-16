import {
  randomTokenGeneratorInputSchema,
  randomTokenGeneratorOutputSchema,
  type RandomTokenGeneratorInput,
  type RandomTokenGeneratorOutput
} from "@/tools/schema/random-token-generator";

const alphabets = {
  base64url: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  hex: "0123456789abcdef",
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
} as const;

function getRandomUint32() {
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return values[0];
  }

  return Math.floor(Math.random() * 0x100000000);
}

function randomIndex(alphabetLength: number) {
  const max = 0x100000000;
  const limit = max - (max % alphabetLength);
  let value = getRandomUint32();

  while (value >= limit) {
    value = getRandomUint32();
  }

  return value % alphabetLength;
}

function generateToken({
  length,
  format,
  prefix
}: {
  length: number;
  format: keyof typeof alphabets;
  prefix: string;
}) {
  const alphabet = alphabets[format];
  let token = "";

  for (let index = 0; index < length; index += 1) {
    token += alphabet[randomIndex(alphabet.length)];
  }

  return `${prefix}${token}`;
}

export function runRandomTokenGenerator(
  input: RandomTokenGeneratorInput
): RandomTokenGeneratorOutput {
  const parsed = randomTokenGeneratorInputSchema.parse(input);
  const tokens = Array.from({ length: parsed.count }, () =>
    generateToken({
      length: parsed.length,
      format: parsed.format,
      prefix: parsed.prefix
    })
  );

  return randomTokenGeneratorOutputSchema.parse({
    tokens,
    formatted: tokens.join("\n"),
    length: parsed.length,
    format: parsed.format
  });
}

export const toolLogic = runRandomTokenGenerator;
