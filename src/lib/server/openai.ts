import "server-only";
import OpenAI from "openai";
import { getOpenAIModel } from "@/lib/env";

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for server-side OpenAI usage.");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

export async function requestStructuredServerJson<T>({
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
  const response = await getOpenAIClient().responses.create({
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
    throw new Error("Expected output_text from OpenAI Responses API.");
  }

  return JSON.parse(response.output_text) as T;
}
