import { NextResponse } from "next/server";

export const ErrorCodes = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION: "VALIDATION_ERROR",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export interface ApiErrorBody {
  error: string;
  code: ErrorCode;
  details?: unknown;
}

export function apiError(
  error: string,
  code: ErrorCode,
  status: number,
  details?: unknown
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = { error, code };
  if (details !== undefined) body.details = details;
  return NextResponse.json(body, { status });
}

export function unauthorized(message = "Unauthorized") {
  return apiError(message, ErrorCodes.AUTH_REQUIRED, 401);
}

export function forbidden(message = "Forbidden") {
  return apiError(message, ErrorCodes.FORBIDDEN, 403);
}

export function notFound(message = "Not found") {
  return apiError(message, ErrorCodes.NOT_FOUND, 404);
}

export function validationError(message: string, details?: unknown) {
  return apiError(message, ErrorCodes.VALIDATION, 400, details);
}

export function internalError(message = "Something went wrong") {
  return apiError(message, ErrorCodes.INTERNAL, 500);
}
