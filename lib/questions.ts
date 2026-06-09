import "server-only";

const TEMPLATES = [
  (p: string) => `What is "${p}"?`,
  (p: string) => `Explain "${p}" in this context.`,
  (p: string) => `Why is "${p}" important?`,
  (p: string) => `Describe the role of "${p}".`,
  (p: string) => `How does "${p}" relate to the main idea?`,
];

export function generateQuestions(keyPhrases: string[]): string[] {
  if (keyPhrases.length === 0) return [];

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const p of keyPhrases) {
    const lc = p.toLowerCase();
    if (!seen.has(lc)) {
      seen.add(lc);
      unique.push(p);
    }
    if (unique.length === 5) break;
  }

  return unique.map((p, i) => TEMPLATES[i % TEMPLATES.length](p));
}
