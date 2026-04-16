import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { sendSuccess } from "../lib/apiResponse.js";

export async function healthRouter(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  fastify.get("/health", async (_request, reply) => {
    return sendSuccess(reply, {
      status: 200,
      kind: "healthChecks",
      items: [{ status: "ok", service: "api" }],
      totalItems: 1,
    });
  });
}
