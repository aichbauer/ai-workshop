const VERSIONED_PREFIX_INTERNAL_PUBLIC = "/v1/internal/public";
const VERSIONED_PREFIX_EXTERNAL_PUBLIC = "/v1/external/public";

type ApiScope = "external-public" | "internal-public";

export function apiUrl(path: string, scope: ApiScope = "external-public"): string {
  const internalBase = process.env.API_INTERNAL_URL ?? "http://api:15988";
  const publicBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:15988";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const isServerDev =
    typeof window === "undefined" && process.env.NODE_ENV === "development";

  if (isServerDev) {
    if (scope === "internal-public") {
      return `${internalBase}${VERSIONED_PREFIX_INTERNAL_PUBLIC}${normalizedPath}`;
    }

    return `${publicBase}${VERSIONED_PREFIX_EXTERNAL_PUBLIC}${normalizedPath}`;
  }

  if (scope === "internal-public") {
    return `${publicBase}${VERSIONED_PREFIX_INTERNAL_PUBLIC}${normalizedPath}`;
  }

  return `${publicBase}${VERSIONED_PREFIX_EXTERNAL_PUBLIC}${normalizedPath}`;
}
