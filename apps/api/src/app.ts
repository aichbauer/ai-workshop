import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import cors from "@fastify/cors";
import { sendError, sendSuccess } from "./lib/apiResponse.js";
import { healthRouter } from "./routers/health.router.js";

export async function buildApp(
  options: FastifyServerOptions = { logger: true }
): Promise<FastifyInstance> {
  const app = Fastify(options);

  app.get("/", async (_request, reply) => {
    return sendSuccess(reply, {
      status: 200,
      kind: "infos",
      items: { message: "Fastify API is running here" },
      totalItems: 1,
    });
  });

  await app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  });
  await app.register(healthRouter, { prefix: "/v1/internal/public" });

  app.setNotFoundHandler((_request, reply) => {
    return sendError(reply, 404, { code: "NOT_FOUND", message: "Not found" });
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "Unhandled API error");
    if (reply.sent) {
      return;
    }

    const normalizedError = error as { statusCode?: number; message?: string };
    const statusCode =
      typeof normalizedError.statusCode === "number" ? normalizedError.statusCode : 500;
    const allowedClientStatuses = new Set([400, 401, 402, 403, 404, 405, 409, 429]);
    const status = allowedClientStatuses.has(statusCode) ? statusCode : 500;
    const code = status === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR";
    const message = status === 500 ? "Internal Server Error" : normalizedError.message ?? "";
    return sendError(reply, status as 400 | 401 | 402 | 403 | 404 | 405 | 409 | 429 | 500, {
      code,
      message,
    });
  });

  return app;
}
