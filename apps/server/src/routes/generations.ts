import { z } from "zod";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/connection.js";
import { generations } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.js";
import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";
import { randomUUID } from "crypto";

// Validation schema
const createGenerationSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1024),
  style: z.string().optional(),
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

        // Handle file upload if present
        let imageUrl: string | undefined;
        const data = await request.file();

        if (data) {
          // Validate file type
          if (!data.mimetype.startsWith("image/")) {
            return reply.status(400).send({ error: "File must be an image" });
          }

          // Generate unique filename
          const ext = path.extname(data.filename);
          const filename = `${randomUUID()}${ext}`;
          const uploadsDir = path.join(process.cwd(), "uploads");
          const filepath = path.join(uploadsDir, filename);

          // Ensure uploads directory exists
          await fs.mkdir(uploadsDir, { recursive: true });

          // Read file buffer
          const buffer = await data.toBuffer();

          // Resize image using sharp
          await sharp(buffer)
            .resize(512, 512, {
              fit: "cover",
              position: "center",
            })
            .toFile(filepath);

          imageUrl = `/uploads/${filename}`;
          request.log.info({ filename }, "Image uploaded and resized");
        }

        // Create generation record
        const [newGeneration] = await db
          .insert(generations)
          .values({
            userId: request.userId!,
            prompt: body.prompt,
            style: body.style,
            imageUrl,
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
}
