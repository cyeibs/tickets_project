import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function supportRoutes(app: FastifyInstance) {
  const schema = z.object({
    subject: z.string().min(1),
    description: z.string().min(1),
  });

  app.post(
    "/support",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const created = await app.prisma.supportRequest.create({
        data: {
          userId: (req as any).user.id,
          subject: parsed.data.subject,
          description: parsed.data.description,
        },
      });
      return { id: created.id };
    }
  );

  app.get("/support", { preHandler: [app.authenticate] }, async () => {
    const items = await app.prisma.supportRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { items };
  });
}
