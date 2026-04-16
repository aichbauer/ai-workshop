import "server-only";

import { checkApiHealth } from "./runtimeHealth/apiHealth";
import type { RuntimeHealthReport } from "./runtimeHealthTypes";

export async function fetchRuntimeHealth(): Promise<RuntimeHealthReport> {
  const apiService = await checkApiHealth();

  return {
    checkedAt: new Date().toISOString(),
    services: [apiService],
  };
}
