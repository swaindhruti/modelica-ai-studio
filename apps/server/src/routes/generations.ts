import { z } from "zod";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/connection.ts";
import { generations } from "../db/schema.ts";
import { eq, desc } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.ts";

// Validation schema
const createGenerationSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1024),
  style: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export async function generationRoutes(fastify: FastifyInstance) {
  // POST /generations (Protected)
  fastify.post(
    "/",
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Validate request body
        const body = createGenerationSchema.parse(request.body);

        // Simulate 1-2 second processing delay
        const delay = 1000 + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Simulate 20% failure rate
        if (Math.random() < 0.2) {
          request.log.warn("Simulated model overload");
          return reply.status(503).send({ error: "Model overloaded" });
        }

        // Create generation record
        const [newGeneration] = await db
          .insert(generations)
          .values({
            userId: request.userId!,
            prompt: body.prompt,
            style: body.style,
            imageUrl: body.imageUrl,
            status: "completed",
          })
          .returning();

        if (!newGeneration) {
          return reply
            .status(500)
            .send({ error: "Failed to create generation" });
        }

        request.log.info(
          { generationId: newGeneration.id, userId: request.userId },
          "Generation created successfully"
        );

        return reply.status(201).send({
          generation: newGeneration,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.issues });
        }
        request.log.error(error, "Generation creation error");
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  // GET /generations (Protected)
  fastify.get(
    "/",
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Fetch user's generations (last 5, sorted by newest)
        const userGenerations = await db
          .select()
          .from(generations)
          .where(eq(generations.userId, request.userId!))
          .orderBy(desc(generations.createdAt))
          .limit(5);

        request.log.info(
          { userId: request.userId, count: userGenerations.length },
          "Fetched user generations"
        );

        return reply.send({
          generations: userGenerations,
        });
      } catch (error) {
        request.log.error(error, "Fetch generations error");
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  // DELETE /generations/:id (Protected)
  fastify.delete(
    "/:id",
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const generationId = parseInt(id, 10);

        if (isNaN(generationId)) {
          return reply.status(400).send({ error: "Invalid generation ID" });
        }

        // Fetch the generation to check ownership and get image path
        const [generation] = await db
          .select()
          .from(generations)
          .where(eq(generations.id, generationId))
          .limit(1);

        if (!generation) {
          return reply.status(404).send({ error: "Generation not found" });
        }

        // Check if the generation belongs to the user
        if (generation.userId !== request.userId) {
          return reply.status(403).send({ error: "Unauthorized" });
        }

        // For ImageKit, we don't delete the file from our server.
        // Deletion from ImageKit can be handled separately if needed.

        // Delete the generation from database
        await db.delete(generations).where(eq(generations.id, generationId));

        request.log.info(
          { generationId, userId: request.userId },
          "Generation deleted successfully"
        );

        return reply
          .status(200)
          .send({ message: "Generation deleted successfully" });
      } catch (error) {
        request.log.error(error, "Delete generation error");
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
}
