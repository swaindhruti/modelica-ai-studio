import "dotenv/config";
import Fastify from "fastify";
import type { FastifyInstance, FastifyServerOptions } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { env } from "./config/env.ts";
import { connectDB } from "./db/connection.ts";
import { authRoutes } from "./routes/auth.ts";
import { generationRoutes } from "./routes/generations.ts";
import { imagekitRoutes } from "./routes/imagekit.ts";

export async function build(
  opts: FastifyServerOptions = {}
): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger:
      opts.logger !== undefined
        ? opts.logger
        : {
            level: "info",
            transport: {
              target: "pino-pretty",
              options: {
                colorize: true,
                ignore: "pid,hostname",
                translateTime: "HH:MM:ss Z",
              },
            },
          },
    ...opts,
  });

  // Register CORS
  await fastify.register(cors, {
    origin: env.NODE_ENV === "production" ? false : "*",
    credentials: true,
  });

  // Register JWT
  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Register routes
  await fastify.register(authRoutes, { prefix: "/auth" });
  await fastify.register(generationRoutes, { prefix: "/generations" });
  await fastify.register(imagekitRoutes);

  // Health check route
  fastify.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Connect to database
  await connectDB(fastify.log);

  return fastify;
}

// Start server
async function start() {
  try {
    const fastify = await build();

    // Start listening
    await fastify.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    fastify.log.info(`🚀 Server running on http://localhost:${env.PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  start();
}
