import { FastifyInstance } from "fastify";
import { z } from "zod";

function generateShortCode(length = 8): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // exclude similar chars
  let res = "";
  for (let i = 0; i < length; i++) {
    res += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return res;
}

export async function purchasesRoutes(app: FastifyInstance) {
  const createSchema = z.object({
    eventId: z.string().uuid(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    quantity: z.number().int().positive().default(1),
    statusCode: z.string().min(1).default("paid"),
  });

  app.post(
    "/purchases",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const { eventId, firstName, lastName, quantity, statusCode } =
        parsed.data;

      const status = await app.prisma.purchaseStatus.findUnique({
        where: { code: statusCode },
      });
      if (!status) return reply.code(400).send({ error: "Invalid status" });

      const event = await app.prisma.event.findUnique({
        where: { id: eventId },
        select: { price: true },
      });
      if (!event) return reply.code(404).send({ error: "Event not found" });

      // Per-ticket amounts
      const ticketPrice = Number(event.price);
      const ticketServiceTax = Number((ticketPrice * 0.1).toFixed(2));

      // Generate short order number (not guaranteed unique at DB level if nulls exist)
      let orderNumber = generateShortCode(8);

      const userId = (req as any).user.id as string;

      const created = await (app.prisma.purchase as any).create({
        data: {
          eventId,
          userId,
          firstName,
          lastName,
          price: ticketPrice,
          serviceTax: ticketServiceTax,
          statusId: status.id,
          orderNumber,
          quantity,
          // create tickets separately to avoid type include issues
        } as any,
      });

      // Create tickets after purchase is created
      const createdTickets = [] as string[];
      for (let i = 0; i < quantity; i++) {
        const t = await (app.prisma as any).ticket.create({
          data: {
            purchaseId: created.id,
            userId,
            eventId,
            code: generateShortCode(10),
          },
          select: { id: true },
        });
        createdTickets.push(t.id);
      }

      return {
        id: created.id,
        orderNumber: orderNumber,
        ticketIds: createdTickets,
      };
    }
  );

  // Single purchase by id (for polling after redirect)
  app.get(
    "/purchases/:id",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const id = (req.params as any).id as string;
      const userId = (req as any).user.id as string;
      const purchase = await app.prisma.purchase.findUnique({
        where: { id },
        include: {
          status: { select: { code: true, name: true } },
          tickets: { select: { id: true } },
        },
      });
      if (!purchase) return reply.code(404).send({ error: "Not found" });
      if (purchase.userId !== userId)
        return reply.code(403).send({ error: "Forbidden" });

      return {
        id: purchase.id,
        statusCode: purchase.status.code,
        orderNumber: purchase.orderNumber,
        ticketIds: purchase.tickets.map((t) => t.id),
      };
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
            // For "my purchases": include event details
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
    if (isEventParticipantsQuery) return { items };

    // Attach lightweight tickets info (ids only) for user's purchases
    const purchaseIds = items.map((p) => p.id);
    const tickets = await (app.prisma as any).ticket.findMany({
      where: { purchaseId: { in: purchaseIds } },
      select: { id: true, purchaseId: true },
      orderBy: { createdAt: "asc" },
    });
    const byPurchase = new Map<string, Array<{ id: string }>>();
    for (const t of tickets) {
      const arr = byPurchase.get(t.purchaseId) || [];
      arr.push({ id: t.id });
      byPurchase.set(t.purchaseId, arr);
    }
    const enriched = items.map((p) => ({
      ...p,
      tickets: byPurchase.get(p.id) || [],
    }));
    return { items: enriched };
  });
}
