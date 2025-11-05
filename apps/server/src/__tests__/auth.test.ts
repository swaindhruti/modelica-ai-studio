import { build } from "../server";
import type { FastifyInstance } from "fastify";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

describe("Auth Routes", () => {
  let app: FastifyInstance;
  const testUser = {
    email: "test@example.com",
    username: "testuser",
    password: "password123",
  };

  beforeAll(async () => {
    app = await build({ logger: false });
    await app.ready();

    // Clean up test user if exists
    await db.delete(users).where(eq(users.email, testUser.email));
  });

  afterAll(async () => {
    // Clean up test user
    await db.delete(users).where(eq(users.email, testUser.email));
    await app.close();
  });

  describe("POST /auth/signup", () => {
    it("should create a new user with valid data", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: testUser,
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.message).toBe("User created successfully");
      expect(body.user).toHaveProperty("id");
      expect(body.user.email).toBe(testUser.email);
      expect(body.user.username).toBe(testUser.username);
    });

    it("should reject duplicate email", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: testUser,
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe("User already exists");
    });

    it("should reject invalid email", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: {
          email: "invalid-email",
          username: "testuser2",
          password: "password123",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should reject short password", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: {
          email: "test2@example.com",
          username: "testuser2",
          password: "short",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should reject short username", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: {
          email: "test2@example.com",
          username: "ab",
          password: "password123",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /auth/login", () => {
    it("should login with valid credentials", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          email: testUser.email,
          password: testUser.password,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty("token");
      expect(body.user.email).toBe(testUser.email);
    });

    it("should reject invalid password", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          email: testUser.email,
          password: "wrongpassword",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("should reject non-existent user", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          email: "nonexistent@example.com",
          password: "password123",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("should reject invalid email format", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          email: "invalid-email",
          password: "password123",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
