import { analyzeMealRequestSchema, foodDetectionResultSchema } from "@calorie-tracker/shared";
import type { FastifyInstance } from "fastify";
import { cleanupTransientImage, shouldPersistServerMedia } from "../security/privacy";
import { MealAnalysisService } from "../services/mealAnalysisService";

export async function registerAnalyzeMealRoute(app: FastifyInstance): Promise<void> {
  const mealAnalysisService = new MealAnalysisService();

  app.post("/v1/analyze-meal", async (request, reply) => {
    const body = analyzeMealRequestSchema.parse(request.body ?? {});
    const result = await mealAnalysisService.analyzeMeal({
      userId: request.user?.id ?? "anonymous",
      sourceMethod: body.sourceMethod,
      userConsentedToBackup: body.userConsentedToBackup,
      userConsentedToShare: body.userConsentedToShare
    });

    if (!shouldPersistServerMedia(body)) {
      await cleanupTransientImage(() => undefined);
    }

    return reply.code(200).send(foodDetectionResultSchema.parse(result));
  });
}