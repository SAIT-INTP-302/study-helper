"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NoteSummary = {
  id: string;
  preview: string;
  createdAt: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/notes")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load notes");
        }
        return res.json();
      })
      .then((data) => {
        setNotes(Array.isArray(data.notes) ? data.notes : []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load notes");
      })
      .finally(() => setLoading(false));
  }, []);

  // loading state
  if (loading) {
    return (
      <p className="p-8 text-center text-gray-500">
        Loading saved notes…
      </p>
    );
  }

  // error state
  if (error) {
    return (
      <main className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-red-500">Failed to load notes</p>

        <Link
          href="/"
          className="inline-block mt-3 text-blue-600 hover:underline text-sm"
        >
          ← Back to home
        </Link>
      </main>
    );
  }

  // empty state
  if (notes.length === 0) {
    return (
      <main className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-gray-500">
          No notes found... create notes to see them here.
        </p>

        <Link
          href="/"
          className="inline-block mt-3 text-blue-600 hover:underline text-sm"
        >
          ← Create your first note
        </Link>
      </main>
    );
  }

  // success state
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Saved Notes</h1>

      <ul className="space-y-4">
        {notes.map((note) => (
          <li
            key={note.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <Link href={`/notes/${note.id}`}>
              <p className="text-sm text-gray-700">{note.preview}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}