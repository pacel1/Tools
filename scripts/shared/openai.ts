import "./load-env";
import OpenAI from "openai";
import { getOpenAIModel } from "@/lib/env";

export function canUseOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

export async function generateStructuredObject<T>({
  name,
  schema,
  system,
  prompt
}: {
  name: string;
  schema: Record<string, unknown>;
  system: string;
  prompt: string;
}): Promise<T> {
  const client = getClient();
  const response = await client.responses.create({
    model: getOpenAIModel(),
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: system }]
      },
      {
        role: "user",
        content: [{ type: "input_text", text: prompt }]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name,
        strict: true,
        schema
      }
    }
  });

  if (!response.output_text) {
    throw new Error("OpenAI response did not include output_text.");
  }

  return JSON.parse(response.output_text) as T;
}
