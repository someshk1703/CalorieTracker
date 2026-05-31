import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import Fastify, { type FastifyError } from "fastify";
import { registerRoutes } from "./routes";
import { authMiddleware } from "./security/authMiddleware";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });
  app.register(multipart, { limits: { fileSize: 8 * 1024 * 1024 } });

  app.addHook("preHandler", authMiddleware);

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    const statusCode = error.statusCode ?? 500;
    reply.code(statusCode).send({
      code: statusCode >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
      message: error.message,
      retryable: statusCode >= 500
    });
  });

  app.get("/health", { preHandler: [] }, async () => ({ status: "ok" }));

  app.register(registerRoutes);

  return app;
}