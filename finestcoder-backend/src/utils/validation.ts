import { ZodError, ZodTypeAny } from "zod";
import type { z } from "zod";

export class ValidationError extends Error {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function formatZodError(error: ZodError): string {
  const fieldErrors = error.flatten().fieldErrors;
  const messages = Object.entries(fieldErrors).flatMap(([key, errs]) =>
    (errs ?? []).map((msg) => `${key}: ${msg}`)
  );
  return messages.length > 0 ? messages.join("; ") : "Validation failed";
}

export function parseBody<T extends ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(formatZodError(result.error));
  }
  return result.data;
}

export function parseParams<T extends ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  return parseBody(schema, data);
}

export function parseQuery<T extends ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  return parseBody(schema, data);
}
