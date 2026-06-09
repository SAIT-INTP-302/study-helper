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
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load notes");
        return res.json();
      })
      .then((data) => setNotes(data.notes))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-center">Loading saved notes…</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Saved Notes</h1>

      {notes.length === 0 ? (
        <p className="text-gray-500">No notes saved yet.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <Link href={`/notes/${note.id}`}>
                <p className="text-sm text-gray-700">{note.preview}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}