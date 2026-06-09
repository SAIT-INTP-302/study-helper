import { toResponse } from "@/lib/errors";
import { getNote } from "@/lib/azure/storage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const note = await getNote(id);
    if (!note) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Note not found" } },
        { status: 404 }
      );
    }
    return Response.json(note);
  } catch (err) {
    return toResponse(err);
  }
}
