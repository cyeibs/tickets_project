import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; role: string };
    user: { id: string; role: string };
  }
}
