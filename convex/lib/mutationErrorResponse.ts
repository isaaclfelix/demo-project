import { ConvexError } from "convex/values";

function errorMessage(error: unknown): string {
  if (error instanceof ConvexError) {
    return typeof error.data === "string"
      ? error.data
      : JSON.stringify(error.data);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed";
}

function isClientError(message: string): boolean {
  return (
    message.includes("Permalink category") || message.includes("already exists")
  );
}

export function mutationErrorResponse(error: unknown): Response {
  const message = errorMessage(error);

  return new Response(JSON.stringify({ error: message }), {
    status: isClientError(message) ? 400 : 500,
  });
}
