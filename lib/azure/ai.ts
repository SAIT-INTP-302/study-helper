import "server-only";

import {
  TextAnalysisClient,
  AzureKeyCredential,
  type TextAnalysisClientOptions,
} from "@azure/ai-language-text";
import { env } from "../env";
import { AppError } from "../errors";

const client = new TextAnalysisClient(
  env.AZURE_LANGUAGE_ENDPOINT,
  new AzureKeyCredential(env.AZURE_LANGUAGE_KEY),
  { retryOptions: { maxRetries: 0 } } as TextAnalysisClientOptions
);

export async function extractKeyPhrases(text: string): Promise<string[]> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 10_000);
  try {
    const results = await client.analyze(
      "KeyPhraseExtraction",
      [text],
      "en",
      { abortSignal: ac.signal }
    );
    const r = results[0];
    if (r.error) {
      throw new AppError("AI_FAILED", 502, "Key-phrase extraction failed");
    }
    return r.keyPhrases.slice(0, 8);
  } catch (e: unknown) {
    if (ac.signal.aborted) throw new AppError("AI_TIMEOUT", 504);
    if ((e as { statusCode?: number }).statusCode === 429)
      throw new AppError("AI_RATE_LIMITED", 503);
    if (e instanceof AppError) throw e;
    throw new AppError("AI_FAILED", 502);
  } finally {
    clearTimeout(timer);
  }
}
