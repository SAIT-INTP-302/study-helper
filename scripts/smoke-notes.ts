#!/usr/bin/env bun

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

async function post(text: string) {
  const res = await fetch(`${BASE}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return { res, body: await res.json() };
}

async function main() {
  console.log(`\nSmoke test → ${BASE}\n`);

  // --- Fixture 1: short biology text ---
  const shortText = `The mitochondria is the powerhouse of the cell. It produces ATP through cellular respiration.
  The process involves the electron transport chain and oxidative phosphorylation.
  Mitochondria have their own DNA, which is inherited maternally.
  They are believed to have originated from an ancient symbiotic relationship with bacteria.`;

  // --- Fixture 2: longer history text ---
  const longText = `World War I, also known as the First World War or the Great War, was a global conflict that began in 1914 and ended in 1918.
  It was one of the deadliest conflicts in human history, resulting in the deaths of millions of soldiers and civilians.
  The war began following the assassination of Archduke Franz Ferdinand of Austria in Sarajevo on June 28, 1914.
  This event triggered a complex web of alliances that drew the major European powers into the conflict.
  The Allied Powers included France, Great Britain, Russia, Italy, and later the United States.
  The Central Powers consisted of Germany, Austria-Hungary, the Ottoman Empire, and Bulgaria.
  The war introduced new forms of warfare including trench warfare, poison gas, tanks, and aerial combat.
  The Western Front became a defining theater of the war, characterized by static trench warfare and enormous casualties.
  The Battle of the Somme in 1916 resulted in over one million casualties in a single engagement.
  The war ended with the armistice of November 11, 1918, followed by the Treaty of Versailles in 1919.
  The aftermath reshaped the map of Europe and sowed the seeds for the Second World War.
  The League of Nations was established as a result of the Paris Peace Conference to prevent future conflicts.`;

  console.log("--- POST short note ---");
  const { res: r1, body: note1 } = await post(shortText);
  assert(r1.status === 201, "status 201");
  assert(typeof note1.id === "string" && note1.id.length > 0, "id is string");
  assert(typeof note1.summary === "string" && note1.summary.length > 0, "summary non-empty");
  assert(Array.isArray(note1.keyPhrases), "keyPhrases is array");
  assert(Array.isArray(note1.questions) && note1.questions.length <= 5, "questions array ≤5");
  assert(note1.rawText === shortText, "rawText round-trips");
  assert(typeof note1.createdAt === "string", "createdAt present");

  console.log("\n--- POST long note ---");
  const { res: r2, body: note2 } = await post(longText);
  assert(r2.status === 201, "status 201");
  assert(typeof note2.id === "string" && note2.id.length > 0, "id is string");
  assert(typeof note2.summary === "string" && note2.summary.length > 0, "summary non-empty");
  assert(Array.isArray(note2.keyPhrases), "keyPhrases is array");
  assert(Array.isArray(note2.questions) && note2.questions.length <= 5, "questions array ≤5");
  assert(note2.rawText === longText, "rawText round-trips");

  console.log("\n--- GET /api/notes ---");
  const listRes = await fetch(`${BASE}/api/notes`);
  const listBody = await listRes.json();
  assert(listRes.status === 200, "status 200");
  assert(Array.isArray(listBody.notes) && listBody.notes.length >= 2, "at least 2 notes");
  assert(listBody.notes[0].id === note2.id, "newest note is first (note2)");
  for (const n of listBody.notes) {
    assert(typeof n.id === "string", `note ${n.id} has id`);
    assert(typeof n.preview === "string", `note ${n.id} has preview`);
    assert(typeof n.createdAt === "string", `note ${n.id} has createdAt`);
  }

  console.log("\n--- GET /api/notes/[id] ---");
  const getRes = await fetch(`${BASE}/api/notes/${note1.id}`);
  const getBody = await getRes.json();
  assert(getRes.status === 200, "status 200");
  assert(getBody.rawText === shortText, "rawText matches");
  assert(getBody.id === note1.id, "id matches");

  console.log("\n--- Negative: empty text → 400 ---");
  const { res: emptyRes, body: emptyBody } = await post("");
  assert(emptyRes.status === 400, "status 400");
  assert(emptyBody.error?.code === "INVALID_INPUT", "code INVALID_INPUT");

  console.log("\n--- Negative: oversized text → 400 ---");
  const { res: bigRes, body: bigBody } = await post("a".repeat(31_000));
  assert(bigRes.status === 400, "status 400");
  assert(bigBody.error?.code === "INVALID_INPUT", "code INVALID_INPUT");

  console.log("\n--- Negative: 404 ---");
  const notFoundRes = await fetch(`${BASE}/api/notes/nonexistent-id-00000000`);
  assert(notFoundRes.status === 404, "status 404");

  console.log(`\n${"=".repeat(40)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error("SMOKE FAILED");
    process.exit(1);
  }
  console.log("SMOKE PASSED");
}

main().catch((e) => {
  console.error("Smoke error:", e);
  process.exit(1);
});
