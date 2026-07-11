const ERROR_CODES = {
  UNAUTHORIZED: "errors.unauthorized",
  NOT_FOUND: "errors.not_found",
  USER_NOT_FOUND: "errors.user_not_found",
  INTERNAL_ERROR: "errors.internal_error",
  FORBIDDEN: "errors.forbidden",
  MISSING_FIELDS: "errors.missing_fields",
  FAILED_TO_SAVE: "errors.failed_to_save",
  FAILED_TO_LOAD: "errors.failed_to_load",
  INVALID_FORMAT: "errors.invalid_format",
  SESSION_NOT_FOUND: "errors.session_not_found",
  SCENARIO_NOT_FOUND: "errors.scenario_not_found",
  WORD_NOT_FOUND: "errors.word_not_found",
  AI_ERROR: "errors.ai_error",
  FAILED_TO_UPLOAD: "errors.failed_to_upload",
  FAILED_TO_GENERATE: "errors.failed_to_generate",
  MUST_BE_ADMIN: "errors.must_be_admin",
} as const;

export function apiError(status: number, code: keyof typeof ERROR_CODES) {
  return new Response(ERROR_CODES[code], { status });
}

export function unauthorized() {
  return apiError(401, "UNAUTHORIZED");
}

export function notFound() {
  return apiError(404, "NOT_FOUND");
}

export function forbidden() {
  return apiError(403, "FORBIDDEN");
}

export function internalError() {
  return apiError(500, "INTERNAL_ERROR");
}
