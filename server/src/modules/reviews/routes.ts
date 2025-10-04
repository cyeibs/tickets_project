import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function reviewsRoutes(app: FastifyInstance) {
  const schema = z.object({
    eventId: z.string().uuid(),
    text: z.string().min(1),
    rating: z.number().int().min(0).max(5),
  });

  app.post(
    "/reviews",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const { eventId, text, rating } = parsed.data;
      const created = await app.prisma.review.upsert({
        where: {
          eventId_authorId: { eventId, authorId: (req as any).user.id },
        },
        update: { text, rating },
        create: { eventId, authorId: (req as any).user.id, text, rating },
      });
      return { id: created.id };
    }
  );

  app.get("/events/:id/reviews", async (req) => {
    const eventId = (req.params as any).id as string;
    const items = await app.prisma.review.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });
    return { items };
  });
}
