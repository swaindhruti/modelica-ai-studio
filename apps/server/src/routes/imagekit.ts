import { FastifyInstance } from "fastify";
import ImageKit from "imagekit";
import { env } from "../config/env";

const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

export async function imagekitRoutes(app: FastifyInstance) {
  app.get("/auth/imagekit", (request, reply) => {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    reply.send(authenticationParameters);
  });
}
