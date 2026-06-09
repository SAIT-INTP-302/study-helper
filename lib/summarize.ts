import "server-only";

export function summarize(text: string, keyPhrases: string[]): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  if (sentences.length === 0) return text;
  if (sentences.length <= 3) return sentences.join(" ");

  if (keyPhrases.length === 0) {
    return sentences.slice(0, 3).join(" ");
  }

  const lower = keyPhrases.map((p) => p.toLowerCase());

  const scored = sentences.map((sentence, idx) => {
    const lc = sentence.toLowerCase();
    const score = lower.reduce(
      (acc, phrase) => acc + (lc.includes(phrase) ? 1 : 0),
      0
    );
    return { sentence, score, idx };
  });

  // Pick top 3 by score, break ties by original order (stable since sort is stable)
  const top = [...scored]
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .slice(0, 3)
    .sort((a, b) => a.idx - b.idx);

  return top.map((t) => t.sentence).join(" ");
}
