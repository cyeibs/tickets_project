import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function authRoutes(app: FastifyInstance) {
  const checkPhoneSchema = z.object({
    telephone: z.string().min(5),
  });

  const registerSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    middleName: z.string().optional(),
    telephone: z.string().min(5),
    password: z.string().min(6),
  });

  app.post("/auth/check-phone", async (req, reply) => {
    const parsed = checkPhoneSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error);
    const { telephone } = parsed.data;

    const user = await app.prisma.user.findUnique({
      where: { telephone },
      select: { id: true },
    });

    return { exists: !!user };
  });

  app.post("/auth/register", async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error);

    const { firstName, lastName, middleName, telephone, password } =
      parsed.data;

    const exists = await app.prisma.user.findUnique({ where: { telephone } });
    if (exists) return reply.code(409).send({ error: "User already exists" });

    const role = await app.prisma.role.findUnique({ where: { code: "user" } });
    if (!role) return reply.code(500).send({ error: "Default role not found" });

    const hash = await bcrypt.hash(password, 10);
    const user = await app.prisma.user.create({
      data: {
        firstName,
        lastName,
        middleName,
        telephone,
        password: hash,
        roleId: role.id,
      },
    });

    const token = app.jwt.sign({ id: user.id, role: "user" });
    return { token };
  });

  const loginSchema = z.object({ telephone: z.string(), password: z.string() });
  app.post("/auth/login", async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error);
    const { telephone, password } = parsed.data;

    const user = await app.prisma.user.findUnique({
      where: { telephone },
      include: { role: true },
    });
    if (!user) return reply.code(401).send({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return reply.code(401).send({ error: "Invalid credentials" });

    const token = app.jwt.sign({ id: user.id, role: user.role.code });
    return { token };
  });

  app.get("/auth/me", { preHandler: [app.authenticate] }, async (req) => {
    const user = await app.prisma.user.findUnique({
      where: { id: (req as any).user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        telephone: true,
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
        avatarId: true,
        avatar: { select: { storagePath: true } },
        organizerApplications: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, status: true, createdAt: true },
        },
      },
    });
    return { user };
  });
}
