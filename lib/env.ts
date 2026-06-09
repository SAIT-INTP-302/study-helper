import "server-only";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

// Lazy getters: validation runs on first access (request time), not at module
// evaluation, so `next build` succeeds without Azure credentials in the env.
export const env = {
  get AZURE_STORAGE_CONNECTION_STRING() { return requireEnv("AZURE_STORAGE_CONNECTION_STRING"); },
  get AZURE_LANGUAGE_KEY() { return requireEnv("AZURE_LANGUAGE_KEY"); },
  get AZURE_LANGUAGE_ENDPOINT() { return requireEnv("AZURE_LANGUAGE_ENDPOINT"); },
};
