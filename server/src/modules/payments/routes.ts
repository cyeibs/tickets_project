import { FastifyInstance } from "fastify";
import { z } from "zod";
import { env } from "../../config/env";

function generateShortCode(length = 8): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let res = "";
  for (let i = 0; i < length; i++) {
    res += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return res;
}

export async function paymentsRoutes(app: FastifyInstance) {
  const createSchema = z.object({
    eventId: z.string().uuid(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    quantity: z.number().int().positive().default(1),
  });

  app.post(
    "/payments",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const { eventId, firstName, lastName, quantity } = parsed.data;

      const statusCreated = await app.prisma.purchaseStatus.findUnique({
        where: { code: "created" },
      });
      if (!statusCreated)
        return reply
          .code(500)
          .send({ error: "Purchase statuses are not configured" });

      const event = await app.prisma.event.findUnique({
        where: { id: eventId },
        select: { price: true, name: true },
      });
      if (!event) return reply.code(404).send({ error: "Event not found" });

      const ticketPrice = Number(event.price);
      const ticketServiceTax = Number((ticketPrice * 0.1).toFixed(2));
      const total = Number(
        ((ticketPrice + ticketServiceTax) * quantity).toFixed(2)
      );

      const userId = (req as any).user.id as string;
      const orderNumber = generateShortCode(8);

      const purchase = await (app.prisma.purchase as any).create({
        data: {
          eventId,
          userId,
          firstName,
          lastName,
          price: ticketPrice,
          serviceTax: ticketServiceTax,
          statusId: statusCreated.id,
          orderNumber,
          quantity,
        } as any,
        select: { id: true },
      });

      const idempotenceKey = purchase.id;
      const authHeader =
        "Basic " +
        Buffer.from(
          `${env.yookassa.shopId}:${env.yookassa.secretKey}`
        ).toString("base64");

      const response = await fetch("https://api.yookassa.ru/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          "Idempotence-Key": idempotenceKey,
        },
        body: JSON.stringify({
          amount: { value: total.toFixed(2), currency: "RUB" },
          capture: true,
          confirmation: {
            type: "redirect",
            return_url: `${env.clientBaseUrl}/payment/success?purchaseId=${purchase.id}`,
          },
          description: `Оплата заказа ${orderNumber} (${event.name})`,
          metadata: { purchaseId: purchase.id },
        }),
      });

      if (!response.ok) {
        app.log.error(
          { status: response.status },
          "YooKassa payment create failed"
        );
        return reply.code(502).send({ error: "Payment gateway error" });
      }
      const payment = (await response.json()) as any;
      const confirmationUrl = payment?.confirmation?.confirmation_url as
        | string
        | undefined;
      if (!confirmationUrl) {
        return reply
          .code(502)
          .send({ error: "Payment confirmation URL not received" });
      }

      return { purchaseId: purchase.id, confirmationUrl };
    }
  );

  // YooKassa webhook endpoint
  app.post("/payments/webhook", async (req, reply) => {
    const body = req.body as any;
    try {
      const event = body?.event as string | undefined;
      const object = body?.object as any;
      if (!event || !object)
        return reply.code(400).send({ error: "Invalid payload" });

      if (event === "payment.succeeded") {
        const purchaseId = object?.metadata?.purchaseId as string | undefined;
        if (!purchaseId)
          return reply.code(400).send({ error: "No purchaseId in metadata" });

        const purchase = await app.prisma.purchase.findUnique({
          where: { id: purchaseId },
          select: {
            id: true,
            quantity: true,
            status: { select: { code: true } },
          },
        });
        if (!purchase)
          return reply.code(404).send({ error: "Purchase not found" });
        if (purchase.status.code === "paid") return reply.send({ ok: true });

        const statusPaid = await app.prisma.purchaseStatus.findUnique({
          where: { code: "paid" },
          select: { id: true },
        });
        if (!statusPaid)
          return reply.code(500).send({ error: "Statuses misconfigured" });

        // Mark purchase paid
        await app.prisma.purchase.update({
          where: { id: purchaseId },
          data: { statusId: statusPaid.id },
        });

        // Create tickets if not exist
        const existingCount = await (app.prisma as any).ticket.count({
          where: { purchaseId },
        });
        if (existingCount === 0) {
          const userAndEvent = await app.prisma.purchase.findUnique({
            where: { id: purchaseId },
            select: { userId: true, eventId: true, quantity: true },
          });
          if (userAndEvent) {
            for (let i = 0; i < (userAndEvent.quantity || 1); i++) {
              await (app.prisma as any).ticket.create({
                data: {
                  purchaseId,
                  userId: userAndEvent.userId,
                  eventId: userAndEvent.eventId,
                  code: generateShortCode(10),
                },
              });
            }
          }
        }

        return reply.send({ ok: true });
      }

      if (event === "payment.canceled") {
        const purchaseId = object?.metadata?.purchaseId as string | undefined;
        if (!purchaseId)
          return reply.code(400).send({ error: "No purchaseId in metadata" });
        const statusCanceled = await app.prisma.purchaseStatus.findUnique({
          where: { code: "canceled" },
          select: { id: true },
        });
        if (statusCanceled) {
          await app.prisma.purchase.update({
            where: { id: purchaseId },
            data: { statusId: statusCanceled.id },
          });
        }
        return reply.send({ ok: true });
      }

      return reply.code(200).send({ ok: true });
    } catch (e) {
      app.log.error(e);
      return reply.code(500).send({ error: "Internal error" });
    }
  });
}
