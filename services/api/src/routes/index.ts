import type { FastifyInstance } from "fastify";
import { registerAnalyzeMealRoute } from "./analyzeMeal";
import { registerResolveNutritionRoute } from "./resolveNutrition";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await registerAnalyzeMealRoute(app);
  await registerResolveNutritionRoute(app);
}