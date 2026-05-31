import { analyzeMealRequestSchema, foodDetectionResultSchema } from "@calorie-tracker/shared";
import type { FastifyInstance } from "fastify";
import { cleanupTransientImage, shouldPersistServerMedia } from "../security/privacy";
import { MealAnalysisService } from "../services/mealAnalysisService";

export async function registerAnalyzeMealRoute(app: FastifyInstance): Promise<void> {
  const mealAnalysisService = new MealAnalysisService();

  app.post("/v1/analyze-meal", async (request, reply) => {
    let image: Buffer | undefined;
    let rawBody: Record<string, unknown> = request.body && typeof request.body === "object" ? (request.body as Record<string, unknown>) : {};

    if (request.isMultipart()) {
      rawBody = {};
      const file = await request.file();
      if (file) {
        image = await file.toBuffer();
        rawBody = Object.fromEntries(
          Object.entries(file.fields).map(([key, field]) => [key, field && "value" in field ? field.value : undefined])
        );
      }
    }

    const body = analyzeMealRequestSchema.parse(rawBody);
    const input = {
      userId: request.user?.id ?? "anonymous",
      sourceMethod: body.sourceMethod,
      userConsentedToBackup: body.userConsentedToBackup,
      userConsentedToShare: body.userConsentedToShare
    };
    const result = await mealAnalysisService.analyzeMeal(image ? { ...input, image } : input);

    if (!shouldPersistServerMedia(body)) {
      await cleanupTransientImage(() => undefined);
    }

    return reply.code(200).send(foodDetectionResultSchema.parse(result));
  });
}