import { FastifyInstance } from "fastify";
import { authRoutes } from "./modules/auth/routes";
import { usersRoutes } from "./modules/users/routes";
import { organizationsRoutes } from "./modules/organizations/routes";
import { eventsRoutes } from "./modules/events/routes";
import { dictionariesRoutes } from "./modules/dictionaries/routes";
import { reviewsRoutes } from "./modules/reviews/routes";
import { supportRoutes } from "./modules/support/routes";
import { purchasesRoutes } from "./modules/purchases/routes";
import { uploadsRoutes } from "./modules/uploads/routes";
import { ticketsRoutes } from "./modules/tickets/routes";
import { subscriptionsRoutes } from "./modules/subscriptions/routes";
import { favoritesRoutes } from "./modules/favorites/routes";

export async function registerRoutes(app: FastifyInstance) {
  await authRoutes(app);
  await usersRoutes(app);
  await organizationsRoutes(app);
  await eventsRoutes(app);
  await dictionariesRoutes(app);
  await reviewsRoutes(app);
  await supportRoutes(app);
  await purchasesRoutes(app);
  await uploadsRoutes(app);
  await ticketsRoutes(app);
  await subscriptionsRoutes(app);
  await favoritesRoutes(app);
}
