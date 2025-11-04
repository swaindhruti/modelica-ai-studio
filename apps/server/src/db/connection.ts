import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.ts";
import type { FastifyBaseLogger } from "fastify";

// Create a PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM with the pool and schema
export const db = drizzle(pool, { schema });

// Function to test database connection
export async function connectDB(logger: FastifyBaseLogger) {
  try {
    const client = await pool.connect();
    logger.info("✅ Database connected successfully");
    client.release();
    return true;
  } catch (error) {
    logger.error(error, "❌ Database connection failed");
    throw error;
  }
}

// Graceful shutdown
export async function disconnectDB(logger: FastifyBaseLogger) {
  try {
    await pool.end();
    logger.info("Database pool has ended");
  } catch (error) {
    logger.error(error, "Error closing database pool");
    throw error;
  }
}
