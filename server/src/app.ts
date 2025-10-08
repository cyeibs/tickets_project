import Fastify from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { env } from "./config/env";
import prismaPlugin from "./plugins/prisma";
import authPlugin from "./plugins/auth";
import { registerRoutes } from "./routes";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(helmet, {
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  });
  app.register(cors, {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.register(multipart, {
    limits: { fileSize: env.maxFileSizeMB * 1024 * 1024 },
  });
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), env.uploadDir),
    prefix: "/uploads/",
  });

  app.register(prismaPlugin);
  app.register(authPlugin);

  // routes
  app.get("/health", async () => ({ status: "ok" }));
  app.register(registerRoutes);

  return app;
}
