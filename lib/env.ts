import "server-only";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export const env = {
  AZURE_STORAGE_CONNECTION_STRING: requireEnv("AZURE_STORAGE_CONNECTION_STRING"),
  AZURE_LANGUAGE_KEY: requireEnv("AZURE_LANGUAGE_KEY"),
  AZURE_LANGUAGE_ENDPOINT: requireEnv("AZURE_LANGUAGE_ENDPOINT"),
};
