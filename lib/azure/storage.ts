import "server-only";

import { TableClient, RestError } from "@azure/data-tables";
import { env } from "../env";
import { AppError } from "../errors";
import { makeRowKey } from "../util";
import type { Note, NoteSummary } from "../schema";

interface RawEntity {
  partitionKey: string;
  rowKey: string;
  rawText: string;
  preview: string;
  summary: string;
  keyPhrasesJson: string;
  questionsJson: string;
  createdAt: string;
  etag: string;
  timestamp: Date;
}

const g = globalThis as typeof globalThis & {
  __studyhelper_tableClient?: TableClient;
  __studyhelper_tableReady?: Promise<void>;
};

const tableClient = (g.__studyhelper_tableClient ??=
  TableClient.fromConnectionString(env.AZURE_STORAGE_CONNECTION_STRING, "notes"));

// SDK swallows 409 (table already exists); any other error propagates so
// the first storage call surfaces connectivity failures as STORAGE_WRITE_FAILED.
const tableReady = (g.__studyhelper_tableReady ??=
  tableClient.createTable().then(() => {}));

export async function saveNote(input: {
  text: string;
  summary: string;
  keyPhrases: string[];
  questions: string[];
}): Promise<Note> {
  try {
    await tableReady;
    const rowKey = makeRowKey();
    const createdAt = new Date().toISOString();
    const entity = {
      partitionKey: "note",
      rowKey,
      rawText: input.text,
      preview: input.text.slice(0, 120),
      summary: input.summary,
      keyPhrasesJson: JSON.stringify(input.keyPhrases),
      questionsJson: JSON.stringify(input.questions),
      createdAt,
    };
    await tableClient.createEntity(entity);
    return {
      id: rowKey,
      rawText: input.text,
      summary: input.summary,
      keyPhrases: input.keyPhrases,
      questions: input.questions,
      createdAt,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error("[saveNote]", err);
    throw new AppError("STORAGE_WRITE_FAILED", 502, "Failed to save note");
  }
}

export async function getNote(id: string): Promise<Note | null> {
  try {
    await tableReady;
    const entity = await tableClient.getEntity<RawEntity>("note", id);
    return {
      id: entity.rowKey,
      rawText: entity.rawText,
      summary: entity.summary,
      keyPhrases: JSON.parse(entity.keyPhrasesJson),
      questions: JSON.parse(entity.questionsJson),
      createdAt: entity.createdAt,
    };
  } catch (err) {
    if (err instanceof RestError && err.statusCode === 404) return null;
    console.error("[getNote]", err);
    throw new AppError("STORAGE_READ_FAILED", 502, "Failed to read note");
  }
}

export async function listNotes(limit = 50): Promise<NoteSummary[]> {
  try {
    // Reverse-tick rowKey means ascending lex sort = newest-first; no in-memory reverse needed.
    const iter = tableClient
      .listEntities<Pick<RawEntity, "rowKey" | "preview" | "createdAt">>({
        queryOptions: {
          filter: "PartitionKey eq 'note'",
          select: ["RowKey", "preview", "createdAt"],
        },
      })
      .byPage({ maxPageSize: limit });

    const page = await iter.next();
    const items = page.value ?? [];
    return items.map((e) => ({
      id: e.rowKey,
      preview: e.preview,
      createdAt: e.createdAt,
    }));
  } catch (err) {
    console.error("[listNotes]", err);
    throw new AppError("STORAGE_READ_FAILED", 502, "Failed to list notes");
  }
}
