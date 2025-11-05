import { build } from "../server";
import type { FastifyInstance } from "fastify";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

describe("ImageKit Routes", () => {
  let app: FastifyInstance;
  let authToken: string;
  const testUser = {
    email: "iktest@example.com",
    username: "iktestuser",
    password: "password123",
  };

  beforeAll(async () => {
    app = await build({ logger: false });
    await app.ready();

    // Clean up test user if exists
    await db.delete(users).where(eq(users.email, testUser.email));

    // Create test user
    const passwordHash = await bcrypt.hash(testUser.password, 10);
    await db.insert(users).values({
      email: testUser.email,
      username: testUser.username,
      passwordHash,
    });

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
    // Clean up test user
    await db.delete(users).where(eq(users.email, testUser.email));
    await app.close();
  });

  describe("GET /auth/imagekit", () => {
    it("should return ImageKit auth parameters with valid token", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/auth/imagekit",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty("token");
      expect(body).toHaveProperty("expire");
      expect(body).toHaveProperty("signature");
      expect(typeof body.token).toBe("string");
      expect(typeof body.expire).toBe("number");
      expect(typeof body.signature).toBe("string");
    });

    it("should reject request without authentication", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/auth/imagekit",
      });

      expect(response.statusCode).toBe(401);
    });

    it("should reject request with invalid token", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/auth/imagekit",
        headers: {
          authorization: "Bearer invalid-token",
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
