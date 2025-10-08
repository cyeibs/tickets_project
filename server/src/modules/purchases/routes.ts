import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function purchasesRoutes(app: FastifyInstance) {
  const createSchema = z.object({
    eventId: z.string().uuid(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    price: z.number().nonnegative(),
    serviceTax: z.number().nonnegative(),
    statusCode: z.string().min(1),
  });

  app.post(
    "/purchases",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const { eventId, firstName, lastName, price, serviceTax, statusCode } =
        parsed.data;

      const status = await app.prisma.purchaseStatus.findUnique({
        where: { code: statusCode },
      });
      if (!status) return reply.code(400).send({ error: "Invalid status" });

      const created = await app.prisma.purchase.create({
        data: {
          eventId,
          userId: (req as any).user.id,
          firstName,
          lastName,
          price,
          serviceTax,
          statusId: status.id,
        },
      });
      return { id: created.id };
    }
  );

  app.get("/purchases", { preHandler: [app.authenticate] }, async (req) => {
    const q = (req.query as any) ?? {};
    const userId = (req as any).user.id as string;
    const where: any = {};
    if (q.eventId) where.eventId = q.eventId;
    if (q.statusCode) where.status = { code: q.statusCode };

    const isEventParticipantsQuery = Boolean(q.eventId);
    if (!isEventParticipantsQuery) {
      // When eventId is not provided, return only current user's purchases
      where.userId = userId;
    }

    const items = await app.prisma.purchase.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: isEventParticipantsQuery
        ? {
            // For participants listing by event: include purchaser user info
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: { select: { storagePath: true } },
              },
            },
          }
        : {
            // For "my purchases": include event details to render tickets
            event: {
              select: {
                id: true,
                name: true,
                eventDate: true,
                startTime: true,
                poster: { select: { storagePath: true } },
              },
            },
          },
    });
    return { items };
  });
}
