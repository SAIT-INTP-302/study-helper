import "server-only";

import { AppError } from "./errors";

export type Note = {
  id: string;
  rawText: string;
  summary: string;
  keyPhrases: string[];
  questions: string[];
  createdAt: string;
};

export type NoteSummary = {
  id: string;
  preview: string;
  createdAt: string;
};

const MAX_BYTES = 30 * 1024;

export function parseNoteInput(body: unknown): { text: string } {
  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).text !== "string"
  ) {
    throw new AppError("INVALID_INPUT", 400, "Request body must be JSON with a 'text' string field");
  }
  const text = ((body as Record<string, unknown>).text as string).trim();
  if (text.length === 0) {
    throw new AppError("INVALID_INPUT", 400, "text must not be empty");
  }
  if (Buffer.byteLength(text, "utf8") > MAX_BYTES) {
    throw new AppError("INVALID_INPUT", 400, `text exceeds ${MAX_BYTES} byte limit`);
  }
  return { text };
}
