import "dotenv/config";
import Fastify from "fastify";
import type { FastifyInstance, FastifyServerOptions } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { env } from "./config/env.ts";
import { connectDB } from "./db/connection.ts";
import { authRoutes } from "./routes/auth.ts";
import { generationRoutes } from "./routes/generations.ts";

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
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        cb(null, true);
        return;
      }

      // In development, allow all origins
      if (env.NODE_ENV === "development") {
        cb(null, true);
        return;
      }

      // In production, allow specific origins
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://modelia-ai-studio.vercel.app",
        // Add your Vercel deployment URLs here
        /\.vercel\.app$/,
      ];

      const isAllowed = allowedOrigins.some((allowed) => {
        if (typeof allowed === "string") {
          return origin === allowed;
        }
        // RegExp
        return allowed.test(origin);
      });

      if (isAllowed) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
