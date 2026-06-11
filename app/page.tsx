"use client";

import { useState } from "react";
import Link from "next/link";

type NoteResult = {
  id: string;
  summary: string;
  keyPhrases: string[];
  questions: string[];
};

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NoteResult | null>(null);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to process notes");
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Study Helper</h1>
        <Link href="/notes" className="text-blue-600 hover:underline text-sm">
          View Saved Notes →
        </Link>
      </div>

      <p className="text-gray-600">
        Paste your course notes below and get an AI-generated summary,
        key phrases, and review questions.
      </p>

      <textarea
        className="w-full h-48 border rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Paste your course notes here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "Processing…" : "Analyse Notes"}
      </button>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {result && (
        <div className="space-y-6">
          <section>
            <h2 className="font-semibold text-lg mb-2">Summary</h2>
            <p className="rounded p-4 text-sm border
               bg-white text-gray-800 border-gray-200
               dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
              {result.summary}
            </p>
          </section>

          {result.keyPhrases.length > 0 && (
            <section>
              <h2 className="font-semibold text-lg mb-2">Key Phrases</h2>
              <div className="flex flex-wrap gap-2">
                {result.keyPhrases.map((phrase) => (
                  <span
                    key={phrase}
                    className="
                       rounded-full px-3 py-1 text-sm border
                       bg-gray-100 text-gray-800 border-gray-200
                       dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700
                     "
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </section>
          )}

          {result.questions.length > 0 && (
            <section>
              <h2 className="font-semibold text-lg mb-2">Review Questions</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                {result.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </section>
          )}

          <Link
            href={`/notes/${result.id}`}
            className="block text-center text-blue-600 hover:underline text-sm"
          >
            View this note →
          </Link>
        </div>
      )}
    </main>
  );
}