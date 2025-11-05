import "dotenv/config";
import Fastify from "fastify";
import type { FastifyInstance, FastifyServerOptions } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { env } from "./config/env.js";
import { connectDB } from "./db/connection.js";
import { authRoutes } from "./routes/auth.js";
import { generationRoutes } from "./routes/generations.js";

export async function build(
  opts: FastifyServerOptions = {}
): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger:
      opts.logger !== undefined
        ? opts.logger
        : env.NODE_ENV === "production"
          ? true // Simple logging in production
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
  const allowedOrigins = [
    "https://modelica-ai-atudio.netlify.app", // Production
    "http://localhost:5173", // Local Vite/React dev server
  ];

  await fastify.register(cors, {
    origin: (origin, cb) => {
      // origin will be undefined for "same-origin" requests (e.g., from Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true); // Allow
        return;
      }
      cb(new Error("Not allowed by CORS"), false); // Block
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Register JWT
  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Register routes
  await fastify.register(authRoutes, { prefix: "/auth" });
  await fastify.register(generationRoutes, { prefix: "/generations" });

  // Health check route
  fastify.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Connect to database (but don't crash if it fails initially)
  try {
    await connectDB(fastify.log);
  } catch (error) {
    fastify.log.error("Failed to connect to database on startup");
    fastify.log.error(error);
    // Don't throw - let the server start anyway
  }

  return fastify;
}

// Start server
async function start() {
  try {
    const fastify = await build();

    // Graceful shutdown handler
    const signals = ["SIGINT", "SIGTERM"];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        fastify.log.info(`Received ${signal}, closing server...`);
        await fastify.close();
        process.exit(0);
      });
    });

    // Start listening
    await fastify.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    fastify.log.info(`🚀 Server running on port ${env.PORT}`);
    fastify.log.info(`Environment: ${env.NODE_ENV}`);
  } catch (err) {
    console.error("❌ Server failed to start:");
    console.error(err);
    process.exit(1);
  }
}

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  start();
}
