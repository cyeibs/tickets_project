import { FastifyInstance } from "fastify";

export async function dictionariesRoutes(app: FastifyInstance) {
  app.get("/dictionaries/categories", async () => {
    const items = await app.prisma.eventCategory.findMany({
      orderBy: { name: "asc" },
    });
    return { items };
  });

  app.get("/dictionaries/cities", async () => {
    const items = await app.prisma.city.findMany({ orderBy: { name: "asc" } });
    return { items };
  });

  app.get("/dictionaries/colors", async () => {
    const items = await app.prisma.eventColor.findMany({
      orderBy: { name: "asc" },
    });
    return { items };
  });

  app.get("/dictionaries/story-colors", async () => {
    const items = await (app.prisma as any).storyColor.findMany({
      orderBy: { name: "asc" },
    });
    return { items };
  });

  app.get("/dictionaries/purchase-statuses", async () => {
    const items = await app.prisma.purchaseStatus.findMany({
      orderBy: { name: "asc" },
    });
    return { items };
  });

  app.get("/dictionaries/roles", async () => {
    const items = await app.prisma.role.findMany({ orderBy: { name: "asc" } });
    return { items };
  });
}
