import { build } from "../server";
import type { FastifyInstance } from "fastify";
import { db } from "../db/connection";
import { users, generations } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

describe("Generation Routes", () => {
  let app: FastifyInstance;
  let authToken: string;
  let userId: number;
  const testUser = {
    email: "gentest@example.com",
    username: "gentestuser",
    password: "password123",
  };

  beforeAll(async () => {
    app = await build({ logger: false });
    await app.ready();

    // Clean up test user if exists
    await db.delete(users).where(eq(users.email, testUser.email));

    // Create test user
    const passwordHash = await bcrypt.hash(testUser.password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        email: testUser.email,
        username: testUser.username,
        passwordHash,
      })
      .returning();

    userId = newUser!.id;

    // Login to get token
    const loginResponse = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    const loginBody = JSON.parse(loginResponse.body);
    authToken = loginBody.token;
  });

  afterAll(async () => {
    // Clean up test generations
    await db.delete(generations).where(eq(generations.userId, userId));
    // Clean up test user
    await db.delete(users).where(eq(users.email, testUser.email));
    await app.close();
  });

  describe("POST /generations", () => {
    it("should create a generation with valid data", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/generations",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          prompt: "A beautiful sunset over mountains",
          style: "photorealistic",
        },
      });

      // Could be 201 (success) or 503 (simulated overload)
      expect([201, 503]).toContain(response.statusCode);

      if (response.statusCode === 201) {
        const body = JSON.parse(response.body);
        expect(body.generation).toHaveProperty("id");
        expect(body.generation.prompt).toBe(
          "A beautiful sunset over mountains"
        );
        expect(body.generation.style).toBe("photorealistic");
        expect(body.generation.userId).toBe(userId);
      }
    });

    it("should create a generation with imageUrl", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/generations",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          prompt: "A futuristic city",
          style: "anime",
          imageUrl: "https://example.com/image.jpg",
        },
      });

      expect([201, 503]).toContain(response.statusCode);

      if (response.statusCode === 201) {
        const body = JSON.parse(response.body);
        expect(body.generation.imageUrl).toBe("https://example.com/image.jpg");
      }
    });

    it("should reject request without authentication", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/generations",
        payload: {
          prompt: "A beautiful sunset",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("should reject empty prompt", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/generations",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          prompt: "",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should reject invalid imageUrl", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/generations",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          prompt: "Test prompt",
          imageUrl: "not-a-valid-url",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /generations", () => {
    beforeAll(async () => {
      // Create some test generations
      await db.insert(generations).values([
        {
          userId,
          prompt: "Test prompt 1",
          style: "photorealistic",
          status: "completed",
        },
        {
          userId,
          prompt: "Test prompt 2",
          style: "anime",
          status: "completed",
        },
      ]);
    });

    it("should fetch user generations", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/generations",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.generations).toBeInstanceOf(Array);
      expect(body.generations.length).toBeGreaterThan(0);
      expect(body.generations[0]).toHaveProperty("id");
      expect(body.generations[0]).toHaveProperty("prompt");
    });

    it("should reject request without authentication", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/generations",
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("DELETE /generations/:id", () => {
    let generationToDelete: number;

    beforeAll(async () => {
      // Create a generation to delete
      const [gen] = await db
        .insert(generations)
        .values({
          userId,
          prompt: "To be deleted",
          style: "photorealistic",
          status: "completed",
        })
        .returning();
      generationToDelete = gen!.id;
    });

    it("should delete a generation", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: `/generations/${generationToDelete}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.message).toBe("Generation deleted successfully");
    });

    it("should reject deleting non-existent generation", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/generations/999999",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it("should reject request without authentication", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: `/generations/${generationToDelete}`,
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
