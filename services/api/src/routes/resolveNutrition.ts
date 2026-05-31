import { nutritionEstimateSchema, resolveNutritionRequestSchema } from "@calorie-tracker/shared";
import type { FastifyInstance } from "fastify";
import { MealAnalysisService } from "../services/mealAnalysisService";

export async function registerResolveNutritionRoute(app: FastifyInstance): Promise<void> {
  const mealAnalysisService = new MealAnalysisService();

  app.post("/v1/nutrition/resolve", async (request, reply) => {
    const body = resolveNutritionRequestSchema.parse(request.body ?? {});
    const result = await mealAnalysisService.resolveNutrition(body.detectedFoods, body.servings);

    return reply.code(200).send(nutritionEstimateSchema.parse(result));
  });
}