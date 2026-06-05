import OpenAI from "openai";

import { OPENAI_MODEL } from "./constants";

let singleton: OpenAI | null = null;

/**
 * Server-only OpenAI client. Requires `OPENAI_API_KEY` in the environment.
 */
export function getOpenAIClient(): OpenAI {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  singleton ??= new OpenAI({ apiKey });
  return singleton;
}

export type CreateResponseOptions = {
  model?: string;
  instructions?: string;
};

/**
 * Call the Responses API (same surface as the Python SDK example).
 */
export async function createResponse(
  input: string,
  options: CreateResponseOptions = {},
) {
  const client = getOpenAIClient();
  return client.responses.create({
    model: options.model ?? OPENAI_MODEL,
    input,
    ...(options.instructions ? { instructions: options.instructions } : {}),
  });
}

/** Convenience helper: return `output_text` from a Responses API result. */
export async function createResponseText(
  input: string,
  options: CreateResponseOptions = {},
): Promise<string> {
  const response = await createResponse(input, options);
  return response.output_text;
}
