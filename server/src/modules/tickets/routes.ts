import { FastifyInstance } from "fastify";

export async function ticketsRoutes(app: FastifyInstance) {
  app.get(
    "/tickets/:id",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const id = (req.params as any).id as string;
      const userId = (req as any).user.id as string;

      const ticket = await app.prisma.ticket.findUnique({
        where: { id },
        include: {
          purchase: {
            select: {
              id: true,
              orderNumber: true,
              status: { select: { code: true, name: true } },
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              eventDate: true,
              startTime: true,
              location: true,
              poster: { select: { storagePath: true } },
            },
          },
        },
      });

      if (!ticket) return reply.code(404).send({ error: "Not found" });
      if (ticket.userId !== userId)
        return reply.code(403).send({ error: "Forbidden" });

      return {
        ticket: {
          id: ticket.id,
          code: ticket.code,
          orderNumber: ticket.purchase.orderNumber,
          event: ticket.event,
        },
      };
    }
  );
}
