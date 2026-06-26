import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAI() {
  if (_client) return _client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");
  _client = new OpenAI({ apiKey });
  return _client;
}

/** Canonical GPT-5.5 id when no env override is set. */
export const GPT_5_5 = "gpt-5.5";

export const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? GPT_5_5;

/** Reflechto — defaults to gpt-5.5; override with OPENAI_MIRROR_MODEL. */
export const MIRROR_MODEL = process.env.OPENAI_MIRROR_MODEL ?? GPT_5_5;

/** GPT-5 family chat models reject non-default temperature; omit the field so the API uses its default. */
export function temperatureParam(
  model: string,
  value: number,
): { temperature: number } | Record<string, never> {
  if (model.startsWith("gpt-5")) return {};
  return { temperature: value };
}
