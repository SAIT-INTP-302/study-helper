import "server-only";

// Max safe ms timestamp (year 9999). Subtracting Date.now() gives a
// descending value so lexicographic sort on rowKey = newest-first.
export const MAX_TICK = 253402300800000;

export function makeRowKey(): string {
  const tick = (MAX_TICK - Date.now()).toString().padStart(16, "0");
  const suffix = crypto.randomUUID().slice(0, 8);
  return `${tick}-${suffix}`;
}
