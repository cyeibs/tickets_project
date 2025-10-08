import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function favoritesRoutes(app: FastifyInstance) {
  const favoriteSchema = z.object({ eventId: z.string().uuid() });

  app.get("/favorites", { preHandler: [app.authenticate] }, async (req) => {
    const userId = (req as any).user.id as string;
    const prismaAny = app.prisma as any;
    const items = await prismaAny.favorite.findMany({
      where: { userId },
      include: {
        event: { include: { poster: { select: { storagePath: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { items };
  });

  app.post(
    "/favorites",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = favoriteSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const { eventId } = parsed.data;
      const userId = (req as any).user.id as string;

      const prismaAny = app.prisma as any;
      const created = await prismaAny.favorite.upsert({
        where: { userId_eventId: { userId, eventId } },
        update: {},
        create: { userId, eventId },
      });
      return { id: created.id };
    }
  );

  app.delete(
    "/favorites/:eventId",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const eventId = (req.params as any).eventId as string;
      const userId = (req as any).user.id as string;
      const uuidSchema = z.string().uuid();
      const v = uuidSchema.safeParse(eventId);
      if (!v.success) return reply.code(400).send(v.error);

      try {
        const prismaAny = app.prisma as any;
        const deleted = await prismaAny.favorite.delete({
          where: { userId_eventId: { userId, eventId } },
        });
        return { id: deleted.id };
      } catch (e) {
        return reply.code(404).send({ error: "Favorite not found" });
      }
    }
  );
}
