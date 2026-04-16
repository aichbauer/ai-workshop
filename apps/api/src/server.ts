import { buildApp } from "./app.js";

const start = async () => {
  const app = await buildApp({ logger: true });
  const port = Number(process.env.PORT || process.env.API_PORT || 15988);
  const host = "0.0.0.0";

  await app.listen({ port, host });
};

start().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
