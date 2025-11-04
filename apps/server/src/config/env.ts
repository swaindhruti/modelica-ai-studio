import type { FastifyBaseLogger } from "fastify";

// Simple function to check if all required env variables are present
export function checkEnvVariables(logger: FastifyBaseLogger) {
  const requiredEnvs = ["NODE_ENV", "PORT", "DATABASE_URL", "JWT_SECRET"];
  const missing: string[] = [];

  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      missing.push(env);
    }
  }

  if (missing.length > 0) {
    logger.error(
      `❌ Environment variables not available: ${missing.join(", ")}`
    );
    process.exit(1);
  }

  logger.info("✅ All environment variables are available");
}
