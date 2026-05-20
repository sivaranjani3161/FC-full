import { FastifyReply } from "fastify";
import { ValidationError } from "./validation";

export function sendError(reply: FastifyReply, status: number, message: string) {
  return reply.status(status).send({ error: message });
}

export function handleControllerError(
  reply: FastifyReply,
  error: unknown,
  fallback = "Internal server error"
) {
  if (error instanceof ValidationError) {
    return sendError(reply, error.statusCode, error.message);
  }
  if (error instanceof Error && "statusCode" in error) {
    const code = (error as { statusCode: number }).statusCode;
    return sendError(reply, code, error.message);
  }
  return sendError(reply, 500, fallback);
}

export class HttpError extends Error {
  constructor(
    message: string,
    readonly statusCode: number
  ) {
    super(message);
    this.name = "HttpError";
  }
}
