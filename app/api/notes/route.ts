import { parseNoteInput } from "@/lib/schema";
import { toResponse } from "@/lib/errors";
import { extractKeyPhrases } from "@/lib/azure/ai";
import { saveNote, listNotes } from "@/lib/azure/storage";
import { summarize } from "@/lib/summarize";
import { generateQuestions } from "@/lib/questions";

/**
 * POST /api/notes
 * Submit study text. Runs key-phrase extraction (Azure AI Language F0),
 * derives summary and questions, persists to Azure Table Storage.
 * No partial-save: any AI/storage failure rejects the request without
 * persisting; frontend should show retry UI.
 *
 * GET /api/notes
 * Returns { notes: NoteSummary[] } newest-first.
 */

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length"));
    if (contentLength > 35_000) {
      return Response.json(
        { error: { code: "PAYLOAD_TOO_LARGE", message: "Request body too large" } },
        { status: 413 }
      );
    }
    const body = await request.json();
    const { text } = parseNoteInput(body);
    const keyPhrases = await extractKeyPhrases(text);
    const summary = summarize(text, keyPhrases);
    const questions = generateQuestions(keyPhrases);
    const note = await saveNote({ text, summary, keyPhrases, questions });
    return Response.json(note, { status: 201 });
  } catch (err) {
    return toResponse(err);
  }
}

export async function GET() {
  try {
    const notes = await listNotes();

    return Response.json({
      notes: Array.isArray(notes) ? notes : [],
    });
  } catch (err: any) {

    if (
      err?.statusCode === 404 ||
      err?.code === "TableNotFound" ||
      err?.name === "TableNotFound"
    ) {
      return Response.json({ notes: [] });
    }

    return toResponse(err); // real failure
  }
}