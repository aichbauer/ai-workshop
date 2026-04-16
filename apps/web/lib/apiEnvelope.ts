export type ApiSuccessEnvelope<T> = {
  kind: string;
  totalItems: number;
  itemsLength: number;
  items: T[];
};

type ApiErrorEnvelope = {
  errors?: Array<{
    code?: string;
    message?: string;
  }>;
};

export type ApiRequestError = Error & {
  status?: number;
  code?: string;
};

export async function parseApiSuccessEnvelope<T>(
  response: Response
): Promise<ApiSuccessEnvelope<T>> {
  return (await response.json()) as ApiSuccessEnvelope<T>;
}

export async function buildApiRequestError(
  response: Response
): Promise<ApiRequestError> {
  let payload: ApiErrorEnvelope | null = null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.toLowerCase().includes("application/json")) {
    try {
      payload = (await response.json()) as ApiErrorEnvelope;
    } catch {
      payload = null;
    }
  }

  const firstError = Array.isArray(payload?.errors) ? payload.errors[0] : undefined;
  const message =
    typeof firstError?.message === "string" && firstError.message.trim().length > 0
      ? firstError.message
      : `Request failed with status ${response.status}`;

  const error: ApiRequestError = new Error(message);
  error.status = response.status;
  if (typeof firstError?.code === "string" && firstError.code.trim().length > 0) {
    error.code = firstError.code;
  }

  return error;
}

export function requireSingleItem<T>(
  envelope: ApiSuccessEnvelope<T>,
  fallbackMessage: string
): T {
  const item = envelope.items[0];
  if (!item) {
    throw new Error(fallbackMessage);
  }
  return item;
}
