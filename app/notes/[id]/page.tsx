"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Note = {
  id: string;
  rawText: string;
  summary: string;
  keyPhrases: string[];
  questions: string[];
  createdAt: string;
};

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/notes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Note not found");
        return res.json();
      })
      .then(setNote)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-8 text-center">Loading note…</p>;
  if (error || !note) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <Link href="/notes" className="text-blue-600 hover:underline text-sm">
        ← All Notes
      </Link>

      <p className="text-gray-400 text-sm">
        Saved on {new Date(note.createdAt).toLocaleDateString()}
      </p>

      <section>
        <h2 className="font-semibold text-lg mb-2">Original Notes</h2>
        <pre className="bg-gray-50 border rounded p-4 text-sm whitespace-pre-wrap">
          {note.rawText}
        </pre>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">AI Summary</h2>
        <p className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
          {note.summary}
        </p>
      </section>

      {note.keyPhrases.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-2">Key Phrases</h2>
          <div className="flex flex-wrap gap-2">
            {note.keyPhrases.map((phrase) => (
              <span key={phrase} className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                {phrase}
              </span>
            ))}
          </div>
        </section>
      )}

      {note.questions.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-2">Review Questions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            {note.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}