import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { env } from "../config/env";

export default fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: env.jwtSecret,
    sign: { expiresIn: env.jwtExpiresIn },
  });

  fastify.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });
});
