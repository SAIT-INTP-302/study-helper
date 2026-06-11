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

  if (loading)
    return (
      <p className="p-8 text-center text-gray-500 dark:text-gray-400">
        Loading note…
      </p>
    );

  if (error || !note)
    return (
      <p className="p-8 text-center text-red-500 dark:text-red-400">
        {error}
      </p>
    );

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6 bg-white dark:bg-gray-950 text-black dark:text-white min-h-screen">

      {/* Back */}
      <Link
        href="/notes"
        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
      >
        ← All Notes
      </Link>

      {/* Date */}
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Saved on {new Date(note.createdAt).toLocaleDateString()}
      </p>

      {/* Original Notes */}
      <section>
        <h2 className="font-semibold text-lg mb-2">Original Notes</h2>
        <pre className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-4 text-sm whitespace-pre-wrap text-black dark:text-gray-200">
          {note.rawText}
        </pre>
      </section>

      {/* AI Summary */}
      <section>
        <h2 className="font-semibold text-lg mb-2">AI Summary</h2>
        <p className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded p-4 text-sm text-black dark:text-gray-100">
          {note.summary}
        </p>
      </section>

      {/* Key Phrases */}
      {note.keyPhrases.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-2">Key Phrases</h2>
          <div className="flex flex-wrap gap-2">
            {note.keyPhrases.map((phrase) => (
              <span
                key={phrase}
                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1 text-sm"
              >
                {phrase}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Questions */}
      {note.questions.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-2">Review Questions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-black dark:text-gray-200">
            {note.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}