import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/users/:id", async (req, reply) => {
    const id = (req.params as any).id as string;
    const user = await app.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        telephone: true,
        avatarId: true,
        avatar: { select: { storagePath: true } },
        role: { select: { code: true, name: true } },
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            description: true,
            avatar: { select: { storagePath: true } },
          },
        },
        organizerApplications: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, status: true, createdAt: true },
        },
      } as any,
    });
    if (!user) return reply.code(404).send({ error: "Not found" });
    return { user };
  });

  const updateSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    telephone: z.string().optional(),
    avatarId: z.string().uuid().nullable().optional(),
  });

  app.patch(
    "/users/me",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);
      const data = parsed.data;
      const updated = await app.prisma.user.update({
        where: { id: (req as any).user.id },
        data,
      });
      return { id: updated.id };
    }
  );
}
