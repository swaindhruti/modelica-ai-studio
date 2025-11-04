import { z } from "zod";
import bcrypt from "bcryptjs";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/connection.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // POST /auth/signup
  fastify.post(
    "/signup",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Validate request body
        const body = signupSchema.parse(request.body);

        // Check if user already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, body.email))
          .limit(1);

        if (existingUser.length > 0) {
          return reply.status(400).send({ error: "User already exists" });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(body.password, 10);

        // Create user
        const [newUser] = await db
          .insert(users)
          .values({
            email: body.email,
            username: body.username,
            passwordHash,
          })
          .returning();

        if (!newUser) {
          return reply.status(500).send({ error: "Failed to create user" });
        }

        request.log.info({ userId: newUser.id }, "User created successfully");

        return reply.status(201).send({
          message: "User created successfully",
          user: {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
          },
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.issues });
        }
        request.log.error(error, "Signup error");
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  // POST /auth/login
  fastify.post(
    "/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Validate request body
        const body = loginSchema.parse(request.body);

        // Find user by email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, body.email))
          .limit(1);

        if (!user) {
          return reply.status(401).send({ error: "Invalid credentials" });
        }

        // Compare password
        const isValid = await bcrypt.compare(body.password, user.passwordHash);

        if (!isValid) {
          return reply.status(401).send({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = await reply.jwtSign({ userId: user.id });

        request.log.info({ userId: user.id }, "User logged in successfully");

        return reply.send({
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            tier: user.tier,
            credits: user.credits,
          },
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.issues });
        }
        request.log.error(error, "Login error");
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
}
