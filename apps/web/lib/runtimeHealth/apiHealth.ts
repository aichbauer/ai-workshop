import { apiUrl } from "../apiUrl";
import { parseApiSuccessEnvelope, requireSingleItem } from "../apiEnvelope";
import type { RuntimeHealthService } from "../runtimeHealthTypes";

type ApiHealthResponse = {
  status?: string;
};

export async function checkApiHealth(): Promise<RuntimeHealthService> {
  const endpoint = apiUrl("/health", "internal-public");
  const startedAt = Date.now();

  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    const latencyMs = Date.now() - startedAt;

    if (!response.ok) {
      return {
        key: "api",
        status: "unreachable",
        endpoint,
        probe: "http",
        latencyMs,
        detail: `HTTP ${response.status}`,
      };
    }

    const envelope = await parseApiSuccessEnvelope<ApiHealthResponse>(response);
    const payload = requireSingleItem(envelope, "Missing health payload");
    const payloadStatus = payload.status?.toLowerCase();

    if (payloadStatus === "ok") {
      return {
        key: "api",
        status: "healthy",
        endpoint,
        probe: "http",
        latencyMs,
        detail: "HTTP 200 · status=ok",
      };
    }

    return {
      key: "api",
      status: "degraded",
      endpoint,
      probe: "http",
      latencyMs,
      detail: payload.status ? `Unexpected status: ${payload.status}` : "Missing status field",
    };
  } catch (error) {
    return {
      key: "api",
      status: "unreachable",
      endpoint,
      probe: "http",
      latencyMs: null,
      detail: error instanceof Error ? error.message : "Request failed",
    };
  }
}
