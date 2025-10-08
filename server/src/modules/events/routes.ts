import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function eventsRoutes(app: FastifyInstance) {
  const baseSchema = z.object({
    organizationId: z.string().uuid(),
    posterId: z.string().uuid().nullable().optional(),
    name: z.string().min(1),
    description: z.string().optional(),
    categoryId: z.string().uuid(),
    cityId: z.string().uuid(),
    eventDate: z.coerce.date(),
    startTime: z.string(),
    location: z.string(),
    maxQuantity: z.number().int().positive(),
    price: z.number().nonnegative(),
    colorId: z.string().uuid(),
  });

  app.post(
    "/events",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = baseSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const data = parsed.data as any;
      const defaultStatus = await app.prisma.eventStatus.findUnique({
        where: { code: "moderation" },
      });
      if (!defaultStatus)
        return reply.code(500).send({ error: "Event status not configured" });
      const created = await app.prisma.event.create({
        data: { ...data, statusId: defaultStatus.id },
      });
      return { id: created.id };
    }
  );

  app.get("/events", async (req) => {
    const q = (req.query as any) ?? {};
    const where: any = {};
    if (q.cityId) where.cityId = q.cityId;
    if (q.categoryId) where.categoryId = q.categoryId;
    if (q.organizationId) where.organizationId = q.organizationId;
    if (q.statusCode) {
      const status = await app.prisma.eventStatus.findUnique({
        where: { code: String(q.statusCode) },
        select: { id: true },
      });
      if (status) where.statusId = status.id;
      else where.id = "__no_match__"; // force empty
    }
    if (q.dateFrom || q.dateTo) {
      where.eventDate = {};
      if (q.dateFrom) where.eventDate.gte = new Date(q.dateFrom);
      if (q.dateTo) where.eventDate.lte = new Date(q.dateTo);
    }
    if (q.completed === "true") {
      // completed = events in the past
      where.eventDate = { lt: new Date() };
    }
    if (q.q && typeof q.q === "string" && q.q.trim()) {
      const term = q.q.trim();
      where.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        { location: { contains: term, mode: "insensitive" } },
        {
          organization: {
            is: { name: { contains: term, mode: "insensitive" } },
          },
        },
      ];
    }

    const items = await app.prisma.event.findMany({
      where,
      orderBy: { eventDate: "asc" },
      include: {
        poster: { select: { storagePath: true } },
        organization: {
          select: {
            id: true,
            name: true,
            avatar: { select: { storagePath: true } },
          },
        },
        status: { select: { code: true, name: true } },
      },
    });
    return { items };
  });

  app.get("/events/:id", async (req, reply) => {
    const id = (req.params as any).id as string;
    const event = await app.prisma.event.findUnique({
      where: { id },
      include: {
        poster: { select: { storagePath: true } },
        organization: {
          select: {
            id: true,
            name: true,
            avatar: { select: { storagePath: true } },
          },
        },
      },
    });
    if (!event) return reply.code(404).send({ error: "Not found" });
    return { event };
  });

  app.patch(
    "/events/:id",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const id = (req.params as any).id as string;
      const parsed = baseSchema.partial().safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const updated = await app.prisma.event.update({
        where: { id },
        data: parsed.data as any,
      });
      return { id: updated.id };
    }
  );
}
