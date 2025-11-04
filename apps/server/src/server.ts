import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { checkEnvVariables } from "./config/env.js";
import { connectDB } from "./db/connection.js";
import { authRoutes } from "./routes/auth.js";
import { generationRoutes } from "./routes/generations.js";
import path from "path";

const fastify = Fastify({
  logger: {
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
});

// Start server
async function start() {
  try {
    // Check if all environment variables are present
    checkEnvVariables(fastify.log);

    // Register CORS
    await fastify.register(cors, {
      origin: process.env.NODE_ENV === "production" ? false : "*",
      credentials: true,
    });

    // Register JWT
    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET!,
    });

    // Register multipart for file uploads
    await fastify.register(multipart, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    });

    // Register static file serving for uploads
    await fastify.register(fastifyStatic, {
      root: path.join(process.cwd(), "uploads"),
      prefix: "/uploads/",
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

    // Start listening
    await fastify.listen({
      port: parseInt(process.env.PORT!),
      host: "0.0.0.0",
    });

    fastify.log.info(
      `🚀 Server running on http://localhost:${process.env.PORT}`
    );
    fastify.log.info(`📁 Static files served from /uploads`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
