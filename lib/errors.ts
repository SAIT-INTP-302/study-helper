import "server-only";

export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message?: string
  ) {
    super(message ?? code);
    this.name = "AppError";
  }
}

export function toResponse(err: unknown): Response {
  if (err instanceof AppError) {
    console.error(`[AppError] ${err.code}:`, err.message);
    return Response.json(
      { error: { code: err.code, message: err.message } },
      { status: err.status }
    );
  }
  console.error("[UnhandledError]", err);
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
    { status: 500 }
  );
}
