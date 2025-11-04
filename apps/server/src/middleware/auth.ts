import type { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId?: number;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { userId: number };
    user: { userId: number };
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Verify JWT token
    await request.jwtVerify();

    // Attach userId to request object
    request.userId = request.user.userId;
  } catch (error) {
    reply.status(401).send({ error: "Unauthorized" });
  }
}
