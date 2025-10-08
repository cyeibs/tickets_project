import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function organizationsRoutes(app: FastifyInstance) {
  const orgSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    telephone: z.string().optional(),
    socialUrl: z.string().optional(),
    inn: z.string().optional(),
    ogrn: z.string().optional(),
    kpp: z.string().optional(),
    licence: z.string().optional(),
    avatarId: z.string().uuid().nullable().optional(),
  });

  app.post(
    "/organizations",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = orgSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const data = parsed.data;

      const org = await app.prisma.organization.create({ data });
      return { id: org.id };
    }
  );

  app.get("/organizations/:id", async (req, reply) => {
    const id = (req.params as any).id as string;
    const org = await app.prisma.organization.findUnique({
      where: { id },
      include: { avatar: { select: { storagePath: true } } },
    });
    if (!org) return reply.code(404).send({ error: "Not found" });
    const ratingAgg = await app.prisma.review.aggregate({
      _avg: { rating: true },
      where: { event: { organizationId: id } },
    });
    const ratingAvg = ratingAgg._avg.rating ?? null;
    const reviewsCount = await app.prisma.review.count({
      where: { event: { organizationId: id } },
    });
    return { org: { ...org, ratingAvg, reviewsCount } };
  });

  app.patch(
    "/organizations/:id",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const id = (req.params as any).id as string;
      const parsed = orgSchema.partial().safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const org = await app.prisma.organization.update({
        where: { id },
        data: parsed.data,
      });
      return { id: org.id };
    }
  );

  // Stories by organization
  app.get("/organizations/:id/stories", async (req, reply) => {
    const id = (req.params as any).id as string;
    const org = await app.prisma.organization.findUnique({ where: { id } });
    if (!org) return reply.code(404).send({ error: "Not found" });
    const items = await app.prisma.organizationStory.findMany({
      where: { organizationId: id },
      orderBy: { createdAt: "desc" },
    });
    return { items };
  });
}
