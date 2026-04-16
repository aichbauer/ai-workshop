export type RuntimeHealthServiceKey = "api";

export type RuntimeHealthStatus = "healthy" | "degraded" | "unreachable";

export type RuntimeHealthProbe = "http";

export type RuntimeHealthService = {
  key: RuntimeHealthServiceKey;
  status: RuntimeHealthStatus;
  endpoint: string;
  probe: RuntimeHealthProbe;
  latencyMs: number | null;
  detail: string;
};

export type RuntimeHealthReport = {
  checkedAt: string;
  services: RuntimeHealthService[];
};
