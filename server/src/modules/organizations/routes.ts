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

  // Submit organizer rights application
  const organizerApplicationSchema = z.object({
    organizationId: z.string().uuid().optional(),
    name: z.string().min(1),
    description: z.string().min(1),
    telephone: z.string().min(5),
    socialUrl: z.string().min(1),
    inn: z.string().min(1),
    ogrn: z.string().min(1),
    kpp: z.string().min(1),
    licence: z.string().min(1),
    avatarId: z.string().uuid().nullable().optional(),
  });

  app.post(
    "/organizer-applications",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = organizerApplicationSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);

      const userId = (req as any).user.id as string;

      // create application with pending status
      const created = await (app.prisma as any).organizerApplication.create({
        data: { ...parsed.data, userId },
        select: { id: true },
      });
      return { id: created.id };
    }
  );

  // Admin moderation endpoints (guarded by ADMIN_SECRET header)
  app.post("/organizer-applications/:id/approve", async (req, reply) => {
    const adminSecret = (req.headers["x-admin-secret"] as string) || "";
    if (
      adminSecret !== (app as any).config?.adminSecret &&
      adminSecret !== process.env.ADMIN_SECRET
    ) {
      return reply.code(403).send({ error: "Forbidden" });
    }
    const id = (req.params as any).id as string;
    const appRow = await (app.prisma as any).organizerApplication.findUnique({
      where: { id },
    });
    if (!appRow) return reply.code(404).send({ error: "Not found" });

    // If application is for updating existing organization
    if (appRow.organizationId) {
      const updated = await app.prisma.organization.update({
        where: { id: appRow.organizationId },
        data: {
          name: appRow.name,
          description: appRow.description,
          telephone: appRow.telephone,
          socialUrl: appRow.socialUrl,
          inn: appRow.inn,
          ogrn: appRow.ogrn,
          kpp: appRow.kpp,
          licence: appRow.licence,
          avatarId: appRow.avatarId ?? null,
        },
      });

      await (app.prisma as any).organizerApplication.update({
        where: { id },
        data: { status: "approved" },
      });

      return { id: updated.id };
    }

    // Otherwise, create a new organization from application fields
    const org = await app.prisma.organization.create({
      data: {
        name: appRow.name,
        description: appRow.description,
        telephone: appRow.telephone,
        socialUrl: appRow.socialUrl,
        inn: appRow.inn,
        ogrn: appRow.ogrn,
        kpp: appRow.kpp,
        licence: appRow.licence,
        avatarId: appRow.avatarId ?? null,
      },
    });

    // set user role to organizer and link organization
    const organizerRole = await app.prisma.role.findUnique({
      where: { code: "organizer" },
    });
    if (!organizerRole)
      return reply.code(500).send({ error: "Organizer role missing" });
    await app.prisma.user.update({
      where: { id: appRow.userId },
      data: { roleId: organizerRole.id, organizationId: org.id },
    });

    await (app.prisma as any).organizerApplication.update({
      where: { id },
      data: { status: "approved" },
    });

    return { id: org.id };
  });

  app.post("/organizer-applications/:id/reject", async (req, reply) => {
    const adminSecret = (req.headers["x-admin-secret"] as string) || "";
    if (
      adminSecret !== (app as any).config?.adminSecret &&
      adminSecret !== process.env.ADMIN_SECRET
    ) {
      return reply.code(403).send({ error: "Forbidden" });
    }
    const id = (req.params as any).id as string;
    const appRow = await (app.prisma as any).organizerApplication.findUnique({
      where: { id },
    });
    if (!appRow) return reply.code(404).send({ error: "Not found" });
    await (app.prisma as any).organizerApplication.update({
      where: { id },
      data: { status: "rejected" },
    });
    return { id };
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
    const items = await (app.prisma as any).organizationStory.findMany({
      where: { organizationId: id },
      orderBy: { createdAt: "desc" },
      include: { poster: { select: { storagePath: true } } },
    });
    return { items };
  });

  // Create organization story
  const createStorySchema = z.object({
    eventId: z.string().uuid(),
    description: z.string().optional(),
    colorId: z.string().uuid(),
    posterId: z.string().uuid().nullable().optional(),
  });

  app.post(
    "/organizations/:id/stories",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const organizationId = (req.params as any).id as string;
      const parsed = createStorySchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send(parsed.error);

      // Verify current user belongs to this organization
      const currentUser = await app.prisma.user.findUnique({
        where: { id: (req as any).user.id },
        select: { organizationId: true },
      });
      if (!currentUser || currentUser.organizationId !== organizationId) {
        return reply.code(403).send({ error: "Forbidden" });
      }

      // Ensure event belongs to this organization
      const event = await app.prisma.event.findUnique({
        where: { id: parsed.data.eventId },
        select: { id: true, name: true, organizationId: true },
      });
      if (!event || event.organizationId !== organizationId) {
        return reply.code(400).send({ error: "Invalid eventId" });
      }

      // Find selected color
      const color = await (app.prisma as any).storyColor.findUnique({
        where: { id: parsed.data.colorId },
      });
      if (!color) return reply.code(400).send({ error: "Invalid colorId" });

      const created = await (app.prisma as any).organizationStory.create({
        data: {
          organizationId,
          eventId: parsed.data.eventId,
          title: event.name,
          description: parsed.data.description,
          color: color.color,
          textColor: color.textColor,
          name: color.name,
          posterId: parsed.data.posterId ?? null,
        },
        select: { id: true },
      });
      return { id: created.id };
    }
  );

  // Drafts by organization
  app.get(
    "/organizations/:id/drafts",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const id = (req.params as any).id as string;
      const org = await app.prisma.organization.findUnique({ where: { id } });
      if (!org) return reply.code(404).send({ error: "Not found" });
      const items = await (app.prisma as any).eventDraft.findMany({
        where: { organizationId: id },
        orderBy: { updatedAt: "desc" },
        include: { poster: { select: { storagePath: true } } },
      });
      return { items };
    }
  );
}
