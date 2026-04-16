import type { FastifyReply } from "fastify";

export type ApiSuccessResponse<T> = {
  kind: string;
  totalItems: number;
  itemsLength: number;
  items: T[];
};

export type ApiErrorItem = {
  code: string;
  message: string;
};

export type ApiErrorResponse = {
  errors: ApiErrorItem[];
};

function toItemsArray<T>(items: T | T[]) {
  return Array.isArray(items) ? items : [items];
}

export function createSuccessResponse<T>(
  kind: string,
  items: T | T[],
  totalItems?: number
): ApiSuccessResponse<T> {
  const normalizedItems = toItemsArray(items);
  return {
    kind,
    totalItems: totalItems ?? normalizedItems.length,
    itemsLength: normalizedItems.length,
    items: normalizedItems,
  };
}

export function sendSuccess<T>(
  reply: FastifyReply,
  input: {
    status: 200 | 201 | 202 | 204;
    kind: string;
    items: T | T[];
    totalItems?: number;
  }
) {
  return reply
    .status(input.status)
    .send(createSuccessResponse(input.kind, input.items, input.totalItems));
}

export function createErrorResponse(
  errors: ApiErrorItem | ApiErrorItem[]
): ApiErrorResponse {
  return {
    errors: Array.isArray(errors) ? errors : [errors],
  };
}

export function sendError(
  reply: FastifyReply,
  status: 400 | 401 | 402 | 403 | 404 | 405 | 409 | 429 | 500,
  errors: ApiErrorItem | ApiErrorItem[]
) {
  return reply.status(status).send(createErrorResponse(errors));
}
