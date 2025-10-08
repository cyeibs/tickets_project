import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function subscriptionsRoutes(app: FastifyInstance) {
  const subscribeSchema = z.object({
    organizationId: z.string().uuid(),
  });

  app.get("/subscriptions", { preHandler: [app.authenticate] }, async (req) => {
    const userId = (req as any).user.id as string;
    const subs = await app.prisma.subscription.findMany({
      where: { userId },
      include: {
        organization: {
          include: { avatar: { select: { storagePath: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // compute ratingAvg per organization
    const items = await Promise.all(
      subs.map(async (s) => {
        const ratingAgg = await app.prisma.review.aggregate({
          _avg: { rating: true },
          where: { event: { organizationId: s.organizationId } },
        });
        const ratingAvg = ratingAgg._avg.rating ?? null;
        const reviewsCount = await app.prisma.review.count({
          where: { event: { organizationId: s.organizationId } },
        });
        return {
          id: s.id,
          org: {
            id: s.organization.id,
            name: s.organization.name,
            description: s.organization.description ?? null,
            avatar: s.organization.avatar
              ? { storagePath: s.organization.avatar.storagePath }
              : null,
            ratingAvg,
            reviewsCount,
          },
        };
      })
    );

    return { items };
  });

  app.post(
    "/subscriptions",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = subscribeSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const { organizationId } = parsed.data;
      const userId = (req as any).user.id as string;

      const created = await app.prisma.subscription.upsert({
        where: { userId_organizationId: { userId, organizationId } },
        update: {},
        create: { userId, organizationId },
      });
      return { id: created.id };
    }
  );

  app.delete(
    "/subscriptions/:organizationId",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const organizationId = (req.params as any).organizationId as string;
      const userId = (req as any).user.id as string;

      // validate UUID param
      const uuidSchema = z.string().uuid();
      const v = uuidSchema.safeParse(organizationId);
      if (!v.success) return reply.code(400).send(v.error);

      try {
        const deleted = await app.prisma.subscription.delete({
          where: { userId_organizationId: { userId, organizationId } },
        });
        return { id: deleted.id };
      } catch (e) {
        return reply.code(404).send({ error: "Subscription not found" });
      }
    }
  );
}
